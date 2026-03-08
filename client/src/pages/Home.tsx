import { useAuth } from "@/_core/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { getLoginUrl } from "@/const"
import HLB from "@/components/HLB"

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth()

  // Show HLB if authenticated
  if (isAuthenticated && user) {
    return <HLB />
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <main className="text-center">
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin w-8 h-8 text-primary" />
            <p className="text-muted-foreground">Loading Trinity HLB...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <h1 className="font-orbitron text-4xl font-black text-primary">TRINITY HLB v13.0</h1>
            <p className="text-muted-foreground">Unified Empire • 4 Modes</p>
            <Button
              onClick={() => window.location.href = getLoginUrl()}
              className="bg-primary text-black hover:bg-primary/90 font-bold px-8 py-6 text-lg"
            >
              🚀 Enter Trinity
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
