import { useNavigate } from 'react-router-dom'
import { Pencil, Trash2, Eye } from 'lucide-react'
import type { Lead } from '../../types'
import { StatusBadge, SourceBadge } from '../ui/Badges'
import { formatDate } from '../../utils'

interface LeadTableProps {
  leads: Lead[]
  isAdmin: boolean
  onDeleteClick: (lead: Lead) => void
}

export function LeadTable({ leads, isAdmin, onDeleteClick }: LeadTableProps) {
  const navigate = useNavigate()

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Source</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Created</th>
            <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {leads.map((lead) => (
            <tr
              key={lead._id}
              className="hover:bg-gray-50/60 transition-colors group"
            >
              <td className="px-6 py-3.5">
                <button
                  onClick={() => navigate(`/leads/${lead._id}`)}
                  className="font-medium text-gray-900 hover:text-brand-600 transition-colors text-left"
                >
                  {lead.name}
                </button>
              </td>
              <td className="px-6 py-3.5 text-gray-500">{lead.email}</td>
              <td className="px-6 py-3.5">
                <StatusBadge status={lead.status} />
              </td>
              <td className="px-6 py-3.5">
                <SourceBadge source={lead.source} />
              </td>
              <td className="px-6 py-3.5 text-gray-500 font-mono text-xs">
                {formatDate(lead.createdAt)}
              </td>
              <td className="px-6 py-3.5">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => navigate(`/leads/${lead._id}`)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    title="View"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={() => navigate(`/leads/${lead._id}/edit`)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => onDeleteClick(lead)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
