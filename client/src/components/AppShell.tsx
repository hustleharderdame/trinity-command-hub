import { useEffect, useState } from 'react'
import SplashScreen from './SplashScreen'
import OnboardingScreen, { UserIdentity } from './OnboardingScreen'
import HLB from './HLB'

export default function AppShell() {
  const [stage, setStage] = useState<'splash' | 'onboarding' | 'main'>('splash')
  const [userIdentity, setUserIdentity] = useState<UserIdentity | null>(null)

  // Check for existing user on mount
  useEffect(() => {
    const savedIdentity = localStorage.getItem('trinity_user_identity')
    if (savedIdentity) {
      try {
        const identity = JSON.parse(savedIdentity)
        setUserIdentity(identity)
        setStage('main')
      } catch (error) {
        console.error('Failed to parse saved identity:', error)
        setStage('onboarding')
      }
    }
  }, [])

  const handleSplashComplete = () => {
    // Check again if user exists (in case it was set during splash)
    const savedIdentity = localStorage.getItem('trinity_user_identity')
    if (savedIdentity) {
      try {
        const identity = JSON.parse(savedIdentity)
        setUserIdentity(identity)
        setStage('main')
      } catch {
        setStage('onboarding')
      }
    } else {
      setStage('onboarding')
    }
  }

  const handleOnboardingComplete = (identity: UserIdentity) => {
    // Save identity to localStorage
    localStorage.setItem('trinity_user_identity', JSON.stringify(identity))
    setUserIdentity(identity)
    setStage('main')
  }

  return (
    <>
      {stage === 'splash' && <SplashScreen onComplete={handleSplashComplete} />}
      {stage === 'onboarding' && <OnboardingScreen onComplete={handleOnboardingComplete} />}
      {stage === 'main' && userIdentity && <HLB userIdentity={userIdentity} />}
    </>
  )
}
