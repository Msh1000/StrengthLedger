import type { Routine } from '../types'

export const seedRoutines: Routine[] = [
  {
    id: 'seed-push',
    name: 'Push Day',
    exercises: [
      { exerciseId: 'bench-press', sets: 4, reps: 6, weight: 80 },
      { exerciseId: 'incline-db-press', sets: 3, reps: 10, weight: 30 },
      { exerciseId: 'overhead-press', sets: 3, reps: 8, weight: 40 },
      { exerciseId: 'lateral-raise', sets: 3, reps: 12, weight: 10 },
      { exerciseId: 'triceps-pushdown', sets: 3, reps: 12, weight: 25 },
    ],
  },
  {
    id: 'seed-pull',
    name: 'Pull Day',
    exercises: [
      { exerciseId: 'pull-up', sets: 4, reps: 8, weight: 0 },
      { exerciseId: 'barbell-row', sets: 3, reps: 8, weight: 70 },
      { exerciseId: 'lat-pulldown', sets: 3, reps: 10, weight: 55 },
      { exerciseId: 'face-pull', sets: 3, reps: 15, weight: 18 },
      { exerciseId: 'barbell-curl', sets: 3, reps: 10, weight: 30 },
    ],
  },
  {
    id: 'seed-legs',
    name: 'Leg Day',
    exercises: [
      { exerciseId: 'squat', sets: 4, reps: 6, weight: 100 },
      { exerciseId: 'romanian-deadlift', sets: 3, reps: 8, weight: 90 },
      { exerciseId: 'leg-press', sets: 3, reps: 10, weight: 140 },
      { exerciseId: 'leg-curl', sets: 3, reps: 12, weight: 35 },
      { exerciseId: 'calf-raise', sets: 4, reps: 15, weight: 60 },
    ],
  },
  {
    id: 'seed-upper',
    name: 'Upper Body',
    exercises: [
      { exerciseId: 'bench-press', sets: 3, reps: 8, weight: 75 },
      { exerciseId: 'seated-row', sets: 3, reps: 10, weight: 55 },
      { exerciseId: 'db-shoulder-press', sets: 3, reps: 10, weight: 22 },
      { exerciseId: 'lateral-raise', sets: 3, reps: 12, weight: 10 },
    ],
  },
  {
    id: 'seed-lower',
    name: 'Lower Body',
    exercises: [
      { exerciseId: 'squat', sets: 4, reps: 6, weight: 100 },
      { exerciseId: 'leg-curl', sets: 3, reps: 12, weight: 35 },
      { exerciseId: 'calf-raise', sets: 4, reps: 15, weight: 60 },
    ],
  },
]
