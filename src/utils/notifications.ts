export const isNotificationSupported = () =>
  typeof window !== 'undefined' && 'Notification' in window

export const getNotificationPermission = (): NotificationPermission | 'unsupported' => {
  try {
    if (!isNotificationSupported()) return 'unsupported'
    return Notification.permission
  } catch {
    return 'unsupported'
  }
}

export const requestNotificationPermission = async (): Promise<NotificationPermission | 'unsupported'> => {
  try {
    if (!isNotificationSupported()) return 'unsupported'
    if (Notification.permission !== 'default') return Notification.permission
    return await Notification.requestPermission()
  } catch {
    return 'unsupported'
  }
}

export const safeNotify = (title: string, body?: string) => {
  try {
    if (!isNotificationSupported()) return
    if (Notification.permission !== 'granted') return
    new Notification(title, body ? { body } : undefined)
  } catch {
    // ignore
  }
}

export const safeVibrate = (pattern: number | number[]) => {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(pattern)
    }
  } catch {
    // ignore
  }
}

let audioContext: AudioContext | null = null

const getAudio = () => {
  try {
    if (typeof window === 'undefined') return null
    type WindowWithWebkitAudio = typeof window & { webkitAudioContext?: typeof AudioContext }
    const win = window as WindowWithWebkitAudio
    const Ctor = win.AudioContext ?? win.webkitAudioContext
    if (!Ctor) return null
    if (!audioContext) audioContext = new Ctor()
    return audioContext
  } catch {
    return null
  }
}

export const primeAudio = () => {
  // Call from a user gesture to unlock audio on mobile.
  try {
    const ctx = getAudio()
    if (!ctx) return
    if (ctx.state === 'suspended') void ctx.resume()
  } catch {
    // ignore
  }
}

export const safePlayBeep = (duration: number = 0.8) => {
  try {
    const ctx = getAudio()
    if (!ctx) return
    if (ctx.state === 'suspended') void ctx.resume()
    
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.type = 'sine'
    osc.frequency.value = 880
    
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.3, now + 0.05)
    
    const beepDuration = duration
    
    gain.gain.setValueAtTime(0.3, now + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.3, now + beepDuration)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + beepDuration + 0.1)
    
    osc.connect(gain).connect(ctx.destination)
    osc.start(now)
    osc.stop(now + beepDuration + 0.1)
    
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'sine'
    osc2.frequency.value = 1100
    
    const delay = 0.5
    gain2.gain.setValueAtTime(0.0001, now + delay)
    gain2.gain.exponentialRampToValueAtTime(0.3, now + delay + 0.05)
    gain2.gain.setValueAtTime(0.3, now + delay + 0.05)
    gain2.gain.exponentialRampToValueAtTime(0.3, now + delay + beepDuration)
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + delay + beepDuration + 0.1)
    
    osc2.connect(gain2).connect(ctx.destination)
    osc2.start(now + delay)
    osc2.stop(now + delay + beepDuration + 0.1)
  } catch {
    // ignore
  }
}

export interface RestCompleteOptions {
  sound?: boolean
  vibration?: boolean
  notifications?: boolean
}

export const notifyRestComplete = (exerciseName?: string, options: RestCompleteOptions = {}) => {
  if (options.vibration) safeVibrate([200, 100, 200, 100, 200])
  if (options.sound) safePlayBeep()
  if (options.notifications) {
    safeNotify('Rest complete', exerciseName ? `Ready for ${exerciseName}` : 'Time for your next set.')
  }
}
