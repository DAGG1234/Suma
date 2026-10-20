// src/stores/useSavingsStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../services/supabase'
import { useBalanceStore } from './useBalanceStore'

export interface SavingsGoal {
  id?: string
  user_id?: string
  title: string
  description?: string
  currency: 'VES' | 'USD' | 'USDT' | 'EUR'
  target_amount: number
  current_saved_amount: number
  goal_type?: 'fixed' | 'rotative'
  created_at?: string
}

export const useSavingsStore = defineStore('savings', () => {
  const goals = ref<SavingsGoal[]>([])
  const balanceStore = useBalanceStore()

  const fetchGoals = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) return

      const { data, error } = await supabase
        .from('savings_goals')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      if (data) goals.value = data
    } catch (err) {
      console.error('Error al cargar metas:', err)
    }
  }

  const addGoal = async (newGoal: {
    title: string
    description?: string
    currency: 'VES' | 'USD' | 'USDT' | 'EUR'
    target_amount: number
    current_saved_amount?: number
    goal_type?: 'fixed' | 'rotative'
  }) => {
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) return

      const goalPayload = {
        user_id: userData.user.id,
        title: newGoal.title,
        description: newGoal.description || '',
        currency: newGoal.currency,
        target_amount: newGoal.target_amount,
        current_saved_amount: newGoal.current_saved_amount || 0,
        goal_type: newGoal.goal_type || 'fixed'
      }

      const { data, error } = await supabase
        .from('savings_goals')
        .insert([goalPayload])
        .select()

      if (error) throw error
      if (data && data[0]) goals.value.unshift(data[0])
    } catch (err) {
      console.error('Error al crear meta:', err)
    }
  }

  // Depositar validando saldo disponible mediante rawBalanceVES
  const depositToGoal = async (id: string, amountVES: number, goalTitle: string, amountForeign: number) => {
    try {
      const goal = goals.value.find((g) => g.id === id)
      if (!goal) return { success: false, message: 'Meta no encontrada' }

      // Validar si el saldo general en VES es suficiente
      const currentBalanceVES = Number(balanceStore.rawBalanceVES) || 0
      if (amountVES > currentBalanceVES) {
        return { 
          success: false, 
          message: `Saldo insuficiente. Tienes Bs. ${currentBalanceVES.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} disponibles.` 
        }
      }

      const updatedAmount = Number(goal.current_saved_amount) + Number(amountForeign)

      // Actualizar la meta de ahorro en Supabase
      const { error: goalError } = await supabase
        .from('savings_goals')
        .update({ current_saved_amount: updatedAmount })
        .eq('id', id)

      if (goalError) throw goalError

      // Registrar automáticamente como egreso en el balance general
      await balanceStore.addTransaction({
        type: 'expense',
        category: 'Ahorro',
        description: `Abono a meta: ${goalTitle}`,
        amount: amountVES,
        currency: 'VES'
      })

      goal.current_saved_amount = updatedAmount
      return { success: true }
    } catch (err) {
      console.error('Error al depositar:', err)
      return { success: false, message: 'Error al procesar el depósito' }
    }
  }

  const withdrawFromGoal = async (id: string, amountForeign: number) => {
    try {
      const goal = goals.value.find((g) => g.id === id)
      if (!goal) return

      const updatedAmount = Math.max(0, Number(goal.current_saved_amount) - Number(amountForeign))

      const { error } = await supabase
        .from('savings_goals')
        .update({ current_saved_amount: updatedAmount })
        .eq('id', id)

      if (error) throw error

      goal.current_saved_amount = updatedAmount
    } catch (err) {
      console.error('Error al retirar:', err)
    }
  }

  const deleteGoal = async (id: string) => {
    try {
      const { error } = await supabase
        .from('savings_goals')
        .delete()
        .eq('id', id)

      if (error) throw error

      goals.value = goals.value.filter((g) => g.id !== id)
    } catch (err) {
      console.error('Error al eliminar:', err)
    }
  }

  const totalSavedVES = computed(() => {
    return goals.value.reduce((acc, goal) => {
      const saved = Number(goal.current_saved_amount) || 0
      let rate = 1

      if (goal.currency === 'USD') rate = balanceStore.rates.USD || 36.5
      else if (goal.currency === 'USDT') rate = balanceStore.rates.USDT || 38.0
      else if (goal.currency === 'EUR') rate = balanceStore.rates.EUR || 39.8

      return acc + (goal.currency === 'VES' ? saved : saved * rate)
    }, 0)
  })

  const totalTargetVES = computed(() => {
    return goals.value.reduce((acc, goal) => {
      const target = Number(goal.target_amount) || 0
      let rate = 1

      if (goal.currency === 'USD') rate = balanceStore.rates.USD || 36.5
      else if (goal.currency === 'USDT') rate = balanceStore.rates.USDT || 38.0
      else if (goal.currency === 'EUR') rate = balanceStore.rates.EUR || 39.8

      return acc + (goal.currency === 'VES' ? target : target * rate)
    }, 0)
  })

  return {
    goals,
    fetchGoals,
    addGoal,
    depositToGoal,
    withdrawFromGoal,
    deleteGoal,
    totalSavedVES,
    totalTargetVES
  }
})