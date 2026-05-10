import { Dumbbell, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { TopBar } from '../components/layout/TopBar'
import { MiniLineChart } from '../components/charts/MiniLineChart'
import { Button } from '../components/ui/Button'
import { GlassCard } from '../components/ui/GlassCard'
import { ExerciseCard } from '../components/workout/ExerciseCard'
import { ExercisePicker } from '../components/workout/ExercisePicker'
import { useAppStore } from '../store/useAppStore'
import { bestOneRepMax, completedSets, formatDuration, formatWeight, workoutVolume } from '../utils/calculations'

export function WorkoutPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pickerOpen, setPickerOpen] = useState(false)
  const workouts = useAppStore((state) => state.workouts)
  const exercises = useAppStore((state) => state.exercises)
  const addExerciseToWorkout = useAppStore((state) => state.addExerciseToWorkout)
  const deleteExercise = useAppStore((state) => state.deleteExercise)
  const addSet = useAppStore((state) => state.addSet)
  const updateSet = useAppStore((state) => state.updateSet)
  const deleteSet = useAppStore((state) => state.deleteSet)
  const workout = workouts.find((item) => item.id === id)

  const volumeTrend = useMemo(() => [72, 78, 84, 88, 96, Math.max(98, bestOneRepMax(workout))], [workout])

  if (!workout) {
    return (
      <div className="screen">
        <TopBar title="Workout" back />
        <GlassCard className="empty-state">
          <Dumbbell size={28} />
          <h2>Workout not found</h2>
          <Button onClick={() => navigate('/')}>Back to Today</Button>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="screen workout-screen">
      <TopBar title={workout.name} back menu />
      <GlassCard className="workout-summary">
        <div>
          <strong>{formatDuration(workout.durationSeconds)}</strong>
          <span>Duration</span>
        </div>
        <div>
          <strong>{formatWeight(workoutVolume(workout))}</strong>
          <span>Volume</span>
        </div>
        <div>
          <strong>{completedSets(workout)}</strong>
          <span>Sets</span>
        </div>
      </GlassCard>

      <GlassCard className="chart-card">
        <div>
          <h2>Estimated 1RM</h2>
          <span>{bestOneRepMax(workout) || '--'} kg</span>
        </div>
        <MiniLineChart points={volumeTrend} />
      </GlassCard>

      <div className="workout-actions">
        <Button onClick={() => setPickerOpen((value) => !value)}>
          <Plus size={18} /> Add Exercise
        </Button>
      </div>

      {pickerOpen ? (
        <ExercisePicker
          exercises={exercises}
          onPick={(exercise) => {
            void addExerciseToWorkout(workout.id, exercise)
            setPickerOpen(false)
          }}
        />
      ) : null}

      <div className="exercise-stack">
        {workout.exercises.map((exercise, index) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            index={index}
            onAddSet={() => void addSet(workout.id, exercise.id)}
            onCopySet={() => void addSet(workout.id, exercise.id, exercise.sets.at(-1))}
            onDeleteExercise={() => void deleteExercise(workout.id, exercise.id)}
            onUpdateSet={(setId, patch) => void updateSet(workout.id, exercise.id, setId, patch)}
            onDeleteSet={(setId) => void deleteSet(workout.id, exercise.id, setId)}
          />
        ))}
      </div>

      <Button className="finish-button" onClick={() => navigate('/')}>
        Finish Workout
      </Button>
    </div>
  )
}
