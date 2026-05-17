import { Loader2 } from 'lucide-react'

interface LoaderProps {
  message?: string
}

export function Loader({ message = 'Loading...' }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <Loader2 className="animate-spin text-brand-600" size={28} />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  )
}

export function TableSkeleton() {
  return (
    <div className="animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-gray-100">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-5 bg-gray-200 rounded-full w-20" />
          <div className="h-5 bg-gray-200 rounded-full w-20" />
          <div className="h-4 bg-gray-200 rounded w-24 ml-auto" />
        </div>
      ))}
    </div>
  )
}
