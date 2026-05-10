import { Check, Trash2 } from 'lucide-react'
import type { SetType, WorkoutSet } from '../../types'

const setTypes: SetType[] = ['working', 'warmup', 'rest', 'drop', 'failure']

interface SetRowProps {
  index: number
  set: WorkoutSet
  onChange: (patch: Partial<WorkoutSet>) => void
  onDelete: () => void
}

export function SetRow({ index, set, onChange, onDelete }: SetRowProps) {
  return (
    <div className={`set-row ${set.completed ? 'complete' : ''}`}>
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
        value={set.weight === '' ? '' : String(set.weight)}
        onChange={(event) => onChange({ weight: event.target.value === '' ? '' : Number(event.target.value) })}
        aria-label="Weight"
      />
      <input
        inputMode="numeric"
        value={set.reps === '' ? '' : String(set.reps)}
        onChange={(event) => onChange({ reps: event.target.value === '' ? '' : Number(event.target.value) })}
        aria-label="Reps"
      />
      <button className="done-toggle" type="button" onClick={() => onChange({ completed: !set.completed })} aria-label="Toggle completed">
        {set.completed ? <Check size={15} strokeWidth={3} /> : null}
      </button>
      <button className="row-delete" type="button" onClick={onDelete} aria-label="Delete set">
        <Trash2 size={15} />
      </button>
    </div>
  )
}
