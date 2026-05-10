import { ChevronDown, ChevronUp, Pencil, Plus, Trash2, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { TopBar } from '../components/layout/TopBar'
import { Button } from '../components/ui/Button'
import { GlassCard } from '../components/ui/GlassCard'
import { ExercisePicker } from '../components/workout/ExercisePicker'
import { useAppStore, newRoutineId } from '../store/useAppStore'
import type { Routine } from '../types'

export function RoutinesPage() {
  const routines = useAppStore((state) => state.routines)
  const exercises = useAppStore((state) => state.exercises)
  const saveRoutine = useAppStore((state) => state.saveRoutine)
  const deleteRoutine = useAppStore((state) => state.deleteRoutine)
  const [editorOpen, setEditorOpen] = useState(false)
  const [draft, setDraft] = useState<Routine | null>(null)

  const exerciseLookup = useMemo(() => Object.fromEntries(exercises.map((exercise) => [exercise.id, exercise])), [exercises])

  const startCreate = () => {
    setDraft({ id: newRoutineId(), name: 'New Routine', exercises: [] })
    setEditorOpen(true)
  }

  const startEdit = (routine: Routine) => {
    setDraft({ ...routine, exercises: [...routine.exercises] })
    setEditorOpen(true)
  }

  const handleSave = async () => {
    if (!draft) return
    if (!draft.name.trim()) return
    await saveRoutine({ ...draft, name: draft.name.trim() })
    setEditorOpen(false)
    setDraft(null)
  }

  const handleDelete = async (routine: Routine) => {
    if (!confirm(`Delete routine "${routine.name}"? This cannot be undone.`)) return
    await deleteRoutine(routine.id)
  }

  return (
    <div className="screen">
      <TopBar title="Routines" />
      <div className="routine-actions">
        <Button onClick={startCreate}>
          <Plus size={18} /> New Routine
        </Button>
      </div>
      <div className="routine-stack">
        {routines.length === 0 ? (
          <GlassCard className="empty-state">
            <h2>No routines yet</h2>
            <p className="muted-line">Create your first routine to quickly load exercises into a workout.</p>
            <Button onClick={startCreate}><Plus size={16} /> New Routine</Button>
          </GlassCard>
        ) : null}
        {routines.map((routine) => (
          <GlassCard className="routine-card" key={routine.id}>
            <div className="routine-title">
              <div>
                <h2>{routine.name}</h2>
                <p>{routine.exercises.length} exercises</p>
              </div>
              <div className="routine-icons">
                <button className="icon-button compact" type="button" onClick={() => startEdit(routine)} aria-label="Edit routine">
                  <Pencil size={16} />
                </button>
                <button className="icon-button compact" type="button" onClick={() => void handleDelete(routine)} aria-label="Delete routine">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            {routine.exercises.slice(0, 4).map((entry, index) => {
              const exercise = exerciseLookup[entry.exerciseId]
              return (
                <div className="routine-day" key={`${entry.exerciseId}-${index}`}>
                  <strong>{exercise?.name ?? 'Unknown exercise'}</strong>
                  <span>{entry.sets ?? 3} x {entry.reps ?? 8}{entry.weight ? ` @ ${entry.weight}kg` : ''}</span>
                </div>
              )
            })}
            {routine.exercises.length > 4 ? (
              <div className="routine-day"><span>+{routine.exercises.length - 4} more</span></div>
            ) : null}
          </GlassCard>
        ))}
      </div>

      {editorOpen && draft ? (
        <RoutineEditor
          draft={draft}
          setDraft={setDraft}
          onCancel={() => { setEditorOpen(false); setDraft(null) }}
          onSave={() => void handleSave()}
          exerciseLookup={exerciseLookup}
          allExercises={exercises}
        />
      ) : null}
    </div>
  )
}

interface RoutineEditorProps {
  draft: Routine
  setDraft: (next: Routine) => void
  onCancel: () => void
  onSave: () => void
  exerciseLookup: Record<string, { name: string; muscleGroup: string; equipment: string } | undefined>
  allExercises: import('../types').Exercise[]
}

function RoutineEditor({ draft, setDraft, onCancel, onSave, exerciseLookup, allExercises }: RoutineEditorProps) {
  const [pickerOpen, setPickerOpen] = useState(false)

  const update = (patch: Partial<Routine>) => setDraft({ ...draft, ...patch })

  const moveExercise = (index: number, delta: number) => {
    const next = [...draft.exercises]
    const target = index + delta
    if (target < 0 || target >= next.length) return
    const [item] = next.splice(index, 1)
    next.splice(target, 0, item)
    update({ exercises: next })
  }

  const removeExercise = (index: number) => {
    const next = draft.exercises.filter((_, i) => i !== index)
    update({ exercises: next })
  }

  const editEntry = (index: number, patch: Partial<Routine['exercises'][number]>) => {
    const next = draft.exercises.map((entry, i) => (i === index ? { ...entry, ...patch } : entry))
    update({ exercises: next })
  }

  return (
    <div className="bottom-sheet-backdrop" onClick={onCancel}>
      <div className="bottom-sheet large" onClick={(event) => event.stopPropagation()}>
        <div className="sheet-head">
          <h3>{draft.exercises.length === 0 ? 'New Routine' : 'Edit Routine'}</h3>
          <button className="icon-button compact" type="button" onClick={onCancel} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <label className="sheet-label">Routine name</label>
        <input
          className="sheet-input"
          value={draft.name}
          onChange={(event) => update({ name: event.target.value })}
          placeholder="e.g. Upper Body"
        />
        <div className="sheet-section-head">
          <h4>Exercises</h4>
          <button type="button" className="filter-chip active" onClick={() => setPickerOpen((value) => !value)}>
            {pickerOpen ? 'Close picker' : 'Add exercise'}
          </button>
        </div>
        {pickerOpen ? (
          <ExercisePicker
            exercises={allExercises}
            onPick={(exercise) => {
              update({ exercises: [...draft.exercises, { exerciseId: exercise.id, sets: 3, reps: 8, weight: 20 }] })
              setPickerOpen(false)
            }}
          />
        ) : null}
        <div className="routine-edit-list">
          {draft.exercises.map((entry, index) => {
            const exercise = exerciseLookup[entry.exerciseId]
            return (
              <div className="routine-edit-row" key={`${entry.exerciseId}-${index}`}>
                <div className="routine-edit-name">
                  <strong>{exercise?.name ?? 'Unknown'}</strong>
                  <small>{exercise?.equipment} - {exercise?.muscleGroup}</small>
                </div>
                <div className="routine-edit-numbers">
                  <label>
                    <span>Sets</span>
                    <input type="number" min={1} value={entry.sets ?? 3} onChange={(event) => editEntry(index, { sets: Number(event.target.value) })} />
                  </label>
                  <label>
                    <span>Reps</span>
                    <input type="number" min={1} value={entry.reps ?? 8} onChange={(event) => editEntry(index, { reps: Number(event.target.value) })} />
                  </label>
                  <label>
                    <span>Kg</span>
                    <input type="number" min={0} value={entry.weight ?? 0} onChange={(event) => editEntry(index, { weight: Number(event.target.value) })} />
                  </label>
                </div>
                <div className="routine-edit-actions">
                  <button type="button" className="icon-button compact" onClick={() => moveExercise(index, -1)} aria-label="Move up"><ChevronUp size={14} /></button>
                  <button type="button" className="icon-button compact" onClick={() => moveExercise(index, 1)} aria-label="Move down"><ChevronDown size={14} /></button>
                  <button type="button" className="icon-button compact" onClick={() => removeExercise(index)} aria-label="Remove"><Trash2 size={14} /></button>
                </div>
              </div>
            )
          })}
          {draft.exercises.length === 0 ? (
            <p className="muted-line">No exercises yet. Tap "Add exercise" to start.</p>
          ) : null}
        </div>
        <div className="sheet-footer">
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button onClick={onSave}>Save Routine</Button>
        </div>
      </div>
    </div>
  )
}
