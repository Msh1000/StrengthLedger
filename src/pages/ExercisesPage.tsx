import { Plus, Search, Star, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { TopBar } from '../components/layout/TopBar'
import { Button } from '../components/ui/Button'
import { muscleGroups } from '../data/exercises'
import { useAppStore } from '../store/useAppStore'
import type { MuscleGroup } from '../types'

const EQUIPMENT_OPTIONS = ['Barbell', 'Dumbbell', 'Machine', 'Cable', 'Bodyweight', 'Kettlebell', 'Resistance Band', 'Smith Machine']

export function ExercisesPage() {
  const exercises = useAppStore((state) => state.exercises)
  const toggleFavorite = useAppStore((state) => state.toggleFavorite)
  const createCustomExercise = useAppStore((state) => state.createCustomExercise)
  const [query, setQuery] = useState('')
  const [group, setGroup] = useState<(typeof muscleGroups)[number]>('All')
  const [creatorOpen, setCreatorOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    muscleGroup: 'Chest' as MuscleGroup,
    equipment: 'Dumbbell',
    defaultRestSeconds: 90,
  })

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

  const handleCreateExercise = async () => {
    if (!formData.name.trim()) return
    await createCustomExercise({
      name: formData.name.trim(),
      muscleGroup: formData.muscleGroup,
      equipment: formData.equipment,
      defaultRestSeconds: formData.defaultRestSeconds,
    })
    setFormData({ name: '', muscleGroup: 'Chest', equipment: 'Dumbbell', defaultRestSeconds: 90 })
    setCreatorOpen(false)
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
        {filtered.map((exercise) => (
          <div className="library-row" key={exercise.id}>
            <span className="exercise-glyph">{exercise.name.slice(0, 1)}</span>
            <div className="library-text">
              <strong>{exercise.name}</strong>
              <small>{exercise.equipment} - {exercise.muscleGroup}</small>
            </div>
            <button className="icon-button compact" type="button" onClick={() => void toggleFavorite(exercise.id)} aria-label="Toggle favorite">
              <Star size={19} className={exercise.favorite ? 'star' : ''} fill={exercise.favorite ? 'currentColor' : 'none'} />
            </button>
          </div>
        ))}
        {filtered.length === 0 ? (
          <div className="library-row" style={{ gridTemplateColumns: '1fr' }}>
            <small>No exercises match your filters.</small>
          </div>
        ) : null}
      </div>

      {creatorOpen ? (
        <div className="bottom-sheet-backdrop" onClick={() => setCreatorOpen(false)}>
          <div className="bottom-sheet" onClick={(event) => event.stopPropagation()}>
            <div className="sheet-head">
              <h3>Create Custom Exercise</h3>
              <button className="icon-button compact" type="button" onClick={() => setCreatorOpen(false)} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <label className="sheet-label">Exercise name</label>
            <input
              className="sheet-input"
              value={formData.name}
              onChange={(event) => setFormData({ ...formData, name: event.target.value })}
              placeholder="e.g. Cable Flyes"
            />
            <label className="sheet-label">Muscle Group</label>
            <select
              className="sheet-input"
              value={formData.muscleGroup}
              onChange={(event) => setFormData({ ...formData, muscleGroup: event.target.value as MuscleGroup })}
            >
              {(['Chest', 'Back', 'Legs', 'Shoulders', 'Biceps', 'Triceps', 'Core'] as MuscleGroup[]).map((mg) => (
                <option key={mg} value={mg}>{mg}</option>
              ))}
            </select>
            <label className="sheet-label">Equipment</label>
            <select
              className="sheet-input"
              value={formData.equipment}
              onChange={(event) => setFormData({ ...formData, equipment: event.target.value })}
            >
              {EQUIPMENT_OPTIONS.map((eq) => (
                <option key={eq} value={eq}>{eq}</option>
              ))}
            </select>
            <label className="sheet-label">Default Rest Time (seconds)</label>
            <input
              type="number"
              className="sheet-input"
              min={5}
              max={600}
              value={formData.defaultRestSeconds}
              onChange={(event) => setFormData({ ...formData, defaultRestSeconds: Number(event.target.value) })}
            />
            <div className="sheet-footer">
              <Button variant="ghost" onClick={() => setCreatorOpen(false)}>Cancel</Button>
              <Button onClick={() => void handleCreateExercise()}>Create Exercise</Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
