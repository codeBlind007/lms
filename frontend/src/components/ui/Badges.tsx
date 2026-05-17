import { STATUS_COLORS, SOURCE_COLORS } from '../../constants'
import type { LeadStatus, LeadSource } from '../../types'

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[status]}`}>
      {status}
    </span>
  )
}

export function SourceBadge({ source }: { source: LeadSource }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${SOURCE_COLORS[source]}`}>
      {source}
    </span>
  )
}
