import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { leadService } from '../services/api/leadService'
import { LeadForm } from '../components/forms/LeadForm'
import { Button } from '../components/ui/Button'
import { getErrorMessage } from '../utils'
import type { LeadFormData } from '../schemas'

export function CreateLeadPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: LeadFormData) => {
    setIsLoading(true)
    try {
      await leadService.createLead(data)
      toast.success('Lead created successfully!')
      navigate('/')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setIsLoading(false)
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
        <h1 className="text-xl font-bold text-gray-900">New Lead</h1>
        <p className="text-sm text-gray-500 mt-0.5">Add a new prospect to your pipeline</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        <LeadForm mode="create" onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  )
}
