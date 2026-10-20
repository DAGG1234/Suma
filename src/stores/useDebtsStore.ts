// src/stores/useDebtsStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../services/supabase'
import { useBalanceStore } from './useBalanceStore'

export interface Debt {
  id?: string
  user_id?: string
  title: string
  person_name?: string
  description?: string
  currency: 'VES' | 'USD' | 'USDT' | 'EUR'
  total_amount: number
  paid_amount: number
  type: 'payable' | 'receivable'
  status?: 'pending' | 'paid'
  created_at?: string
}

export const useDebtsStore = defineStore('debts', () => {
  const debts = ref<Debt[]>([])
  const balanceStore = useBalanceStore()

  const fetchDebts = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) return

      const { data, error } = await supabase
        .from('debts')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      if (data) {
        debts.value = data.map(d => ({
          ...d,
          paid_amount: Number(d.paid_amount) || 0,
          total_amount: Number(d.total_amount) || 0
        }))
      }
    } catch (err) {
      console.error('Error al cargar deudas:', err)
    }
  }

  const addDebt = async (newDebt: {
    title: string
    person_name: string
    description?: string
    currency: 'VES' | 'USD' | 'USDT' | 'EUR'
    total_amount: number
    debt_type: 'payable' | 'receivable'
  }) => {
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) return

      const debtPayload = {
        user_id: userData.user.id,
        title: `${newDebt.title} (${newDebt.person_name})`,
        currency: newDebt.currency,
        total_amount: Number(newDebt.total_amount) || 0,
        paid_amount: 0,
        type: newDebt.debt_type,
        status: 'pending'
      }

      const { error } = await supabase
        .from('debts')
        .insert([debtPayload])

      if (error) throw error
      await fetchDebts()
    } catch (err) {
      console.error('Error al crear deuda:', err)
    }
  }

  const payDebt = async (id: string, amountVES: number, debtTitle: string, amountForeign: number) => {
    try {
      const debt = debts.value.find((d) => d.id === id)
      if (!debt) return { success: false, message: 'Deuda no encontrada' }

      const currentPaid = Number(debt.paid_amount) || 0
      const total = Number(debt.total_amount) || 0
      const remainingForeign = Math.max(0, total - currentPaid)

      // 1. Validar si el abono excede el monto restante
      if (amountForeign > remainingForeign + 0.001) {
        return { 
          success: false, 
          message: `El abono excede el monto restante de la deuda (${remainingForeign.toFixed(2)} ${debt.currency}).` 
        }
      }

      // 2. Validar saldo disponible en el balance general si es una deuda por pagar
      if (debt.type === 'payable') {
        const currentBalanceVES = Number(balanceStore.rawBalanceVES) || 0
        if (amountVES > currentBalanceVES) {
          return { 
            success: false, 
            message: `Saldo insuficiente. Tienes Bs. ${currentBalanceVES.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} disponibles.` 
          }
        }
      }

      const finalForeignToAdd = Math.min(Number(amountForeign), remainingForeign)
      
      let rate = 36.5
      if (debt.currency === 'USD') rate = Number(balanceStore.rates.USD) || 36.5
      else if (debt.currency === 'USDT') rate = Number(balanceStore.rates.USDT || 38.0)
      else if (debt.currency === 'EUR') rate = Number(balanceStore.rates.EUR || 39.8)

      const finalVESToAdd = debt.currency === 'VES' ? finalForeignToAdd : finalForeignToAdd * rate

      const newPaidAmount = Number((currentPaid + finalForeignToAdd).toFixed(2))
      const isPaid = newPaidAmount >= total

      const { error: debtError } = await supabase
        .from('debts')
        .update({ 
          paid_amount: newPaidAmount,
          status: isPaid ? 'paid' : 'pending'
        })
        .eq('id', id)

      if (debtError) throw debtError

      if (debt.type === 'payable') {
        await balanceStore.addTransaction({
          type: 'expense',
          category: 'Deudas',
          description: `Abono a deuda: ${debtTitle}`,
          amount: finalVESToAdd,
          currency: 'VES'
        })
      } else {
        await balanceStore.addTransaction({
          type: 'income',
          category: 'Deudas',
          description: `Cobro de deuda: ${debtTitle}`,
          amount: finalVESToAdd,
          currency: 'VES'
        })
      }

      // Forzar actualización inmediata del historial de transacciones y balance
      if (balanceStore.fetchTransactions) {
        await balanceStore.fetchTransactions()
      }

      debt.paid_amount = newPaidAmount
      if (isPaid) debt.status = 'paid'

      return { success: true }
    } catch (err: any) {
      console.error('Error al abonar a deuda:', err?.message || err)
      return { success: false, message: err?.message || 'Error al procesar el abono' }
    }
  }

  const deleteDebt = async (id: string) => {
    try {
      const { error } = await supabase
        .from('debts')
        .delete()
        .eq('id', id)

      if (error) throw error
      debts.value = debts.value.filter((d) => d.id !== id)
    } catch (err) {
      console.error('Error al eliminar deuda:', err)
    }
  }

  const totalPayableVES = computed(() => {
    return debts.value
      .filter((d) => d.type === 'payable' && d.status !== 'paid')
      .reduce((acc, d) => {
        const remaining = Math.max(0, (Number(d.total_amount) || 0) - (Number(d.paid_amount) || 0))
        let rate = 36.5
        if (d.currency === 'USD') rate = Number(balanceStore.rates.USD) || 36.5
        else if (d.currency === 'USDT') rate = Number(balanceStore.rates.USDT) || 38.0
        else if (d.currency === 'EUR') rate = Number(balanceStore.rates.EUR) || 39.8
        return acc + (d.currency === 'VES' ? remaining : remaining * rate)
      }, 0)
  })

  const totalReceivableVES = computed(() => {
    return debts.value
      .filter((d) => d.type === 'receivable' && d.status !== 'paid')
      .reduce((acc, d) => {
        const remaining = Math.max(0, (Number(d.total_amount) || 0) - (Number(d.paid_amount) || 0))
        let rate = 36.5
        if (d.currency === 'USD') rate = Number(balanceStore.rates.USD) || 36.5
        else if (d.currency === 'USDT') rate = Number(balanceStore.rates.USDT) || 38.0
        else if (d.currency === 'EUR') rate = Number(balanceStore.rates.EUR) || 39.8
        return acc + (d.currency === 'VES' ? remaining : remaining * rate)
      }, 0)
  })

  return {
    debts,
    fetchDebts,
    addDebt,
    payDebt,
    deleteDebt,
    totalPayableVES,
    totalReceivableVES
  }
})