import Dexie, { type EntityTable } from 'dexie'
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
  notifications: false,
  colorTheme: 'purple',
  quickRestTimes: [30, 60, 90, 120, 180],
  soundDuration: 0.8,
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

export const seedDatabase = async () => {
  const exerciseCount = await db.exercises.count()
  if (exerciseCount === 0) {
    await db.exercises.bulkPut(exerciseLibrary)
  } else {
    // Add any new exercises that aren't yet in the DB without duplicating existing ones
    const existing = new Set((await db.exercises.toCollection().primaryKeys()) as string[])
    const toInsert = exerciseLibrary.filter((exercise) => !existing.has(exercise.id))
    if (toInsert.length > 0) await db.exercises.bulkAdd(toInsert)
  }

  const routineCount = await db.routines.count()
  if (routineCount === 0) await db.routines.bulkPut(seedRoutines)

  const settings = await db.settings.get('default')
  if (!settings) {
    await db.settings.put({ id: 'default', ...defaultSettings })
  } else {
    // Migrate: ensure new settings keys exist
    const merged = { ...defaultSettings, ...settings, id: 'default' }
    await db.settings.put(merged)
  }
}

export const clearAllData = async () => {
  await Promise.all([db.workouts.clear(), db.routines.clear(), db.exercises.clear(), db.settings.clear()])
}
