import type { Exercise } from '../types'

export const exerciseLibrary: Exercise[] = [
  { id: 'bench-press', name: 'Bench Press', muscleGroup: 'Chest', equipment: 'Barbell', defaultRestSeconds: 120, favorite: true },
  { id: 'incline-db-press', name: 'Incline DB Press', muscleGroup: 'Chest', equipment: 'Dumbbell', defaultRestSeconds: 105, favorite: true },
  { id: 'chest-press-machine', name: 'Chest Press Machine', muscleGroup: 'Chest', equipment: 'Machine', defaultRestSeconds: 90 },
  { id: 'cable-fly', name: 'Cable Fly', muscleGroup: 'Chest', equipment: 'Cable', defaultRestSeconds: 75 },
  { id: 'push-up', name: 'Push Up', muscleGroup: 'Chest', equipment: 'Bodyweight', defaultRestSeconds: 60 },
  { id: 'pull-up', name: 'Pull Up', muscleGroup: 'Back', equipment: 'Bodyweight', defaultRestSeconds: 120, favorite: true },
  { id: 'lat-pulldown', name: 'Lat Pulldown', muscleGroup: 'Back', equipment: 'Cable', defaultRestSeconds: 90 },
  { id: 'barbell-row', name: 'Barbell Row', muscleGroup: 'Back', equipment: 'Barbell', defaultRestSeconds: 120 },
  { id: 'seated-row', name: 'Seated Row', muscleGroup: 'Back', equipment: 'Machine', defaultRestSeconds: 90 },
  { id: 'back-extension', name: 'Back Extension', muscleGroup: 'Back', equipment: 'Bodyweight', defaultRestSeconds: 75 },
  { id: 'squat', name: 'Back Squat', muscleGroup: 'Legs', equipment: 'Barbell', defaultRestSeconds: 150, favorite: true },
  { id: 'leg-press', name: 'Leg Press', muscleGroup: 'Legs', equipment: 'Machine', defaultRestSeconds: 120 },
  { id: 'romanian-deadlift', name: 'Romanian Deadlift', muscleGroup: 'Legs', equipment: 'Barbell', defaultRestSeconds: 120 },
  { id: 'leg-curl', name: 'Lying Leg Curl', muscleGroup: 'Legs', equipment: 'Machine', defaultRestSeconds: 75 },
  { id: 'calf-raise', name: 'Standing Calf Raise', muscleGroup: 'Legs', equipment: 'Machine', defaultRestSeconds: 60 },
  { id: 'overhead-press', name: 'Overhead Press', muscleGroup: 'Shoulders', equipment: 'Barbell', defaultRestSeconds: 120 },
  { id: 'lateral-raise', name: 'Lateral Raise', muscleGroup: 'Shoulders', equipment: 'Dumbbell', defaultRestSeconds: 60 },
  { id: 'rear-delt-fly', name: 'Rear Delt Fly', muscleGroup: 'Shoulders', equipment: 'Cable', defaultRestSeconds: 60 },
  { id: 'barbell-curl', name: 'Barbell Curl', muscleGroup: 'Biceps', equipment: 'Barbell', defaultRestSeconds: 75 },
  { id: 'hammer-curl', name: 'Hammer Curl', muscleGroup: 'Biceps', equipment: 'Dumbbell', defaultRestSeconds: 60 },
  { id: 'triceps-pushdown', name: 'Triceps Pushdown', muscleGroup: 'Triceps', equipment: 'Cable', defaultRestSeconds: 75 },
  { id: 'dips', name: 'Dips', muscleGroup: 'Triceps', equipment: 'Bodyweight', defaultRestSeconds: 90 },
  { id: 'plank', name: 'Plank', muscleGroup: 'Core', equipment: 'Bodyweight', defaultRestSeconds: 45 },
  { id: 'hanging-leg-raise', name: 'Hanging Leg Raise', muscleGroup: 'Core', equipment: 'Bodyweight', defaultRestSeconds: 60 },
]

export const muscleGroups = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Biceps', 'Triceps', 'Core'] as const
