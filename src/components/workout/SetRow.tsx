import { Check, Trash2 } from 'lucide-react'
import { useSwipeable } from 'react-swipeable'
import type { SetType, WorkoutSet } from '../../types'

const setTypes: SetType[] = ['working', 'warmup', 'rest', 'drop', 'failure']

interface SetRowProps {
  index: number
  set: WorkoutSet
  onChange: (patch: Partial<WorkoutSet>) => void
  onDelete: () => void
}

export function SetRow({ index, set, onChange, onDelete }: SetRowProps) {
  const handlers = useSwipeable({
    onSwipedLeft: onDelete,
    trackTouch: true,
  })

  return (
    <div className={`set-row ${set.completed ? 'complete' : ''}`} {...handlers}>
      <span className="set-index">{index + 1}</span>
      <select value={set.type} onChange={(event) => onChange({ type: event.target.value as SetType })} aria-label="Set type">
        {setTypes.map((type) => (
          <option key={type} value={type}>
            {type[0].toUpperCase() + type.slice(1)}
          </option>
        ))}
      </select>
      <input
        inputMode="decimal"
        value={set.weight}
        onChange={(event) => onChange({ weight: Number(event.target.value) })}
        aria-label="Weight"
      />
      <input inputMode="numeric" value={set.reps} onChange={(event) => onChange({ reps: Number(event.target.value) })} aria-label="Reps" />
      <button className="done-toggle" type="button" onClick={() => onChange({ completed: !set.completed })} aria-label="Toggle completed">
        {set.completed ? <Check size={15} strokeWidth={3} /> : null}
      </button>
      <button className="row-delete" type="button" onClick={onDelete} aria-label="Delete set">
        <Trash2 size={15} />
      </button>
    </div>
  )
}
