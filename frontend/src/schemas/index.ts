import { z } from 'zod'
import { LEAD_STATUSES, LEAD_SOURCES } from '../constants'

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
})

export const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const leadSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  status: z.enum(LEAD_STATUSES as [string, ...string[]]),
  source: z.enum(LEAD_SOURCES as [string, ...string[]]),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>
export type LeadFormData = z.infer<typeof leadSchema>
