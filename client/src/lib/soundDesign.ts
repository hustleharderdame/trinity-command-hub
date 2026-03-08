/**
 * Sound Design & Haptic Feedback System
 * Provides cinematic audio-tactile feedback for key interactions
 */

export const SoundDesign = {
  // Haptic patterns
  haptics: {
    keystroke: () => {
      if (navigator.vibrate) navigator.vibrate(10)
    },
    submission: () => {
      if (navigator.vibrate) navigator.vibrate([50, 30, 50])
    },
    xpGain: () => {
      if (navigator.vibrate) navigator.vibrate([20, 10, 20, 10, 20])
    },
    levelUp: () => {
      if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 100])
    },
    error: () => {
      if (navigator.vibrate) navigator.vibrate([100, 100, 100])
    },
    success: () => {
      if (navigator.vibrate) navigator.vibrate([50, 100, 50])
    },
  },

  // Audio context for sound effects
  audioContext: null as AudioContext | null,

  // Initialize audio context
  init() {
    if (typeof window !== 'undefined' && !this.audioContext) {
      try {
        const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext
        this.audioContext = new AudioContextClass()
      } catch (e) {
        console.warn('AudioContext not supported')
      }
    }
  },

  // Play a simple tone
  playTone(frequency: number, duration: number = 100, volume: number = 0.3) {
    if (!this.audioContext) this.init()
    if (!this.audioContext) return

    const ctx = this.audioContext
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.frequency.value = frequency
    osc.type = 'sine'

    gain.gain.setValueAtTime(volume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000)

    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration / 1000)
  },

  // Sound effects
  sounds: {
    // Morning ritual - heavy bass thud
    morningThud() {
      SoundDesign.playTone(80, 200, 0.4)
      SoundDesign.haptics.submission()
    },

    // XP gain - crisp chime with escalating vibration
    xpChime() {
      SoundDesign.playTone(800, 100, 0.3)
      SoundDesign.playTone(1000, 80, 0.2)
      SoundDesign.haptics.xpGain()
    },

    // Level up - triumphant audio cue
    levelUpFanfare() {
      SoundDesign.playTone(523, 150, 0.3) // C5
      setTimeout(() => SoundDesign.playTone(659, 150, 0.3), 150) // E5
      setTimeout(() => SoundDesign.playTone(784, 200, 0.4), 300) // G5
      SoundDesign.haptics.levelUp()
    },

    // Mansion upgrade - screen shake + audio
    mansionUpgrade() {
      SoundDesign.playTone(440, 100, 0.3)
      SoundDesign.playTone(550, 100, 0.3)
      SoundDesign.playTone(660, 200, 0.4)
      SoundDesign.haptics.levelUp()
    },

    // Mission complete - satisfying confirmation
    missionComplete() {
      SoundDesign.playTone(523, 100, 0.3)
      setTimeout(() => SoundDesign.playTone(659, 100, 0.3), 100)
      SoundDesign.haptics.success()
    },

    // Error/danger - warning tone
    dangerWarning() {
      SoundDesign.playTone(200, 150, 0.3)
      SoundDesign.playTone(150, 150, 0.3)
      SoundDesign.haptics.error()
    },
  },
}

// Initialize on load
if (typeof window !== 'undefined') {
  window.addEventListener('click', () => SoundDesign.init(), { once: true })
  window.addEventListener('touchstart', () => SoundDesign.init(), { once: true })
}
