import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { useLead } from '../hooks/useLead'
import { leadService } from '../services/api/leadService'
import { LeadForm } from '../components/forms/LeadForm'
import { Button } from '../components/ui/Button'
import { Loader } from '../components/ui/Loader'
import { ErrorState } from '../components/ui/States'
import { getErrorMessage } from '../utils'
import type { LeadFormData } from '../schemas'

export function EditLeadPage() {
  const { id = '' } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { lead, isLoading, error } = useLead(id)
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (data: LeadFormData) => {
    setIsSaving(true)
    try {
      await leadService.updateLead(id, { status: data.status, source: data.source })
      toast.success('Lead updated successfully!')
      navigate(`/leads/${id}`)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" leftIcon={<ArrowLeft size={14} />} onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      <div>
        <h1 className="text-xl font-bold text-gray-900">Edit Lead</h1>
        <p className="text-sm text-gray-500 mt-0.5">Update lead status and source</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        {isLoading ? (
          <Loader message="Loading lead..." />
        ) : error ? (
          <ErrorState message={error} />
        ) : lead ? (
          <LeadForm
            mode="edit"
            defaultValues={{
              name: lead.name,
              email: lead.email,
              status: lead.status,
              source: lead.source,
            }}
            onSubmit={handleSubmit}
            isLoading={isSaving}
          />
        ) : null}
      </div>
    </div>
  )
}
