import api from './axios'
import type { LeadsResponse, SingleLeadResponse, LeadFilters } from '../../types'
import type { LeadFormData } from '../../schemas'

export const leadService = {
  async getLeads(filters: Partial<LeadFilters>): Promise<LeadsResponse> {
    const params = new URLSearchParams()
    if (filters.page) params.set('page', String(filters.page))
    if (filters.status) params.set('status', filters.status)
    if (filters.source) params.set('source', filters.source)
    if (filters.search) params.set('search', filters.search)
    if (filters.sort) params.set('sort', filters.sort)

    const { data } = await api.get<LeadsResponse>(`/leads?${params.toString()}`)
    return data
  },

  async getLead(id: string): Promise<SingleLeadResponse> {
    const { data } = await api.get<SingleLeadResponse>(`/leads/${id}`)
    return data
  },

  async createLead(payload: LeadFormData): Promise<SingleLeadResponse> {
    const { data } = await api.post<SingleLeadResponse>('/leads', payload)
    return data
  },

  async updateLead(id: string, payload: Partial<LeadFormData>): Promise<SingleLeadResponse> {
    const { data } = await api.put<SingleLeadResponse>(`/leads/${id}`, payload)
    return data
  },

  async deleteLead(id: string): Promise<{ success: boolean; message: string }> {
    const { data } = await api.delete(`/leads/${id}`)
    return data
  },
}
