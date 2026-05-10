export type SetType = 'working' | 'warmup' | 'rest' | 'drop' | 'failure'

export type MuscleGroup =
  | 'Chest'
  | 'Back'
  | 'Legs'
  | 'Shoulders'
  | 'Biceps'
  | 'Triceps'
  | 'Core'

export interface Exercise {
  id: string
  name: string
  muscleGroup: MuscleGroup
  equipment: string
  defaultRestSeconds: number
  favorite?: boolean
}

export interface WorkoutSet {
  id: string
  type: SetType
  weight: number
  reps: number
  completed: boolean
  createdAt: string
}

export interface WorkoutExercise {
  id: string
  exerciseId: string
  name: string
  muscleGroup: MuscleGroup
  equipment: string
  defaultRestSeconds: number
  notes?: string
  sets: WorkoutSet[]
}

export interface Workout {
  id: string
  date: string
  name: string
  startedAt: string
  durationSeconds: number
  completed: boolean
  exercises: WorkoutExercise[]
}

export interface RoutineDay {
  title: string
  focus: string
  exercises: string[]
}

export interface Routine {
  id: string
  name: string
  daysPerWeek: number
  active: boolean
  fixedWeekdays: boolean
  days: RoutineDay[]
}

export interface Settings {
  units: 'metric' | 'imperial'
  defaultRestSeconds: number
  autoStartRest: boolean
  includeBodyweight: boolean
  darkMode: boolean
  vibration: boolean
  sound: boolean
}

export interface RestTimerState {
  active: boolean
  secondsLeft: number
  totalSeconds: number
  exerciseName?: string
  setLabel?: string
  paused: boolean
}
