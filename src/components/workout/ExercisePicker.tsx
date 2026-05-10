import { Dumbbell, Search, Star } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from '../ui/Button'
import { muscleGroups } from '../../data/exercises'
import type { Exercise, MuscleGroup } from '../../types'

interface ExercisePickerProps {
  exercises: Exercise[]
  onPick: (exercise: Exercise) => void
}

export function ExercisePicker({ exercises, onPick }: ExercisePickerProps) {
  const [query, setQuery] = useState('')
  const [group, setGroup] = useState<(typeof muscleGroups)[number]>('All')

  const filtered = useMemo(
    () =>
      exercises.filter((exercise) => {
        const matchesGroup = group === 'All' || exercise.muscleGroup === (group as MuscleGroup)
        const matchesQuery = exercise.name.toLowerCase().includes(query.toLowerCase())
        return matchesGroup && matchesQuery
      }),
    [exercises, group, query],
  )

  return (
    <section className="picker-panel">
      <label className="search-field">
        <Search size={18} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search exercises..." />
      </label>
      <div className="chip-scroll">
        {muscleGroups.slice(0, 5).map((item) => (
          <button className={`filter-chip ${group === item ? 'active' : ''}`} key={item} type="button" onClick={() => setGroup(item)}>
            {item}
          </button>
        ))}
      </div>
      <div className="exercise-list">
        {filtered.slice(0, 8).map((exercise) => (
          <button className="exercise-list-row" key={exercise.id} type="button" onClick={() => onPick(exercise)}>
            <span className="exercise-glyph"><Dumbbell size={18} /></span>
            <span>
              <strong>{exercise.name}</strong>
              <small>{exercise.equipment} - {exercise.muscleGroup}</small>
            </span>
            {exercise.favorite ? <Star size={18} className="star" fill="currentColor" /> : null}
          </button>
        ))}
      </div>
      <Button variant="ghost" className="full-width" onClick={() => setQuery('')}>
        Clear Search
      </Button>
    </section>
  )
}
