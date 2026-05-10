import { create } from 'zustand'
import { addDays, format, formatISO } from 'date-fns'
import { clearAllData, db, defaultSettings, seedDatabase } from '../db/db'
import { exerciseLibrary } from '../data/exercises'
import { seedRoutines } from '../data/routines'
import type {
  Exercise,
  RestTimerState,
  Routine,
  RoutineExerciseTemplate,
  Settings,
  SetType,
  Workout,
  WorkoutExercise,
  WorkoutSet,
} from '../types'

const todayKey = () => formatISO(new Date(), { representation: 'date' })
const id = () => crypto.randomUUID()

interface AppState {
  booted: boolean
  selectedDate: string
  workouts: Workout[]
  exercises: Exercise[]
  routines: Routine[]
  settings: Settings
  timer: RestTimerState
  boot: () => Promise<void>
  setSelectedDate: (date: string) => void
  shiftSelectedDate: (days: number) => void
  updateSettings: (settings: Partial<Settings>) => Promise<void>
  resetAllData: () => Promise<void>
  createWorkoutForDate: (date: string, opts?: { name?: string; routineId?: string }) => Promise<Workout>
  renameWorkout: (workoutId: string, name: string) => Promise<void>
  completeWorkout: (workoutId: string) => Promise<void>
  addExerciseToWorkout: (workoutId: string, exercise: Exercise, restSecondsOverride?: number) => Promise<void>
  addRoutineToWorkout: (workoutId: string, routineId: string, options?: { skipDuplicates?: boolean }) => Promise<void>
  deleteExercise: (workoutId: string, workoutExerciseId: string) => Promise<void>
  reorderExercises: (workoutId: string, fromIndex: number, toIndex: number) => Promise<void>
  setExerciseRest: (workoutId: string, workoutExerciseId: string, seconds: number) => Promise<void>
  addSet: (workoutId: string, workoutExerciseId: string, set?: Partial<WorkoutSet>) => Promise<void>
  updateSet: (workoutId: string, workoutExerciseId: string, setId: string, patch: Partial<WorkoutSet>) => Promise<void>
  deleteSet: (workoutId: string, workoutExerciseId: string, setId: string) => Promise<void>
  toggleFavorite: (exerciseId: string) => Promise<void>
  saveRoutine: (routine: Routine) => Promise<void>
  deleteRoutine: (routineId: string) => Promise<void>
  startTimer: (seconds: number, exerciseName?: string, setLabel?: string) => void
  tickTimer: () => void
  pauseTimer: () => void
  resumeTimer: () => void
  resetTimer: () => void
  addTimerSeconds: (seconds: number) => void
  skipTimer: () => void
}

const saveWorkout = async (workout: Workout) => {
  await db.workouts.put(workout)
}

const mutateWorkout = async (
  get: () => AppState,
  set: (state: Partial<AppState>) => void,
  workoutId: string,
  updater: (workout: Workout) => Workout,
) => {
  const nextWorkouts = get().workouts.map((workout) => (workout.id === workoutId ? updater(workout) : workout))
  const changed = nextWorkouts.find((workout) => workout.id === workoutId)
  if (changed) await saveWorkout(changed)
  set({ workouts: nextWorkouts })
}

const buildWorkoutExerciseFromTemplate = (
  exercise: Exercise,
  template?: RoutineExerciseTemplate,
): WorkoutExercise => {
  const setCount = Math.max(1, template?.sets ?? 1)
  const reps = template?.reps ?? 8
  const weight = template?.weight ?? (exercise.equipment === 'Bodyweight' ? 0 : 20)
  const sets: WorkoutSet[] = Array.from({ length: setCount }, () => ({
    id: id(),
    type: 'working' as SetType,
    weight,
    reps,
    completed: false,
    createdAt: new Date().toISOString(),
  }))
  return {
    id: id(),
    exerciseId: exercise.id,
    name: exercise.name,
    muscleGroup: exercise.muscleGroup,
    equipment: exercise.equipment,
    defaultRestSeconds: exercise.defaultRestSeconds,
    sets,
  }
}

