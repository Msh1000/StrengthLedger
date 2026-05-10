import { Pause, Play, RotateCcw, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { CSSProperties } from 'react'
import { Button } from '../ui/Button'
import { useAppStore } from '../../store/useAppStore'
import { formatDuration } from '../../utils/calculations'

export function RestTimer() {
  const timer = useAppStore((state) => state.timer)
  const pauseTimer = useAppStore((state) => state.pauseTimer)
  const resumeTimer = useAppStore((state) => state.resumeTimer)
  const resetTimer = useAppStore((state) => state.resetTimer)
  const addTimerSeconds = useAppStore((state) => state.addTimerSeconds)
  const skipTimer = useAppStore((state) => state.skipTimer)

  const visible = timer.active || timer.secondsLeft > 0

  const progress = timer.totalSeconds > 0 ? timer.secondsLeft / timer.totalSeconds : 0
  const degrees = Math.max(0, Math.min(360, progress * 360))

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="rest-timer-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <motion.aside
            className="rest-timer"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <button className="timer-close" type="button" onClick={skipTimer} aria-label="Close timer">
              <X size={18} />
            </button>
            <div className="timer-copy">
              <strong>Rest Timer</strong>
              <span>{timer.exerciseName ?? 'Next set'}{timer.setLabel ? ` - ${timer.setLabel}` : ''}</span>
            </div>
            <div className="timer-row">
              <button className="timer-chip" type="button" onClick={() => addTimerSeconds(-30)}>
                -30s
              </button>
              <div className="timer-ring" style={{ '--timer-deg': `${degrees}deg` } as CSSProperties}>
                <div>
                  <strong>{formatDuration(timer.secondsLeft)}</strong>
                  <span>of {formatDuration(timer.totalSeconds)}</span>
                </div>
              </div>
              <button className="timer-chip" type="button" onClick={() => addTimerSeconds(30)}>
                +30s
              </button>
            </div>
            <div className="timer-actions">
              <Button variant="ghost" onClick={resetTimer} aria-label="Reset timer">
                <RotateCcw size={18} />
              </Button>
              <Button className="timer-play" onClick={timer.paused ? resumeTimer : pauseTimer} aria-label={timer.paused ? 'Resume timer' : 'Pause timer'}>
                {timer.paused ? <Play size={24} fill="currentColor" /> : <Pause size={24} fill="currentColor" />}
              </Button>
              <Button variant="danger" onClick={skipTimer}>
                Skip Rest
              </Button>
            </div>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
