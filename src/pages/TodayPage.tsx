import { addDays, format, formatISO } from 'date-fns'
import { CalendarPlus, ChevronLeft, ChevronRight, Flame, Play, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSwipeable } from 'react-swipeable'
import { GlassCard } from '../components/ui/GlassCard'
import { StatCard } from '../components/ui/StatCard'
import { Button } from '../components/ui/Button'
import { useAppStore } from '../store/useAppStore'
import { bestOneRepMax, completedSets, formatDuration, formatWeight, workoutVolume } from '../utils/calculations'

export function TodayPage() {
  const navigate = useNavigate()
  const selectedDate = useAppStore((state) => state.selectedDate)
  const shiftSelectedDate = useAppStore((state) => state.shiftSelectedDate)
  const createWorkoutForDate = useAppStore((state) => state.createWorkoutForDate)
  const workouts = useAppStore((state) => state.workouts)
  const workout = workouts.find((item) => item.date === selectedDate)
  const handlers = useSwipeable({ onSwipedLeft: () => shiftSelectedDate(1), onSwipedRight: () => shiftSelectedDate(-1), trackTouch: true })

  const openWorkout = async () => {
    const current = workout ?? (await createWorkoutForDate(selectedDate))
    navigate(`/workout/${current.id}`)
  }

  const days = [-2, -1, 0, 1, 2].map((offset) => {
    const day = addDays(new Date(`${selectedDate}T12:00:00`), offset)
    return { label: format(day, 'EEE'), date: format(day, 'd'), key: formatISO(day, { representation: 'date' }), active: offset === 0 }
  })

  return (
    <div className="screen" {...handlers}>
      <header className="today-header">
        <h1>Today</h1>
        <button className="icon-button" type="button" onClick={() => navigate('/settings')} aria-label="Settings">
          <Settings size={21} />
        </button>
      </header>

      <div className="date-strip">
        <button className="date-arrow" type="button" onClick={() => shiftSelectedDate(-1)} aria-label="Previous day">
          <ChevronLeft size={18} />
        </button>
        {days.map((day) => (
          <div className={`date-pill ${day.active ? 'active' : ''}`} key={day.key}>
            <span>{day.label}</span>
            <strong>{day.date}</strong>
          </div>
        ))}
        <button className="date-arrow" type="button" onClick={() => shiftSelectedDate(1)} aria-label="Next day">
          <ChevronRight size={18} />
        </button>
      </div>

      <GlassCard className="workout-hero" glow>
        <div>
          <h2>{workout?.name ?? 'No Workout'}</h2>
          <p>{workout ? 'Chest - Shoulders - Triceps' : 'Create a focused training day'}</p>
        </div>
        <div className="athlete-silhouette" aria-hidden="true">
          <span />
        </div>
        <Button onClick={openWorkout}>
          {workout ? 'Start Workout' : 'Create Workout'} <Play size={16} fill="currentColor" />
        </Button>
      </GlassCard>

      <section className="section-head">
        <h2>Overview</h2>
        <button type="button">Edit</button>
      </section>
      <div className="stats-grid">
        <StatCard label="Exercises" value={`${workout?.exercises.length ?? 0}`} />
        <StatCard label="Total Sets" value={`${completedSets(workout)}`} />
        <StatCard label="Est. Volume" value={formatWeight(workoutVolume(workout))} accent />
        <StatCard label="Duration" value={workout ? formatDuration(workout.durationSeconds) : '--'} />
      </div>

      <section className="stack">
        <h2>Last Workout</h2>
        <GlassCard className="summary-row">
          <div>
            <strong>Push Day</strong>
            <span>May 13, 2026 - 56 min</span>
          </div>
          <strong className="accent-text">9,850 kg</strong>
        </GlassCard>
      </section>

      <section className="stack">
        <h2>Recent PRs</h2>
        {(workout?.exercises ?? []).slice(0, 3).map((exercise) => (
          <GlassCard className="pr-row" key={exercise.id}>
            <Flame size={18} className="flame" fill="currentColor" />
            <div>
              <strong>{exercise.name}</strong>
              <span>{bestOneRepMax({ ...workout!, exercises: [exercise] }) || '--'} kg est. 1RM</span>
            </div>
            <span className="pr-badge">PR</span>
          </GlassCard>
        ))}
        {!workout ? (
          <GlassCard className="empty-row">
            <CalendarPlus size={18} />
            <span>No PRs logged for this date yet.</span>
          </GlassCard>
        ) : null}
      </section>
    </div>
  )
}
