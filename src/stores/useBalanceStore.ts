// src/stores/useBalanceStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../services/supabase'

export type CurrencyType = 'VES' | 'USD' | 'USDT' | 'EUR'

export interface Transaction {
  id?: string
  user_id?: string
  type: 'income' | 'expense'
  category: string
  description: string
  amount: number
  currency: CurrencyType
  created_at?: string
}

export const useBalanceStore = defineStore('balanceStore', () => {
  const rawBalanceVES = ref<number>(2000)
  const selectedCurrency = ref<CurrencyType>('VES')
  const showBalance = ref<boolean>(true)
  const isLoadingRates = ref<boolean>(false)
  const transactions = ref<Transaction[]>([])

  const rates = ref({
    USD: 36.5,
    USDT: 38.0,
    EUR: 39.8,
  })

  const fetchRates = async () => {
    isLoadingRates.value = true
    try {
      const res = await fetch('https://ve.dolarapi.com/v1/dolares/oficial')
      if (res.ok) {
        const data = await res.json()
        const val = Number(data.promedio) || Number(data.venta)
        if (val > 0) rates.value.USD = val
      }

      const resEuro = await fetch('https://ve.dolarapi.com/v1/euros/oficial')
      if (resEuro.ok) {
        const dataEuro = await resEuro.json()
        const valEuro = Number(dataEuro.promedio) || Number(dataEuro.venta)
        if (valEuro > 0) rates.value.EUR = valEuro
      }

      const resUsdt = await fetch('https://ve.dolarapi.com/v1/dolares/paralelo')
      if (resUsdt.ok) {
        const dataUsdt = await resUsdt.json()
        const valUsdt = Number(dataUsdt.promedio) || Number(dataUsdt.venta)
        if (valUsdt > 0) rates.value.USDT = valUsdt
      }
    } catch (e) {
      console.error('Usando tasas de respaldo locales por fallo de red')
    } finally {
      isLoadingRates.value = false
    }
  }

  const setSelectedCurrency = (currency: CurrencyType) => {
    selectedCurrency.value = currency
  }

  const toggleShowBalance = () => {
    showBalance.value = !showBalance.value
  }

  const currentRate = computed<number>(() => {
    if (selectedCurrency.value === 'USD') return rates.value.USD || 36.5
    if (selectedCurrency.value === 'USDT') return rates.value.USDT || 38.0
    if (selectedCurrency.value === 'EUR') return rates.value.EUR || 39.8
    return 1
  })

  const currencySymbol = computed<string>(() => {
    if (selectedCurrency.value === 'VES') return 'Bs '
    if (selectedCurrency.value === 'EUR') return '€'
    return '$'
  })

  const formatAmount = (amountInVES: number, type?: 'income' | 'expense') => {
    const ves = Number(amountInVES) || 0
    const converted = ves / currentRate.value

    const formattedNum = new Intl.NumberFormat('es-VE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(converted))

    const sign = type ? (type === 'income' ? '+' : '-') : (converted < 0 ? '-' : '')
    return `${sign}${currencySymbol.value}${formattedNum}`
  }

  const formattedBalance = computed<string>(() => {
    if (!showBalance.value) return '••••••••'
    return formatAmount(rawBalanceVES.value)
  })

  // Cargar transacciones y calcular saldo desde Supabase
  const fetchTransactions = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) return

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      if (data) {
        transactions.value = data
        // Calcular saldo acumulado si manejas transacciones
        rawBalanceVES.value = data.reduce((acc, tx) => {
          return tx.type === 'income' ? acc + Number(tx.amount) : acc - Number(tx.amount)
        }, rawBalanceVES.value)
      }
    } catch (err) {
      console.error('Error al cargar transacciones:', err)
    }
  }

  // Registrar transacción (descuenta automáticamente del saldo y lo guarda en Supabase)
  const addTransaction = async (newTx: {
    type: 'income' | 'expense'
    category: string
    description: string
    amount: number
    currency: CurrencyType
  }) => {
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) return { success: false }

      const txPayload = {
        user_id: userData.user.id,
        type: newTx.type,
        category: newTx.category,
        description: newTx.description,
        amount: newTx.amount,
        currency: newTx.currency
      }

      const { data, error } = await supabase
        .from('transactions')
        .insert([txPayload])
        .select()

      if (error) throw error

      if (data && data[0]) {
        transactions.value.unshift(data[0])
        // Descontar o sumar al saldo local en VES
        if (newTx.type === 'expense') {
          rawBalanceVES.value -= Number(newTx.amount)
        } else {
          rawBalanceVES.value += Number(newTx.amount)
        }
      }

      return { success: true }
    } catch (err) {
      console.error('Error al registrar transacción:', err)
      return { success: false }
    }
  }

  return {
    rawBalanceVES,
    selectedCurrency,
    showBalance,
    isLoadingRates,
    rates,
    transactions,
    currentRate,
    currencySymbol,
    fetchRates,
    setSelectedCurrency,
    toggleShowBalance,
    formatAmount,
    formattedBalance,
    fetchTransactions,
    addTransaction,
  }
})