export const useAppStore = create<AppState>((set, get) => ({
  booted: false,
  selectedDate: todayKey(),
  workouts: [],
  exercises: [],
  routines: [],
  settings: defaultSettings,
  timer: { active: false, secondsLeft: 0, totalSeconds: 0, paused: false },

  boot: async () => {
    await seedDatabase()
    const [workouts, exercises, routines, persistedSettings] = await Promise.all([
      db.workouts.toArray(),
      db.exercises.toArray(),
      db.routines.toArray(),
      db.settings.get('default'),
    ])
    set({
      booted: true,
      workouts,
      exercises,
      routines,
      settings: persistedSettings ? { ...defaultSettings, ...persistedSettings } : defaultSettings,
    })
  },

  setSelectedDate: (selectedDate) => set({ selectedDate }),
  shiftSelectedDate: (days) => {
    const next = addDays(new Date(`${get().selectedDate}T12:00:00`), days)
    set({ selectedDate: formatISO(next, { representation: 'date' }) })
  },

  updateSettings: async (patch) => {
    const settings = { ...get().settings, ...patch }
    await db.settings.put({ id: 'default', ...settings })
    set({ settings })
  },

  resetAllData: async () => {
    await clearAllData()
    await db.exercises.bulkPut(exerciseLibrary)
    await db.routines.bulkPut(seedRoutines)
    await db.settings.put({ id: 'default', ...defaultSettings })
    set({
      workouts: [],
      exercises: [...exerciseLibrary],
      routines: [...seedRoutines],
      settings: defaultSettings,
      timer: { active: false, secondsLeft: 0, totalSeconds: 0, paused: false },
      selectedDate: todayKey(),
    })
  },

  createWorkoutForDate: async (date, opts) => {
    const friendly = format(new Date(`${date}T12:00:00`), 'MMM d')
    const workout: Workout = {
      id: id(),
      date,
      name: opts?.name ?? `Workout - ${friendly}`,
      startedAt: new Date().toISOString(),
      durationSeconds: 0,
      completed: false,
      exercises: [],
      routineId: opts?.routineId,
    }
    await saveWorkout(workout)
    set({ workouts: [...get().workouts, workout] })
    return workout
  },

  renameWorkout: async (workoutId, name) => {
    await mutateWorkout(get, set, workoutId, (workout) => ({ ...workout, name }))
  },

  completeWorkout: async (workoutId) => {
    await mutateWorkout(get, set, workoutId, (workout) => {
      const startedAt = new Date(workout.startedAt)
      const now = new Date()
      const durationSeconds = Math.floor((now.getTime() - startedAt.getTime()) / 1000)
      return { ...workout, completed: true, durationSeconds }
    })
  },

  addExerciseToWorkout: async (workoutId, exercise, restSecondsOverride) => {
    const workoutExercise = buildWorkoutExerciseFromTemplate(exercise)
    if (typeof restSecondsOverride === 'number') {
      workoutExercise.defaultRestSeconds = restSecondsOverride
    }
    await mutateWorkout(get, set, workoutId, (workout) => {
      if (workout.completed) {
        return {
          ...workout,
          exercises: [...workout.exercises, workoutExercise],
          completed: false,
          startedAt: new Date().toISOString(),
        }
      }
      return { ...workout, exercises: [...workout.exercises, workoutExercise] }
    })
  },

  addRoutineToWorkout: async (workoutId, routineId, options) => {
    const routine = get().routines.find((item) => item.id === routineId)
    if (!routine) return
    const exercises = get().exercises
    const skipDuplicates = options?.skipDuplicates ?? true

    await mutateWorkout(get, set, workoutId, (workout) => {
      const existingIds = new Set(workout.exercises.map((entry) => entry.exerciseId))
      const additions: WorkoutExercise[] = []
      for (const template of routine.exercises) {
        if (skipDuplicates && existingIds.has(template.exerciseId)) continue
        const exercise = exercises.find((item) => item.id === template.exerciseId)
        if (!exercise) continue
        additions.push(buildWorkoutExerciseFromTemplate(exercise, template))
      }
      const nextName = workout.exercises.length === 0 ? routine.name : workout.name
      if (workout.completed) {
        return {
          ...workout,
          name: nextName,
          exercises: [...workout.exercises, ...additions],
          routineId: routine.id,
          completed: false,
          startedAt: new Date().toISOString(),
        }
      }
      return { ...workout, name: nextName, exercises: [...workout.exercises, ...additions], routineId: routine.id }
    })
  },

  deleteExercise: async (workoutId, workoutExerciseId) => {
    await mutateWorkout(get, set, workoutId, (workout) => ({
      ...workout,
      exercises: workout.exercises.filter((exercise) => exercise.id !== workoutExerciseId),
    }))
  },

  reorderExercises: async (workoutId, fromIndex, toIndex) => {
    await mutateWorkout(get, set, workoutId, (workout) => {
      const exercises = [...workout.exercises]
      const [removed] = exercises.splice(fromIndex, 1)
      exercises.splice(toIndex, 0, removed)
      return { ...workout, exercises }
    })
  },

  setExerciseRest: async (workoutId, workoutExerciseId, seconds) => {
    await mutateWorkout(get, set, workoutId, (workout) => ({
      ...workout,
      exercises: workout.exercises.map((exercise) =>
        exercise.id === workoutExerciseId ? { ...exercise, defaultRestSeconds: seconds } : exercise,
      ),
    }))
  },

  addSet: async (workoutId, workoutExerciseId, setPatch) => {
    await mutateWorkout(get, set, workoutId, (workout) => ({
      ...workout,
      exercises: workout.exercises.map((exercise) => {
        if (exercise.id !== workoutExerciseId) return exercise
        const previous = exercise.sets.at(-1)
        const nextSet: WorkoutSet = {
          id: id(),
          type: (setPatch?.type as SetType) ?? 'working',
          weight: setPatch?.weight ?? previous?.weight ?? 20,
          reps: setPatch?.reps ?? previous?.reps ?? 8,
          completed: setPatch?.completed ?? false,
          createdAt: new Date().toISOString(),
        }
        return { ...exercise, sets: [...exercise.sets, nextSet] }
      }),
    }))
  },

  updateSet: async (workoutId, workoutExerciseId, setId, patch) => {
    let timerPayload: { seconds: number; exerciseName: string; setLabel: string } | undefined
    await mutateWorkout(get, set, workoutId, (workout) => ({
      ...workout,
      exercises: workout.exercises.map((exercise) => {
        if (exercise.id !== workoutExerciseId) return exercise
        return {
          ...exercise,
          sets: exercise.sets.map((workoutSet, index) => {
            if (workoutSet.id !== setId) return workoutSet
            const completedNow = patch.completed === true && !workoutSet.completed
            if (completedNow && get().settings.autoStartRest) {
              timerPayload = { seconds: exercise.defaultRestSeconds, exerciseName: exercise.name, setLabel: `Set ${index + 1}` }
            }
            return { ...workoutSet, ...patch }
          }),
        }
      }),
    }))
    if (timerPayload) get().startTimer(timerPayload.seconds, timerPayload.exerciseName, timerPayload.setLabel)
  },

  deleteSet: async (workoutId, workoutExerciseId, setId) => {
    await mutateWorkout(get, set, workoutId, (workout) => ({
      ...workout,
      exercises: workout.exercises.map((exercise) =>
        exercise.id === workoutExerciseId
          ? { ...exercise, sets: exercise.sets.filter((workoutSet) => workoutSet.id !== setId) }
          : exercise,
      ),
    }))
  },

  toggleFavorite: async (exerciseId) => {
    const exercises = get().exercises.map((exercise) =>
      exercise.id === exerciseId ? { ...exercise, favorite: !exercise.favorite } : exercise,
    )
    const changed = exercises.find((exercise) => exercise.id === exerciseId)
    if (changed) await db.exercises.put(changed)
    set({ exercises })
  },

  saveRoutine: async (routine) => {
    await db.routines.put(routine)
    const existing = get().routines.find((item) => item.id === routine.id)
    const routines = existing
      ? get().routines.map((item) => (item.id === routine.id ? routine : item))
      : [...get().routines, routine]
    set({ routines })
  },

  deleteRoutine: async (routineId) => {
    await db.routines.delete(routineId)
    set({ routines: get().routines.filter((item) => item.id !== routineId) })
  },

  startTimer: (seconds, exerciseName, setLabel) =>
    set({ timer: { active: true, paused: false, secondsLeft: seconds, totalSeconds: seconds, exerciseName, setLabel } }),
  tickTimer: () => {
    const timer = get().timer
    if (!timer.active || timer.paused) return
    set({ timer: { ...timer, secondsLeft: Math.max(0, timer.secondsLeft - 1), active: timer.secondsLeft > 1 } })
  },
  pauseTimer: () => set({ timer: { ...get().timer, paused: true } }),
  resumeTimer: () => set({ timer: { ...get().timer, paused: false } }),
  resetTimer: () => set({ timer: { ...get().timer, secondsLeft: get().timer.totalSeconds, paused: false } }),
  addTimerSeconds: (seconds) => set({ timer: { ...get().timer, secondsLeft: Math.max(0, get().timer.secondsLeft + seconds) } }),
  skipTimer: () => set({ timer: { active: false, paused: false, secondsLeft: 0, totalSeconds: 0 } }),
}))

export const newRoutineId = () => id()
