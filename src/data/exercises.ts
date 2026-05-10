import type { Exercise } from '../types'

export const exerciseLibrary: Exercise[] = [
  // Chest
  { id: 'bench-press', name: 'Bench Press', muscleGroup: 'Chest', equipment: 'Barbell', defaultRestSeconds: 120, favorite: true },
  { id: 'incline-bench-press', name: 'Incline Bench Press', muscleGroup: 'Chest', equipment: 'Barbell', defaultRestSeconds: 120 },
  { id: 'decline-bench-press', name: 'Decline Bench Press', muscleGroup: 'Chest', equipment: 'Barbell', defaultRestSeconds: 120 },
  { id: 'incline-db-press', name: 'Incline DB Press', muscleGroup: 'Chest', equipment: 'Dumbbell', defaultRestSeconds: 105, favorite: true },
  { id: 'flat-db-press', name: 'Flat DB Press', muscleGroup: 'Chest', equipment: 'Dumbbell', defaultRestSeconds: 105 },
  { id: 'db-fly', name: 'Dumbbell Fly', muscleGroup: 'Chest', equipment: 'Dumbbell', defaultRestSeconds: 75 },
  { id: 'chest-press-machine', name: 'Chest Press Machine', muscleGroup: 'Chest', equipment: 'Machine', defaultRestSeconds: 90 },
  { id: 'pec-deck', name: 'Pec Deck', muscleGroup: 'Chest', equipment: 'Machine', defaultRestSeconds: 75 },
  { id: 'cable-fly', name: 'Cable Fly', muscleGroup: 'Chest', equipment: 'Cable', defaultRestSeconds: 75 },
  { id: 'cable-crossover', name: 'Cable Crossover', muscleGroup: 'Chest', equipment: 'Cable', defaultRestSeconds: 75 },
  { id: 'push-up', name: 'Push Up', muscleGroup: 'Chest', equipment: 'Bodyweight', defaultRestSeconds: 60 },
  { id: 'dips-chest', name: 'Chest Dip', muscleGroup: 'Chest', equipment: 'Bodyweight', defaultRestSeconds: 90 },

  // Back
  { id: 'pull-up', name: 'Pull Up', muscleGroup: 'Back', equipment: 'Bodyweight', defaultRestSeconds: 120, favorite: true },
  { id: 'chin-up', name: 'Chin Up', muscleGroup: 'Back', equipment: 'Bodyweight', defaultRestSeconds: 120 },
  { id: 'lat-pulldown', name: 'Lat Pulldown', muscleGroup: 'Back', equipment: 'Cable', defaultRestSeconds: 90 },
  { id: 'cable-row', name: 'Cable Row', muscleGroup: 'Back', equipment: 'Cable', defaultRestSeconds: 90 },
  { id: 'straight-arm-pulldown', name: 'Straight Arm Pulldown', muscleGroup: 'Back', equipment: 'Cable', defaultRestSeconds: 75 },
  { id: 'barbell-row', name: 'Barbell Row', muscleGroup: 'Back', equipment: 'Barbell', defaultRestSeconds: 120 },
  { id: 'pendlay-row', name: 'Pendlay Row', muscleGroup: 'Back', equipment: 'Barbell', defaultRestSeconds: 120 },
  { id: 'deadlift', name: 'Deadlift', muscleGroup: 'Back', equipment: 'Barbell', defaultRestSeconds: 180 },
  { id: 'db-row', name: 'Dumbbell Row', muscleGroup: 'Back', equipment: 'Dumbbell', defaultRestSeconds: 90 },
  { id: 'seated-row', name: 'Seated Row', muscleGroup: 'Back', equipment: 'Machine', defaultRestSeconds: 90 },
  { id: 'machine-pullover', name: 'Machine Pullover', muscleGroup: 'Back', equipment: 'Machine', defaultRestSeconds: 75 },
  { id: 'back-extension', name: 'Back Extension', muscleGroup: 'Back', equipment: 'Bodyweight', defaultRestSeconds: 75 },

  // Legs
  { id: 'squat', name: 'Back Squat', muscleGroup: 'Legs', equipment: 'Barbell', defaultRestSeconds: 150, favorite: true },
  { id: 'front-squat', name: 'Front Squat', muscleGroup: 'Legs', equipment: 'Barbell', defaultRestSeconds: 150 },
  { id: 'romanian-deadlift', name: 'Romanian Deadlift', muscleGroup: 'Legs', equipment: 'Barbell', defaultRestSeconds: 120 },
  { id: 'hip-thrust', name: 'Hip Thrust', muscleGroup: 'Legs', equipment: 'Barbell', defaultRestSeconds: 120 },
  { id: 'walking-lunge', name: 'Walking Lunge', muscleGroup: 'Legs', equipment: 'Dumbbell', defaultRestSeconds: 90 },
  { id: 'goblet-squat', name: 'Goblet Squat', muscleGroup: 'Legs', equipment: 'Dumbbell', defaultRestSeconds: 90 },
  { id: 'bulgarian-split-squat', name: 'Bulgarian Split Squat', muscleGroup: 'Legs', equipment: 'Dumbbell', defaultRestSeconds: 90 },
  { id: 'leg-press', name: 'Leg Press', muscleGroup: 'Legs', equipment: 'Machine', defaultRestSeconds: 120 },
  { id: 'hack-squat', name: 'Hack Squat', muscleGroup: 'Legs', equipment: 'Machine', defaultRestSeconds: 120 },
  { id: 'leg-extension', name: 'Leg Extension', muscleGroup: 'Legs', equipment: 'Machine', defaultRestSeconds: 75 },
  { id: 'leg-curl', name: 'Lying Leg Curl', muscleGroup: 'Legs', equipment: 'Machine', defaultRestSeconds: 75 },
  { id: 'seated-leg-curl', name: 'Seated Leg Curl', muscleGroup: 'Legs', equipment: 'Machine', defaultRestSeconds: 75 },
  { id: 'calf-raise', name: 'Standing Calf Raise', muscleGroup: 'Legs', equipment: 'Machine', defaultRestSeconds: 60 },
  { id: 'seated-calf-raise', name: 'Seated Calf Raise', muscleGroup: 'Legs', equipment: 'Machine', defaultRestSeconds: 60 },
  { id: 'pistol-squat', name: 'Pistol Squat', muscleGroup: 'Legs', equipment: 'Bodyweight', defaultRestSeconds: 90 },

  // Shoulders
  { id: 'overhead-press', name: 'Overhead Press', muscleGroup: 'Shoulders', equipment: 'Barbell', defaultRestSeconds: 120 },
  { id: 'push-press', name: 'Push Press', muscleGroup: 'Shoulders', equipment: 'Barbell', defaultRestSeconds: 120 },
  { id: 'db-shoulder-press', name: 'Dumbbell Shoulder Press', muscleGroup: 'Shoulders', equipment: 'Dumbbell', defaultRestSeconds: 105 },
  { id: 'arnold-press', name: 'Arnold Press', muscleGroup: 'Shoulders', equipment: 'Dumbbell', defaultRestSeconds: 90 },
  { id: 'lateral-raise', name: 'Lateral Raise', muscleGroup: 'Shoulders', equipment: 'Dumbbell', defaultRestSeconds: 60 },
  { id: 'cable-lateral-raise', name: 'Cable Lateral Raise', muscleGroup: 'Shoulders', equipment: 'Cable', defaultRestSeconds: 60 },
  { id: 'rear-delt-fly', name: 'Rear Delt Fly', muscleGroup: 'Shoulders', equipment: 'Cable', defaultRestSeconds: 60 },
  { id: 'face-pull', name: 'Face Pull', muscleGroup: 'Shoulders', equipment: 'Cable', defaultRestSeconds: 60 },
  { id: 'machine-shoulder-press', name: 'Machine Shoulder Press', muscleGroup: 'Shoulders', equipment: 'Machine', defaultRestSeconds: 90 },
  { id: 'pike-push-up', name: 'Pike Push Up', muscleGroup: 'Shoulders', equipment: 'Bodyweight', defaultRestSeconds: 60 },

  // Biceps
  { id: 'barbell-curl', name: 'Barbell Curl', muscleGroup: 'Biceps', equipment: 'Barbell', defaultRestSeconds: 75 },
  { id: 'ez-curl', name: 'EZ Bar Curl', muscleGroup: 'Biceps', equipment: 'Barbell', defaultRestSeconds: 75 },
  { id: 'db-curl', name: 'Dumbbell Curl', muscleGroup: 'Biceps', equipment: 'Dumbbell', defaultRestSeconds: 60 },
  { id: 'hammer-curl', name: 'Hammer Curl', muscleGroup: 'Biceps', equipment: 'Dumbbell', defaultRestSeconds: 60 },
  { id: 'incline-db-curl', name: 'Incline DB Curl', muscleGroup: 'Biceps', equipment: 'Dumbbell', defaultRestSeconds: 60 },
  { id: 'preacher-curl', name: 'Preacher Curl', muscleGroup: 'Biceps', equipment: 'Machine', defaultRestSeconds: 60 },
  { id: 'cable-curl', name: 'Cable Curl', muscleGroup: 'Biceps', equipment: 'Cable', defaultRestSeconds: 60 },
  { id: 'concentration-curl', name: 'Concentration Curl', muscleGroup: 'Biceps', equipment: 'Dumbbell', defaultRestSeconds: 60 },

  // Triceps
  { id: 'triceps-pushdown', name: 'Triceps Pushdown', muscleGroup: 'Triceps', equipment: 'Cable', defaultRestSeconds: 75 },
  { id: 'rope-pushdown', name: 'Rope Pushdown', muscleGroup: 'Triceps', equipment: 'Cable', defaultRestSeconds: 60 },
  { id: 'overhead-triceps-extension', name: 'Overhead Triceps Extension', muscleGroup: 'Triceps', equipment: 'Cable', defaultRestSeconds: 60 },
  { id: 'skull-crusher', name: 'Skull Crusher', muscleGroup: 'Triceps', equipment: 'Barbell', defaultRestSeconds: 75 },
  { id: 'close-grip-bench', name: 'Close Grip Bench', muscleGroup: 'Triceps', equipment: 'Barbell', defaultRestSeconds: 90 },
  { id: 'db-skull-crusher', name: 'DB Skull Crusher', muscleGroup: 'Triceps', equipment: 'Dumbbell', defaultRestSeconds: 60 },
  { id: 'triceps-kickback', name: 'Triceps Kickback', muscleGroup: 'Triceps', equipment: 'Dumbbell', defaultRestSeconds: 45 },
  { id: 'machine-triceps-dip', name: 'Machine Triceps Dip', muscleGroup: 'Triceps', equipment: 'Machine', defaultRestSeconds: 75 },
  { id: 'dips', name: 'Dips', muscleGroup: 'Triceps', equipment: 'Bodyweight', defaultRestSeconds: 90 },

  // Core
  { id: 'plank', name: 'Plank', muscleGroup: 'Core', equipment: 'Bodyweight', defaultRestSeconds: 45 },
  { id: 'side-plank', name: 'Side Plank', muscleGroup: 'Core', equipment: 'Bodyweight', defaultRestSeconds: 45 },
  { id: 'hanging-leg-raise', name: 'Hanging Leg Raise', muscleGroup: 'Core', equipment: 'Bodyweight', defaultRestSeconds: 60 },
  { id: 'crunch', name: 'Crunch', muscleGroup: 'Core', equipment: 'Bodyweight', defaultRestSeconds: 30 },
  { id: 'bicycle-crunch', name: 'Bicycle Crunch', muscleGroup: 'Core', equipment: 'Bodyweight', defaultRestSeconds: 30 },
  { id: 'russian-twist', name: 'Russian Twist', muscleGroup: 'Core', equipment: 'Dumbbell', defaultRestSeconds: 45 },
  { id: 'cable-crunch', name: 'Cable Crunch', muscleGroup: 'Core', equipment: 'Cable', defaultRestSeconds: 45 },
  { id: 'ab-wheel', name: 'Ab Wheel Rollout', muscleGroup: 'Core', equipment: 'Bodyweight', defaultRestSeconds: 60 },
  { id: 'machine-crunch', name: 'Machine Crunch', muscleGroup: 'Core', equipment: 'Machine', defaultRestSeconds: 45 },
  { id: 'dead-bug', name: 'Dead Bug', muscleGroup: 'Core', equipment: 'Bodyweight', defaultRestSeconds: 30 },
]

export const muscleGroups = ['All', 'Favorites', 'Chest', 'Back', 'Legs', 'Shoulders', 'Biceps', 'Triceps', 'Core'] as const
