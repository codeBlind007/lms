import type { LeadStatus, LeadSource } from '../types'

export const LEAD_STATUSES: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost']

export const LEAD_SOURCES: LeadSource[] = ['Website', 'Instagram', 'Referral']

export const STATUS_COLORS: Record<LeadStatus, string> = {
  New: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  Contacted: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  Qualified: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  Lost: 'bg-red-50 text-red-600 ring-1 ring-red-200',
}

export const SOURCE_COLORS: Record<LeadSource, string> = {
  Website: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
  Instagram: 'bg-pink-50 text-pink-700 ring-1 ring-pink-200',
  Referral: 'bg-teal-50 text-teal-700 ring-1 ring-teal-200',
}

export const PAGE_SIZE = 10
