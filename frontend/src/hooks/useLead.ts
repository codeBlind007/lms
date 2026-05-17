import { useState, useEffect } from 'react'
import type { Lead } from '../types'
import { leadService } from '../services/api/leadService'
import { getErrorMessage } from '../utils'

interface UseLeadResult {
  lead: Lead | null
  isLoading: boolean
  error: string | null
}

export function useLead(id: string): UseLeadResult {
  const [lead, setLead] = useState<Lead | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    setIsLoading(true)
    setError(null)

    leadService
      .getLead(id)
      .then((data) => {
        if (!cancelled) setLead(data.lead)
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
  }, [id])

  return { lead, isLoading, error }
}
