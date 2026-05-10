import { Flame, MoreHorizontal, Plus, Trash2 } from 'lucide-react'
import { useSwipeable } from 'react-swipeable'
import { Button } from '../ui/Button'
import { GlassCard } from '../ui/GlassCard'
import { SetRow } from './SetRow'
import type { WorkoutExercise, WorkoutSet } from '../../types'
import { detectSetPr, estimatedOneRepMax, exerciseVolume, formatWeight } from '../../utils/calculations'

interface ExerciseCardProps {
  exercise: WorkoutExercise
  index: number
  onAddSet: () => void
  onCopySet: () => void
  onDeleteExercise: () => void
  onUpdateSet: (setId: string, patch: Partial<WorkoutSet>) => void
  onDeleteSet: (setId: string) => void
}

export function ExerciseCard({
  exercise,
  index,
  onAddSet,
  onCopySet,
  onDeleteExercise,
  onUpdateSet,
  onDeleteSet,
}: ExerciseCardProps) {
  const completed = exercise.sets.filter((set) => set.completed)
  const bestSet = completed.reduce<WorkoutSet | undefined>((best, set) => {
    if (!best) return set
    return estimatedOneRepMax(set.weight, set.reps) > estimatedOneRepMax(best.weight, best.reps) ? set : best
  }, undefined)
  const bestOrm = bestSet ? estimatedOneRepMax(bestSet.weight, bestSet.reps) : 0

  const handlers = useSwipeable({
    onSwipedLeft: onDeleteExercise,
    trackTouch: true,
  })

  return (
    <GlassCard className="exercise-card" {...handlers}>
      <div className="exercise-head">
        <div className="exercise-number">{index + 1}</div>
        <div>
          <h2>{exercise.name}</h2>
          <p>
            1RM: {bestOrm || '--'} kg {bestOrm ? <Flame size={14} className="flame" fill="currentColor" /> : null}
          </p>
          <p>Last: {bestSet ? `${bestSet.weight} kg x ${bestSet.reps}` : 'No previous sets'}</p>
        </div>
        <button className="icon-button compact" type="button" onClick={onDeleteExercise} aria-label="Delete exercise">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="exercise-meta">
        <span>Rest: {exercise.defaultRestSeconds} sec</span>
        <span>{formatWeight(exerciseVolume(exercise))}</span>
      </div>

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
