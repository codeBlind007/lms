import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { leadSchema, type LeadFormData } from '../../schemas'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { LEAD_STATUSES, LEAD_SOURCES } from '../../constants'

interface LeadFormProps {
  defaultValues?: Partial<LeadFormData>
  onSubmit: (data: LeadFormData) => Promise<void>
  isLoading: boolean
  mode: 'create' | 'edit'
}

const statusOptions = LEAD_STATUSES.map((s) => ({ value: s, label: s }))
const sourceOptions = LEAD_SOURCES.map((s) => ({ value: s, label: s }))

export function LeadForm({ defaultValues, onSubmit, isLoading, mode }: LeadFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      status: 'New',
      source: 'Website',
      ...defaultValues,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Full Name"
        placeholder="Rahul Sharma"
        error={errors.name?.message}
        {...register('name')}
        disabled={mode === 'edit'}
      />
      <Input
        label="Email"
        type="email"
        placeholder="rahul@example.com"
        error={errors.email?.message}
        {...register('email')}
        disabled={mode === 'edit'}
      />
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Status"
          options={statusOptions}
          error={errors.status?.message}
          {...register('status')}
        />
        <Select
          label="Source"
          options={sourceOptions}
          error={errors.source?.message}
          {...register('source')}
        />
      </div>
      <Button type="submit" isLoading={isLoading} className="w-full" size="lg">
        {mode === 'create' ? 'Create Lead' : 'Save Changes'}
      </Button>
    </form>
  )
}
