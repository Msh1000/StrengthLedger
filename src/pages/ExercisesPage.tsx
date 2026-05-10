import { Plus, Search, Star, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { TopBar } from '../components/layout/TopBar'
import { Button } from '../components/ui/Button'
import { exerciseLibrary, muscleGroups } from '../data/exercises'
import { useAppStore } from '../store/useAppStore'
import { ExerciseCreatorSheet } from '../components/workout/ExerciseCreatorSheet'
import type { MuscleGroup } from '../types'

export function ExercisesPage() {
  const exercises = useAppStore((state) => state.exercises)
  const toggleFavorite = useAppStore((state) => state.toggleFavorite)
  const createCustomExercise = useAppStore((state) => state.createCustomExercise)
  const deleteCustomExercise = useAppStore((state) => state.deleteCustomExercise)
  const [query, setQuery] = useState('')
  const [group, setGroup] = useState<(typeof muscleGroups)[number]>('All')
  const [creatorOpen, setCreatorOpen] = useState(false)

  const seededExerciseIds = useMemo(() => new Set(exerciseLibrary.map((exercise) => exercise.id)), [])

  const filtered = useMemo(
    () =>
      exercises.filter((exercise) => {
        const matchesGroup =
          group === 'All' ||
          (group === 'Favorites' ? Boolean(exercise.favorite) : exercise.muscleGroup === (group as MuscleGroup))
        const matchesQuery = exercise.name.toLowerCase().includes(query.toLowerCase())
        return matchesGroup && matchesQuery
      }),
    [exercises, group, query],
  )

  const handleCreateExercise = async (exercise: { name: string; muscleGroup: MuscleGroup; equipment: string; defaultRestSeconds: number }) => {
    if (!exercise.name.trim()) return
    await createCustomExercise({
      name: exercise.name.trim(),
      muscleGroup: exercise.muscleGroup,
      equipment: exercise.equipment,
      defaultRestSeconds: exercise.defaultRestSeconds,
    })
    setCreatorOpen(false)
  }

  const handleDeleteExercise = async (exerciseId: string, exerciseName: string) => {
    if (!confirm(`Delete "${exerciseName}"? This will remove it from your routines.`)) return
    await deleteCustomExercise(exerciseId)
  }

  return (
    <div className="screen">
      <TopBar title="Exercises" />
      <div className="search-row single">
        <label className="search-field">
          <Search size={18} />
          <input placeholder="Search exercises..." value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <Button onClick={() => setCreatorOpen(true)} style={{ minWidth: '44px', padding: '0 12px' }}>
          <Plus size={18} />
        </Button>
      </div>
      <div className="chip-scroll">
        {muscleGroups.map((item) => (
          <button className={`filter-chip ${group === item ? 'active' : ''}`} key={item} type="button" onClick={() => setGroup(item)}>
            {item === 'Favorites' ? '\u2605 Favorites' : item}
          </button>
        ))}
      </div>
      <div className="library-list">
        {filtered.map((exercise) => {
          const isSeeded = seededExerciseIds.has(exercise.id)
          return (
            <div className="library-row" key={exercise.id}>
              <span className="exercise-glyph">{exercise.name.slice(0, 1)}</span>
              <div className="library-text">
                <strong>{exercise.name}</strong>
                <small>
                  {exercise.equipment} - {exercise.muscleGroup}
                </small>
              </div>
              <div className="library-actions">
                <button
                  className="icon-button compact"
                  type="button"
                  onClick={() => void toggleFavorite(exercise.id)}
                  aria-label="Toggle favorite"
                >
                  <Star size={19} className={exercise.favorite ? 'star' : ''} fill={exercise.favorite ? 'currentColor' : 'none'} />
                </button>
                {!isSeeded ? (
                  <button
                    className="icon-button compact danger-icon"
                    type="button"
                    onClick={() => void handleDeleteExercise(exercise.id, exercise.name)}
                    aria-label="Delete custom exercise"
                  >
                    <Trash2 size={17} />
                  </button>
                ) : null}
              </div>
            </div>
          )
        })}
        {filtered.length === 0 ? (
          <div className="library-row" style={{ gridTemplateColumns: '1fr' }}>
            <small>No exercises match your filters.</small>
          </div>
        ) : null}
      </div>

      {creatorOpen ? (
        <ExerciseCreatorSheet
          open={creatorOpen}
          title="Create Custom Exercise"
          confirmLabel="Create Exercise"
          onCancel={() => setCreatorOpen(false)}
          onSubmit={(exercise) => void handleCreateExercise(exercise)}
        />
      ) : null}
    </div>
  )
}
