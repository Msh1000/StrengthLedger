import { Dumbbell, ListPlus, Pencil, Plus, X } from 'lucide-react'
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
  const [routineSheetOpen, setRoutineSheetOpen] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const workouts = useAppStore((state) => state.workouts)
  const exercises = useAppStore((state) => state.exercises)
  const routines = useAppStore((state) => state.routines)
  const addExerciseToWorkout = useAppStore((state) => state.addExerciseToWorkout)
  const addRoutineToWorkout = useAppStore((state) => state.addRoutineToWorkout)
  const renameWorkout = useAppStore((state) => state.renameWorkout)
  const completeWorkout = useAppStore((state) => state.completeWorkout)
  const deleteExercise = useAppStore((state) => state.deleteExercise)
  const setExerciseRest = useAppStore((state) => state.setExerciseRest)
  const addSet = useAppStore((state) => state.addSet)
  const updateSet = useAppStore((state) => state.updateSet)
  const deleteSet = useAppStore((state) => state.deleteSet)
  const deleteWorkout = useAppStore((state) => state.deleteWorkout)
  const workout = workouts.find((item) => item.id === id)

  const volumeTrend = useMemo(() => [72, 78, 84, 88, 96, Math.max(98, bestOneRepMax(workout))], [workout])

  if (!workout) {
    return (
      <div className="screen">
        <TopBar title="Workout" />
        <GlassCard className="empty-state">
          <Dumbbell size={28} />
          <h2>Workout not found</h2>
          <Button onClick={() => navigate('/')}>Back to Today</Button>
        </GlassCard>
      </div>
    )
  }

  const handlePickRoutine = async (routineId: string) => {
    await addRoutineToWorkout(workout.id, routineId)
    setRoutineSheetOpen(false)
  }

  const handleDeleteWorkout = async () => {
    if (!confirm(`Delete workout "${workout.name}"? This cannot be undone.`)) return
    await deleteWorkout(workout.id)
    navigate('/')
  }

  return (
    <div className="screen workout-screen">
      <TopBar title={workout.name} menu />

      <GlassCard className="workout-name-card">
        {editingName ? (
          <input
            autoFocus
            className="workout-name-input"
            defaultValue={workout.name}
            onBlur={(event) => {
              const value = event.target.value.trim()
              if (value) void renameWorkout(workout.id, value)
              setEditingName(false)
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') (event.target as HTMLInputElement).blur()
              if (event.key === 'Escape') setEditingName(false)
            }}
          />
        ) : (
          <button className="workout-name-button" type="button" onClick={() => setEditingName(true)} aria-label="Rename workout">
            <strong>{workout.name}</strong>
            <Pencil size={16} />
          </button>
        )}
      </GlassCard>

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

      <div className="workout-actions stacked">
        <Button onClick={() => setPickerOpen((value) => !value)}>
          <Plus size={18} /> Add Exercise
        </Button>
        <Button variant="outline" onClick={() => {
          setPickerOpen(false)
          setRoutineSheetOpen(true)
        }}>
          <ListPlus size={18} /> Add Routine
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
            onChangeRest={(seconds) => void setExerciseRest(workout.id, exercise.id, seconds)}
          />
        ))}
      </div>

      <Button className="finish-button" onClick={async () => {
        if (workout.completed) {
          navigate('/')
        } else {
          await completeWorkout(workout.id)
        }
      }}>
        {workout.completed ? 'View Workout' : 'Finish Workout'}
      </Button>
      <Button variant="danger" className="full-width" style={{ marginTop: '10px' }} onClick={() => void handleDeleteWorkout()}>
        Delete Workout
      </Button>

      {routineSheetOpen ? (
        <div className="bottom-sheet-backdrop" onClick={() => setRoutineSheetOpen(false)}>
          <div className="bottom-sheet" onClick={(event) => event.stopPropagation()}>
            <div className="sheet-head">
              <h3>Add a routine</h3>
              <button className="icon-button compact" type="button" onClick={() => setRoutineSheetOpen(false)} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            {routines.length === 0 ? (
              <div className="empty-row"><span>No routines yet. Create one in the Routines tab.</span></div>
            ) : (
              <div className="exercise-list">
                {routines.map((routine) => (
                  <button key={routine.id} className="exercise-list-row" type="button" onClick={() => void handlePickRoutine(routine.id)}>
                    <span className="exercise-glyph"><ListPlus size={18} /></span>
                    <span>
                      <strong>{routine.name}</strong>
                      <small>{routine.exercises.length} exercises</small>
                    </span>
                    <Plus size={18} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
