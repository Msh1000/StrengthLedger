import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useSwipeable } from 'react-swipeable'
import { BottomNav } from './BottomNav'
import { RestTimer } from '../timer/RestTimer'
import { useAppStore } from '../../store/useAppStore'
import { notifyRestComplete } from '../../utils/notifications'

const tabs = ['/', '/calendar', '/routines', '/exercises', '/progress']

export function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const boot = useAppStore((state) => state.boot)
  const booted = useAppStore((state) => state.booted)
  const tickTimer = useAppStore((state) => state.tickTimer)
  const timer = useAppStore((state) => state.timer)

  useEffect(() => {
    void boot()
  }, [boot])

  useEffect(() => {
    const interval = window.setInterval(tickTimer, 1000)
    return () => window.clearInterval(interval)
  }, [tickTimer])

  useEffect(() => {
    if (timer.totalSeconds > 0 && timer.secondsLeft === 0 && !timer.active) {
      notifyRestComplete(timer.exerciseName)
    }
  }, [timer.active, timer.exerciseName, timer.secondsLeft, timer.totalSeconds])

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      const index = tabs.indexOf(location.pathname)
      if (index >= 0 && index < tabs.length - 1) navigate(tabs[index + 1])
    },
    onSwipedRight: () => {
      const index = tabs.indexOf(location.pathname)
      if (index > 0) navigate(tabs[index - 1])
    },
    trackTouch: true,
  })

  if (!booted) {
    return (
      <main className="app-frame splash-screen">
        <div className="brand-mark" />
        <h1>StrengthLog</h1>
        <p>Loading your training floor...</p>
      </main>
    )
  }

  return (
    <div className="app-frame" {...handlers}>
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
