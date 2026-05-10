import { Flame, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/Button'
import { GlassCard } from '../ui/GlassCard'
import { SetRow } from './SetRow'
import type { WorkoutExercise, WorkoutSet } from '../../types'
import { detectSetPr, estimatedOneRepMax, exerciseVolume, formatWeight, toNumber } from '../../utils/calculations'

interface ExerciseCardProps {
  exercise: WorkoutExercise
  index: number
  onAddSet: () => void
  onCopySet: () => void
  onDeleteExercise: () => void
  onUpdateSet: (setId: string, patch: Partial<WorkoutSet>) => void
  onDeleteSet: (setId: string) => void
  onChangeRest?: (seconds: number) => void
}

const QUICK_REST = [30, 60, 90, 120, 180]

export function ExerciseCard({
  exercise,
  index,
  onAddSet,
  onCopySet,
  onDeleteExercise,
  onUpdateSet,
  onDeleteSet,
  onChangeRest,
}: ExerciseCardProps) {
  const [editingRest, setEditingRest] = useState(false)
  const [customRest, setCustomRest] = useState(`${exercise.defaultRestSeconds}`)
  const completed = exercise.sets.filter((set) => set.completed)
  const bestSet = completed.reduce<WorkoutSet | undefined>((best, set) => {
    if (!best) return set
    return estimatedOneRepMax(toNumber(set.weight), toNumber(set.reps)) > estimatedOneRepMax(toNumber(best.weight), toNumber(best.reps))
      ? set
      : best
  }, undefined)
  const bestOrm = bestSet ? estimatedOneRepMax(toNumber(bestSet.weight), toNumber(bestSet.reps)) : 0

  const applyRest = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds <= 0) return
    onChangeRest?.(Math.min(3600, Math.round(seconds)))
    setEditingRest(false)
  }

  return (
    <GlassCard className="exercise-card">
      <div className="exercise-head">
        <div className="exercise-number">{index + 1}</div>
        <div className="exercise-head-text">
          <h2>{exercise.name}</h2>
          <p className="muted-line">{exercise.equipment} - {exercise.muscleGroup}</p>
          <p className="muted-line">
            1RM: {bestOrm || '--'} kg {bestOrm ? <Flame size={13} className="flame" fill="currentColor" /> : null}
          </p>
          <p className="muted-line">Last: {bestSet ? `${bestSet.weight} kg x ${bestSet.reps}` : 'No previous sets'}</p>
        </div>
      </div>

      <div className="exercise-meta">
        <button type="button" className="rest-meta-button" onClick={() => setEditingRest((value) => !value)}>
          Rest: {exercise.defaultRestSeconds}s
        </button>
        <span>{formatWeight(exerciseVolume(exercise))}</span>
      </div>

      {editingRest ? (
        <div className="rest-editor">
          <div className="chip-scroll">
            {QUICK_REST.map((seconds) => (
              <button
                type="button"
                key={seconds}
                className={`filter-chip ${exercise.defaultRestSeconds === seconds ? 'active' : ''}`}
                onClick={() => applyRest(seconds)}
              >
                {seconds}s
              </button>
            ))}
          </div>
          <div className="rest-custom-row">
            <input
              type="number"
              inputMode="numeric"
              min={5}
              max={3600}
              value={customRest}
              onChange={(event) => setCustomRest(event.target.value)}
              aria-label="Custom rest seconds"
            />
            <button type="button" className="filter-chip active" onClick={() => applyRest(Number(customRest))}>Set</button>
          </div>
        </div>
      ) : null}

      <div className="set-header">
        <span>Set</span>
        <span>Type</span>
        <span>Kg</span>
        <span>Reps</span>
        <span>Done</span>
      </div>

      <div className="set-list">
        {exercise.sets.map((set, setIndex) => (
          <div className="set-wrap" key={set.id}>
            <SetRow index={setIndex} set={set} onChange={(patch) => onUpdateSet(set.id, patch)} onDelete={() => onDeleteSet(set.id)} />
            {detectSetPr(exercise, set) ? <span className="pr-pill">PR</span> : null}
          </div>
        ))}
      </div>

      <div className="exercise-actions">
        <Button variant="outline" onClick={onAddSet}>
          <Plus size={17} /> Add Set
        </Button>
        <Button variant="ghost" onClick={onCopySet}>
          Copy Last Set
        </Button>
        <button className="delete-link" type="button" onClick={onDeleteExercise} aria-label="Delete exercise">
          <Trash2 size={17} />
        </button>
      </div>
    </GlassCard>
  )
}
