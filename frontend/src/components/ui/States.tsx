import { Inbox, AlertTriangle } from 'lucide-react'
import { Button } from './Button'

interface EmptyStateProps {
  title?: string
  description?: string
  action?: { label: string; onClick: () => void }
}

export function EmptyState({
  title = 'No leads found',
  description = 'Try adjusting your filters or create a new lead.',
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
        <Inbox className="text-gray-400" size={24} />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-700">{title}</p>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      {action && (
        <Button variant="secondary" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  message = 'Something went wrong.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
        <AlertTriangle className="text-red-400" size={24} />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-700">Failed to load</p>
        <p className="text-sm text-gray-500 mt-1">{message}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}
