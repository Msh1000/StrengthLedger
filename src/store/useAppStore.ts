import { create } from 'zustand'
import { addDays, formatISO } from 'date-fns'
import { db, defaultSettings, seedDatabase } from '../db/db'
import type { Exercise, RestTimerState, Routine, Settings, SetType, Workout, WorkoutExercise, WorkoutSet } from '../types'
import { requestNotificationPermission } from '../utils/notifications'

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
  createWorkoutForDate: (date: string) => Promise<Workout>
  addExerciseToWorkout: (workoutId: string, exercise: Exercise) => Promise<void>
  deleteExercise: (workoutId: string, workoutExerciseId: string) => Promise<void>
  addSet: (workoutId: string, workoutExerciseId: string, set?: Partial<WorkoutSet>) => Promise<void>
  updateSet: (workoutId: string, workoutExerciseId: string, setId: string, patch: Partial<WorkoutSet>) => Promise<void>
  deleteSet: (workoutId: string, workoutExerciseId: string, setId: string) => Promise<void>
  toggleFavorite: (exerciseId: string) => Promise<void>
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
    await requestNotificationPermission()
    set({
      booted: true,
      workouts,
      exercises,
      routines,
      settings: persistedSettings ?? defaultSettings,
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

  createWorkoutForDate: async (date) => {
    const workout: Workout = {
      id: id(),
      date,
      name: 'Push Day',
      startedAt: new Date().toISOString(),
      durationSeconds: 0,
      completed: false,
      exercises: [],
    }
    await saveWorkout(workout)
    set({ workouts: [...get().workouts, workout] })
    return workout
  },

  addExerciseToWorkout: async (workoutId, exercise) => {
    const workoutExercise: WorkoutExercise = {
      id: id(),
      exerciseId: exercise.id,
      name: exercise.name,
      muscleGroup: exercise.muscleGroup,
      equipment: exercise.equipment,
      defaultRestSeconds: exercise.defaultRestSeconds,
      sets: [
        {
          id: id(),
          type: 'working',
          weight: exercise.equipment === 'Bodyweight' ? 0 : 20,
          reps: 8,
          completed: false,
          createdAt: new Date().toISOString(),
        },
      ],
    }
    await mutateWorkout(get, set, workoutId, (workout) => ({ ...workout, exercises: [...workout.exercises, workoutExercise] }))
  },

  deleteExercise: async (workoutId, workoutExerciseId) => {
    await mutateWorkout(get, set, workoutId, (workout) => ({
      ...workout,
      exercises: workout.exercises.filter((exercise) => exercise.id !== workoutExerciseId),
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
