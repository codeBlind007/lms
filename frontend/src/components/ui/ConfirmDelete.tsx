import { AlertTriangle } from 'lucide-react'
import { Modal } from './Modal'
import { Button } from './Button'

interface ConfirmDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isLoading?: boolean
  leadName: string
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  leadName,
}: ConfirmDeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Lead">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
          <AlertTriangle className="text-red-500" size={22} />
        </div>
        <div>
          <p className="text-sm text-gray-700">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-gray-900">{leadName}</span>?
          </p>
          <p className="text-xs text-gray-500 mt-1">This action cannot be undone.</p>
        </div>
        <div className="flex gap-3 w-full">
          <Button variant="secondary" className="flex-1" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="danger" className="flex-1" onClick={onConfirm} isLoading={isLoading}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  )
}
