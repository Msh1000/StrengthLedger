import { X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/Button'
import type { MuscleGroup } from '../../types'

const EQUIPMENT_OPTIONS = ['Barbell', 'Dumbbell', 'Machine', 'Cable', 'Bodyweight', 'Kettlebell', 'Resistance Band', 'Smith Machine']
const MUSCLE_GROUP_OPTIONS: MuscleGroup[] = ['Chest', 'Back', 'Legs', 'Shoulders', 'Biceps', 'Triceps', 'Core']

export interface ExerciseDraft {
  name: string
  muscleGroup: MuscleGroup
  equipment: string
  defaultRestSeconds: number
}

interface ExerciseCreatorSheetProps {
  open: boolean
  title: string
  confirmLabel: string
  onCancel: () => void
  onSubmit: (exercise: ExerciseDraft) => void | Promise<void>
}

const defaultDraft = (): ExerciseDraft => ({
  name: '',
  muscleGroup: 'Chest',
  equipment: 'Dumbbell',
  defaultRestSeconds: 90,
})

export function ExerciseCreatorSheet({ open, title, confirmLabel, onCancel, onSubmit }: ExerciseCreatorSheetProps) {
  const [draft, setDraft] = useState<ExerciseDraft>(defaultDraft)

  if (!open) return null

  return (
    <div className="bottom-sheet-backdrop" onClick={onCancel}>
      <div className="bottom-sheet" onClick={(event) => event.stopPropagation()}>
        <div className="sheet-head">
          <h3>{title}</h3>
          <button className="icon-button compact" type="button" onClick={onCancel} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <label className="sheet-label">Exercise name</label>
        <input
          autoFocus
          className="sheet-input"
          value={draft.name}
          onChange={(event) => setDraft({ ...draft, name: event.target.value })}
          placeholder="e.g. Cable Fly"
        />

        <label className="sheet-label">Muscle Group</label>
        <select
          className="sheet-input"
          value={draft.muscleGroup}
          onChange={(event) => setDraft({ ...draft, muscleGroup: event.target.value as MuscleGroup })}
        >
          {MUSCLE_GROUP_OPTIONS.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>

        <label className="sheet-label">Equipment</label>
        <select
          className="sheet-input"
          value={draft.equipment}
          onChange={(event) => setDraft({ ...draft, equipment: event.target.value })}
        >
          {EQUIPMENT_OPTIONS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <label className="sheet-label">Default Rest Time (seconds)</label>
        <input
          type="number"
          className="sheet-input"
          min={5}
          max={600}
          value={draft.defaultRestSeconds}
          onChange={(event) => setDraft({ ...draft, defaultRestSeconds: Number(event.target.value) })}
        />

        <div className="sheet-footer">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={() => void onSubmit(draft)}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  )
}
