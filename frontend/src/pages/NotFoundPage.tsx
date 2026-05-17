import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <p className="text-7xl font-bold text-gray-200 font-mono">404</p>
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Page not found</h1>
          <p className="text-sm text-gray-500 mt-1">The page you're looking for doesn't exist.</p>
        </div>
        <Button onClick={() => navigate('/')}>Go to dashboard</Button>
      </div>
    </div>
  )
}
