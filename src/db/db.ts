import Dexie, { type EntityTable } from 'dexie'
import { formatISO, subDays } from 'date-fns'
import { exerciseLibrary } from '../data/exercises'
import { seedRoutines } from '../data/routines'
import type { Exercise, Routine, Settings, Workout } from '../types'

export const defaultSettings: Settings = {
  units: 'metric',
  defaultRestSeconds: 120,
  autoStartRest: true,
  includeBodyweight: true,
  darkMode: true,
  vibration: true,
  sound: true,
}

export const db = new Dexie('strengthlog') as Dexie & {
  exercises: EntityTable<Exercise, 'id'>
  workouts: EntityTable<Workout, 'id'>
  routines: EntityTable<Routine, 'id'>
  settings: EntityTable<Settings & { id: string }, 'id'>
}

db.version(1).stores({
  exercises: 'id, name, muscleGroup, favorite',
  workouts: 'id, date, completed',
  routines: 'id, active',
  settings: 'id',
})

const today = new Date()

export const buildSeedWorkout = (): Workout => ({
  id: 'workout-today',
  date: formatISO(today, { representation: 'date' }),
  name: 'Push Day',
  startedAt: today.toISOString(),
  durationSeconds: 42 * 60 + 18,
  completed: false,
  exercises: [
    {
      id: 'we-bench',
      exerciseId: 'bench-press',
      name: 'Bench Press',
      muscleGroup: 'Chest',
      equipment: 'Barbell',
      defaultRestSeconds: 120,
      sets: [
        { id: 'bench-1', type: 'warmup', weight: 60, reps: 10, completed: true, createdAt: today.toISOString() },
        { id: 'bench-2', type: 'warmup', weight: 80, reps: 8, completed: true, createdAt: today.toISOString() },
        { id: 'bench-3', type: 'working', weight: 90, reps: 6, completed: true, createdAt: today.toISOString() },
        { id: 'bench-4', type: 'working', weight: 92.5, reps: 6, completed: true, createdAt: today.toISOString() },
        { id: 'bench-5', type: 'working', weight: 95, reps: 5, completed: false, createdAt: today.toISOString() },
      ],
    },
    {
      id: 'we-incline',
      exerciseId: 'incline-db-press',
      name: 'Incline DB Press',
      muscleGroup: 'Chest',
      equipment: 'Dumbbell',
      defaultRestSeconds: 105,
      sets: [
        { id: 'incline-1', type: 'working', weight: 32, reps: 10, completed: true, createdAt: today.toISOString() },
        { id: 'incline-2', type: 'working', weight: 36, reps: 8, completed: false, createdAt: today.toISOString() },
      ],
    },
  ],
})

export const buildPastWorkout = (): Workout => ({
  id: 'workout-last-push',
  date: formatISO(subDays(today, 2), { representation: 'date' }),
  name: 'Push Day',
  startedAt: subDays(today, 2).toISOString(),
  durationSeconds: 56 * 60,
  completed: true,
  exercises: [
    {
      id: 'past-bench',
      exerciseId: 'bench-press',
      name: 'Bench Press',
      muscleGroup: 'Chest',
      equipment: 'Barbell',
      defaultRestSeconds: 120,
      sets: [{ id: 'past-bench-1', type: 'working', weight: 90, reps: 8, completed: true, createdAt: subDays(today, 2).toISOString() }],
    },
    {
      id: 'past-incline',
      exerciseId: 'incline-db-press',
      name: 'Incline DB Press',
      muscleGroup: 'Chest',
      equipment: 'Dumbbell',
      defaultRestSeconds: 105,
      sets: [{ id: 'past-incline-1', type: 'working', weight: 36, reps: 12, completed: true, createdAt: subDays(today, 2).toISOString() }],
    },
  ],
})

export const seedDatabase = async () => {
  const exerciseCount = await db.exercises.count()
  if (exerciseCount === 0) await db.exercises.bulkPut(exerciseLibrary)

  const routineCount = await db.routines.count()
  if (routineCount === 0) await db.routines.bulkPut(seedRoutines)

  const workoutCount = await db.workouts.count()
  if (workoutCount === 0) await db.workouts.bulkPut([buildSeedWorkout(), buildPastWorkout()])

  const settings = await db.settings.get('default')
  if (!settings) await db.settings.put({ id: 'default', ...defaultSettings })
}
