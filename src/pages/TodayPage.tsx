import { addDays, format, formatISO, isToday } from 'date-fns'
import { CalendarDays, CalendarPlus, ChevronLeft, ChevronRight, Flame, Play, Settings } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GlassCard } from '../components/ui/GlassCard'
import { StatCard } from '../components/ui/StatCard'
import { Button } from '../components/ui/Button'
import { useAppStore } from '../store/useAppStore'
import { primeAudio } from '../utils/notifications'
import { bestOneRepMax, completedSets, formatDuration, formatWeight, workoutVolume } from '../utils/calculations'

export function TodayPage() {
  const navigate = useNavigate()
  const selectedDate = useAppStore((state) => state.selectedDate)
  const setSelectedDate = useAppStore((state) => state.setSelectedDate)
  const shiftSelectedDate = useAppStore((state) => state.shiftSelectedDate)
  const createWorkoutForDate = useAppStore((state) => state.createWorkoutForDate)
  const workouts = useAppStore((state) => state.workouts)
  const workout = workouts.find((item) => item.date === selectedDate)
  const [pickerOpen, setPickerOpen] = useState(false)

  const openWorkout = async () => {
    primeAudio()
    const current = workout ?? (await createWorkoutForDate(selectedDate))
    navigate(`/workout/${current.id}`)
  }

  const buttonLabel = (() => {
    if (!workout || workout.exercises.length === 0) return 'Start Workout'
    if (workout.completed) return 'View Workout'
    return 'Resume Workout'
  })()

  const days = [-2, -1, 0, 1, 2].map((offset) => {
    const day = addDays(new Date(`${selectedDate}T12:00:00`), offset)
    const key = formatISO(day, { representation: 'date' })
    return { label: format(day, 'EEE'), date: format(day, 'd'), key, active: key === selectedDate }
  })

  const selectedDateObj = new Date(`${selectedDate}T12:00:00`)
  const fullDateLabel = isToday(selectedDateObj) ? `Today, ${format(selectedDateObj, 'MMM d')}` : format(selectedDateObj, 'EEE, MMM d, yyyy')

  return (
    <div className="screen">
      <header className="today-header">
        <h1>StrengthLedger</h1>
        <button className="icon-button" type="button" onClick={() => navigate('/settings')} aria-label="Settings">
          <Settings size={21} />
        </button>
      </header>

      <button className="date-headline" type="button" onClick={() => setPickerOpen((value) => !value)} aria-label="Change date">
        <CalendarDays size={16} />
        <span>{fullDateLabel}</span>
      </button>

      {pickerOpen ? (
        <div className="date-picker-row">
          <input
            type="date"
            className="date-picker-input"
            value={selectedDate}
            onChange={(event) => {
              if (event.target.value) {
                setSelectedDate(event.target.value)
                setPickerOpen(false)
              }
            }}
          />
          <button className="filter-chip" type="button" onClick={() => { setSelectedDate(formatISO(new Date(), { representation: 'date' })); setPickerOpen(false) }}>
            Today
          </button>
        </div>
      ) : null}

      <div className="date-strip">
        <button className="date-arrow" type="button" onClick={() => shiftSelectedDate(-1)} aria-label="Previous day">
          <ChevronLeft size={18} />
        </button>
        {days.map((day) => (
          <button className={`date-pill ${day.active ? 'active' : ''}`} key={day.key} type="button" onClick={() => setSelectedDate(day.key)}>
            <span>{day.label}</span>
            <strong>{day.date}</strong>
          </button>
        ))}
        <button className="date-arrow" type="button" onClick={() => shiftSelectedDate(1)} aria-label="Next day">
          <ChevronRight size={18} />
        </button>
      </div>

      <GlassCard className="workout-hero" glow>
        <div>
          <h2>{workout?.name ?? 'No Workout'}</h2>
          <p>{workout && workout.exercises.length > 0
            ? workout.exercises.slice(0, 3).map((exercise) => exercise.name).join(' - ')
            : 'Tap below to start a focused training day'}
          </p>
        </div>
        <div className="athlete-silhouette" aria-hidden="true">
          <span />
        </div>
        <Button onClick={openWorkout}>
          {buttonLabel} <Play size={16} fill="currentColor" />
        </Button>
      </GlassCard>

      <section className="section-head">
        <h2>Overview</h2>
      </section>
      <div className="stats-grid">
        <StatCard label="Exercises" value={`${workout?.exercises.length ?? 0}`} />
        <StatCard label="Total Sets" value={`${completedSets(workout)}`} />
        <StatCard label="Est. Volume" value={formatWeight(workoutVolume(workout))} accent />
        <StatCard label="Duration" value={workout ? formatDuration(workout.durationSeconds) : '--'} />
      </div>

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
        {!workout || workout.exercises.length === 0 ? (
          <GlassCard className="empty-row">
            <CalendarPlus size={18} />
            <span>No PRs logged for this date yet.</span>
          </GlassCard>
        ) : null}
      </section>
    </div>
  )
}
