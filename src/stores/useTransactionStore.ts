// src/stores/useTransactionStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../services/supabase'

export interface Transaction {
  id?: string
  user_id?: string
  amount: number
  type: 'income' | 'expense'
  category: string
  currency: 'VES' | 'USD' | 'USDT'
  description?: string
  created_at?: string
}

export const INCOME_CATEGORIES = [
  'Salario',
  'Venta',
  'Emprendimiento',
  'Regalo',
  'Otros Ingresos'
] as const

export const EXPENSE_CATEGORIES = [
  'Salud',
  'Hogar',
  'Comida',
  'Transporte',
  'Divisas',
  'Estudios',
  'Ropa',
  'Servicios',
  'Otros Egresos'
] as const

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref<Transaction[]>([])
  const isModalOpen = ref<boolean>(false)
  const modalType = ref<'income' | 'expense'>('income')
  const isLoading = ref<boolean>(false)

  const openModal = (type: 'income' | 'expense') => {
    modalType.value = type
    isModalOpen.value = true
  }

  const closeModal = () => {
    isModalOpen.value = false
  }

  const fetchTransactions = async () => {
    isLoading.value = true
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      if (data) {
        transactions.value = data
      }
    } catch (err) {
      console.error('Error al obtener transacciones:', err)
    } finally {
      isLoading.value = false
    }
  }

  const addTransaction = async (newTx: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const payload = {
        user_id: user.id,
        amount: newTx.amount,
        type: newTx.type,
        category: newTx.category,
        currency: newTx.currency,
        description: newTx.description || null
      }

      const { data, error } = await supabase
        .from('transactions')
        .insert([payload])
        .select()
        .single()

      if (error) throw error
      if (data) {
        transactions.value.unshift(data)
      }
    } catch (err) {
      console.error('Error al agregar transacción:', err)
    }
  }

  const deleteTransaction = async (id: string) => {
    if (!id) return
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Remover localmente del array reactivo
      transactions.value = transactions.value.filter(t => t.id !== id)
    } catch (err) {
      console.error('Error al eliminar transacción:', err)
    }
  }

  return {
    transactions,
    isModalOpen,
    modalType,
    isLoading,
    openModal,
    closeModal,
    fetchTransactions,
    addTransaction,
    deleteTransaction
  }
})