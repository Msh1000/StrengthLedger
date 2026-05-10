import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { RestTimer } from '../timer/RestTimer'
import { useAppStore } from '../../store/useAppStore'
import { notifyRestComplete } from '../../utils/notifications'

export function AppShell() {
  const location = useLocation()
  const boot = useAppStore((state) => state.boot)
  const booted = useAppStore((state) => state.booted)
  const tickTimer = useAppStore((state) => state.tickTimer)
  const timer = useAppStore((state) => state.timer)
  const settings = useAppStore((state) => state.settings)

  useEffect(() => {
    void boot()
  }, [boot])

  useEffect(() => {
    const interval = window.setInterval(tickTimer, 1000)
    return () => window.clearInterval(interval)
  }, [tickTimer])

  useEffect(() => {
    if (timer.totalSeconds > 0 && timer.secondsLeft === 0 && !timer.active) {
      notifyRestComplete(timer.exerciseName, {
        sound: settings.sound,
        vibration: settings.vibration,
        notifications: settings.notifications,
      })
    }
  }, [timer.active, timer.exerciseName, timer.secondsLeft, timer.totalSeconds, settings.sound, settings.vibration, settings.notifications])

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = settings.darkMode ? 'dark' : 'light'
    root.dataset.color = settings.colorTheme
  }, [settings.darkMode, settings.colorTheme])

  if (!booted) {
    return (
      <main className="app-frame splash-screen">
        <div className="brand-mark" />
        <h1>StrengthLedger</h1>
        <p>Loading your training floor...</p>
      </main>
    )
  }

  return (
    <div className="app-frame">
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          className="page-shell"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <RestTimer />
      <BottomNav />
    </div>
  )
}
