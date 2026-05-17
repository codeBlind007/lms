export interface Lead {
  _id: string
  name: string
  email: string
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost'
  source: 'Website' | 'Instagram' | 'Referral'
  createdAt: string
}

export interface User {
  _id: string
  fullName: string
  email: string
  role: 'Admin' | 'Sales'
}

export interface AuthResponse {
  success: boolean
  message: string
  token: string
  user: User
}

export interface LeadsResponse {
  success: boolean
  currentPage: number
  totalPages: number
  totalLeads: number
  count: number
  leads: Lead[]
}

export interface SingleLeadResponse {
  success: boolean
  lead: Lead
}

export interface ApiError {
  success: boolean
  message: string
}

export interface LeadFilters {
  page: number
  status: string
  source: string
  search: string
  sort: 'latest' | 'oldest'
}

export type LeadStatus = Lead['status']
export type LeadSource = Lead['source']
