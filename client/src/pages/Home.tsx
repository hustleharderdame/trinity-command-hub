import { useAuth } from '@/_core/hooks/useAuth'
import { Loader2 } from 'lucide-react'
import { getLoginUrl } from '@/const'
import Stage1Hub from '@/components/Stage1Hub'
import { trpc } from '@/lib/trpc'

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth()
  const { data: progression } = trpc.hsProgression.get.useQuery(undefined, {
    enabled: isAuthenticated,
  })
  const { data: snapshot } = trpc.hsDaily.getToday.useQuery(undefined, {
    enabled: isAuthenticated,
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-primary mb-8">TRINITY HLB v13.0</h1>
        <a
          href={getLoginUrl()}
          className="px-8 py-3 bg-primary text-black font-bold rounded hover:opacity-90 transition-all"
        >
          ENTER THE SYSTEM
        </a>
      </div>
    )
  }

  return <Stage1Hub progression={progression} snapshot={snapshot} />
}
