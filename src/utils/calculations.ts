import type { Workout, WorkoutExercise, WorkoutSet } from '../types'

const volumeTypes = new Set(['working', 'drop', 'failure'])

export const setVolume = (set: WorkoutSet) =>
  set.completed && volumeTypes.has(set.type) ? set.weight * set.reps : 0

export const estimatedOneRepMax = (weight: number, reps: number) =>
  Math.round(weight * (1 + reps / 30) * 10) / 10

export const exerciseVolume = (exercise: WorkoutExercise) =>
  exercise.sets.reduce((total, set) => total + setVolume(set), 0)

export const workoutVolume = (workout?: Workout) =>
  workout?.exercises.reduce((total, exercise) => total + exerciseVolume(exercise), 0) ?? 0

export const completedSets = (workout?: Workout) =>
  workout?.exercises.reduce((total, exercise) => total + exercise.sets.filter((set) => set.completed).length, 0) ?? 0

export const bestOneRepMax = (workout?: Workout) => {
  if (!workout) return 0
  return workout.exercises.reduce((best, exercise) => {
    const exerciseBest = exercise.sets.reduce((setBest, set) => {
      if (!set.completed || set.reps <= 0 || set.weight <= 0) return setBest
      return Math.max(setBest, estimatedOneRepMax(set.weight, set.reps))
    }, 0)
    return Math.max(best, exerciseBest)
  }, 0)
}

export const formatWeight = (value: number, unit = 'kg') =>
  `${Math.round(value).toLocaleString()} ${unit}`

export const formatDuration = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  if (hrs > 0) return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export const detectSetPr = (exercise: WorkoutExercise, set: WorkoutSet) => {
  if (!set.completed) return false
  const currentMax = estimatedOneRepMax(set.weight, set.reps)
  const previousBest = exercise.sets
    .filter((candidate) => candidate.id !== set.id && candidate.completed)
    .reduce((best, candidate) => Math.max(best, estimatedOneRepMax(candidate.weight, candidate.reps)), 0)
  return currentMax >= previousBest && currentMax > 0
}
