import { useNavigate } from 'react-router-dom'
import { Pencil, Trash2, Eye, Calendar } from 'lucide-react'
import type { Lead } from '../../types'
import { StatusBadge, SourceBadge } from '../ui/Badges'
import { formatDate } from '../../utils'

interface LeadCardProps {
  lead: Lead
  isAdmin: boolean
  onDeleteClick: (lead: Lead) => void
}

export function LeadCard({ lead, isAdmin, onDeleteClick }: LeadCardProps) {
  const navigate = useNavigate()

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <button
            onClick={() => navigate(`/leads/${lead._id}`)}
            className="font-semibold text-gray-900 hover:text-brand-600 transition-colors text-left block"
          >
            {lead.name}
          </button>
          <p className="text-sm text-gray-500 mt-0.5 truncate">{lead.email}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => navigate(`/leads/${lead._id}`)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Eye size={14} />
          </button>
          <button
            onClick={() => navigate(`/leads/${lead._id}/edit`)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
          >
            <Pencil size={14} />
          </button>
          {isAdmin && (
            <button
              onClick={() => onDeleteClick(lead)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <StatusBadge status={lead.status} />
        <SourceBadge source={lead.source} />
      </div>

      <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-400">
        <Calendar size={12} />
        <span>{formatDate(lead.createdAt)}</span>
      </div>
    </div>
  )
}
