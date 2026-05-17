import { useState, useEffect, useCallback } from 'react'
import type { Lead, LeadFilters } from '../types'
import { leadService } from '../services/api/leadService'
import { getErrorMessage } from '../utils'

interface UseLeadsResult {
  leads: Lead[]
  isLoading: boolean
  error: string | null
  totalPages: number
  totalLeads: number
  currentPage: number
  refetch: () => void
}

export function useLeads(filters: Partial<LeadFilters>): UseLeadsResult {
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [totalLeads, setTotalLeads] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [tick, setTick] = useState(0)

  const refetch = useCallback(() => setTick((t) => t + 1), [])

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    leadService
      .getLeads(filters)
      .then((data) => {
        if (!cancelled) {
          setLeads(data.leads)
          setTotalPages(data.totalPages)
          setTotalLeads(data.totalLeads)
          setCurrentPage(data.currentPage)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(getErrorMessage(err))
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.page, filters.status, filters.source, filters.search, filters.sort, tick])

  return { leads, isLoading, error, totalPages, totalLeads, currentPage, refetch }
}
