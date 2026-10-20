import { ref, onMounted } from 'vue'
import { supabase } from '../services/supabase'
import { useRouter } from 'vue-router'
import type { User } from '@supabase/supabase-js'

// Estado reactivo global compartido
const user = ref<User | null>(null)
const errorMessage = ref('')
const isLoading = ref(false)

export function useAuth() {
  const router = useRouter()

  // Sincronizar estado inicial de Supabase Auth y sus cambios en tiempo real
  const initSession = async () => {
    const { data } = await supabase.auth.getSession()
    user.value = data.session?.user ?? null

    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null
    })
  }

  onMounted(() => {
    if (!user.value) {
      initSession()
    }
  })

  // 1. REGISTRO: Crea usuario en Auth e inserta el perfil con pin_code en public.profiles
  const register = async (formData: {
    firstName: string
    lastName: string
    email: string
    password: string
    pin: string
  }) => {
    isLoading.value = true
    errorMessage.value = ''

    try {
      // Registrar en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          },
        },
      })

      if (authError) throw authError

      if (authData.user) {
        user.value = authData.user

        // Insertar perfil y pin_code en public.profiles
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            first_name: formData.firstName,
            last_name: formData.lastName,
            pin_code: formData.pin,
          })

        if (profileError) throw profileError

        // Guardar sesión local y redirigir
        localStorage.setItem('suma_user_id', authData.user.id)
        localStorage.setItem('suma_user_name', formData.firstName)

        await router.push('/dashboard')
      }
    } catch (err: any) {
      errorMessage.value = err.message || 'Error al registrar la cuenta'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 2. INICIO DE SESIÓN POR PIN: Consulta coincidencia de pin_code en public.profiles
  const loginWithPin = async (pin: string) => {
    isLoading.value = true
    errorMessage.value = ''

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, pin_code')
        .eq('pin_code', pin)
        .single()

      if (error || !profile) {
        throw new Error('PIN incorrecto. Inténtalo de nuevo.')
      }

      localStorage.setItem('suma_user_id', profile.id)
      localStorage.setItem('suma_user_name', profile.first_name)

      await router.push('/dashboard')
    } catch (err: any) {
      errorMessage.value = err.message || 'Error al iniciar sesión por PIN'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 3. INICIO DE SESIÓN POR EMAIL: Autenticación tradicional mediante correo/contraseña
  const loginWithEmail = async (emailVal: string, passwordVal: string) => {
    isLoading.value = true
    errorMessage.value = ''

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: emailVal,
        password: passwordVal,
      })

      if (authError) throw authError

      if (authData.user) {
        user.value = authData.user

        // Consultar el perfil para obtener el nombre de usuario
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name')
          .eq('id', authData.user.id)
          .single()

        localStorage.setItem('suma_user_id', authData.user.id)
        if (profile?.first_name) {
          localStorage.setItem('suma_user_name', profile.first_name)
        }

        await router.push('/dashboard')
      }
    } catch (err: any) {
      errorMessage.value = err.message || 'Error al iniciar sesión'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 4. VERIFICAR DISPONIBILIDAD DE PIN: Comprueba si un PIN ya está en uso
  const checkPinAvailability = async (pin: string): Promise<boolean> => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('id')
        .eq('pin_code', pin)
        .maybeSingle()

      // Retorna true si está libre (no existe), false si ya está ocupado
      return !data
    } catch (err) {
      return true
    }
  }

  // 5. CERRAR SESIÓN
  const logout = async () => {
    isLoading.value = true
    try {
      await supabase.auth.signOut()
      user.value = null
      localStorage.removeItem('suma_user_id')
      localStorage.removeItem('suma_user_name')
      await router.push('/login')
    } catch (err: any) {
      errorMessage.value = err.message || 'Error al cerrar sesión'
    } finally {
      isLoading.value = false
    }
  }

  return {
    user,
    register,
    loginWithPin,
    loginWithEmail,
    checkPinAvailability,
    logout,
    errorMessage,
    isLoading,
  }
}