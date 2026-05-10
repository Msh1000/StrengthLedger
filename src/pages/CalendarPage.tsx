import { addMonths, eachDayOfInterval, endOfMonth, format, formatISO, startOfMonth } from 'date-fns'
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import { TopBar } from '../components/layout/TopBar'
import { GlassCard } from '../components/ui/GlassCard'
import { useAppStore } from '../store/useAppStore'
import { completedSets, formatDuration, formatWeight, workoutVolume } from '../utils/calculations'

export function CalendarPage() {
  const [month, setMonth] = useState(new Date())
  const workouts = useAppStore((state) => state.workouts)
  const setSelectedDate = useAppStore((state) => state.setSelectedDate)
  const selectedDate = useAppStore((state) => state.selectedDate)
  const handlers = useSwipeable({ onSwipedLeft: () => setMonth(addMonths(month, 1)), onSwipedRight: () => setMonth(addMonths(month, -1)), trackTouch: true })
  const days = useMemo(() => eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) }), [month])
  const selectedWorkout = workouts.find((workout) => workout.date === selectedDate)

  return (
    <div className="screen" {...handlers}>
      <TopBar title={format(month, 'MMMM yyyy')} back />
      <div className="month-controls">
        <button className="icon-button" type="button" onClick={() => setMonth(addMonths(month, -1))} aria-label="Previous month">
          <ChevronLeft size={21} />
        </button>
        <span>Training Calendar</span>
        <button className="icon-button" type="button" onClick={() => setMonth(addMonths(month, 1))} aria-label="Next month">
          <ChevronRight size={21} />
        </button>
      </div>
      <GlassCard className="calendar-card">
        <div className="weekday-grid">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className="calendar-grid">
          {days.map((day) => {
            const key = formatISO(day, { representation: 'date' })
            const workout = workouts.find((item) => item.date === key)
            return (
              <button className={`calendar-day ${key === selectedDate ? 'active' : ''}`} key={key} type="button" onClick={() => setSelectedDate(key)}>
                <strong>{format(day, 'd')}</strong>
                {workout ? <span className={workout.completed ? 'dot green' : 'dot purple'} /> : null}
                {workout && workoutVolume(workout) > 5000 ? <Flame size={11} className="flame" fill="currentColor" /> : null}
              </button>
            )
          })}
        </div>
      </GlassCard>
      <GlassCard className="day-detail" glow>
        <span>{format(new Date(`${selectedDate}T12:00:00`), 'EEE, MMM d, yyyy')}</span>
        <h2>{selectedWorkout?.name ?? 'Open Training Day'}</h2>
        <p>
          {selectedWorkout ? `${formatWeight(workoutVolume(selectedWorkout))} - ${formatDuration(selectedWorkout.durationSeconds)}` : 'No sets logged yet'}
        </p>
        {selectedWorkout?.exercises.slice(0, 3).map((exercise) => (
          <div className="detail-row" key={exercise.id}>
            <span>{exercise.name}</span>
            <small>{completedSets({ ...selectedWorkout, exercises: [exercise] })} sets</small>
          </div>
        ))}
      </GlassCard>
    </div>
  )
}
