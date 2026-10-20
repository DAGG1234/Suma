// src/services/profileService.ts
import { supabase } from '../services/supabase'

export interface UserProfile {
  id: string
  first_name: string
  last_name: string
  pin_code: string
}

// Obtener perfil actual del usuario
export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, pin_code')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error al obtener perfil:', error.message)
    return null
  }

  return data
}

// Validar si el PIN ingresado coincide con pin_code en Supabase
export async function validateUserPin(userId: string, enteredPin: string): Promise<boolean> {
  const profile = await fetchUserProfile(userId)
  if (!profile) return false

  return profile.pin_code === enteredPin
}

// Actualizar first_name, last_name o pin_code en la tabla profiles
export async function updateProfileField(userId: string, fields: Partial<UserProfile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(fields)
    .eq('id', userId)
    .select()

  if (error) {
    console.error('Error al actualizar perfil:', error.message)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}