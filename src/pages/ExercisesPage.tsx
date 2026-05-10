import { Search, Star } from 'lucide-react'
import { useMemo, useState } from 'react'
import { TopBar } from '../components/layout/TopBar'
import { muscleGroups } from '../data/exercises'
import { useAppStore } from '../store/useAppStore'
import type { MuscleGroup } from '../types'

export function ExercisesPage() {
  const exercises = useAppStore((state) => state.exercises)
  const toggleFavorite = useAppStore((state) => state.toggleFavorite)
  const [query, setQuery] = useState('')
  const [group, setGroup] = useState<(typeof muscleGroups)[number]>('All')

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

  return (
    <div className="screen">
      <TopBar title="Exercises" />
      <div className="search-row single">
        <label className="search-field">
          <Search size={18} />
          <input placeholder="Search exercises..." value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
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
    </div>
  )
}
