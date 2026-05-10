import type { Routine } from '../types'

export const seedRoutines: Routine[] = [
  {
    id: 'ppl-3',
    name: '3 Day Push Pull Legs',
    daysPerWeek: 3,
    active: true,
    fixedWeekdays: true,
    days: [
      { title: 'Day 1 - Push', focus: 'Chest, Shoulders, Triceps', exercises: ['Bench Press', 'Incline DB Press', 'Overhead Press'] },
      { title: 'Day 2 - Pull', focus: 'Back, Biceps', exercises: ['Pull Up', 'Lat Pulldown', 'Barbell Row'] },
      { title: 'Day 3 - Legs', focus: 'Quads, Hamstrings, Calves', exercises: ['Back Squat', 'Romanian Deadlift', 'Leg Press'] },
    ],
  },
  {
    id: 'upper-lower',
    name: 'Upper / Lower',
    daysPerWeek: 4,
    active: false,
    fixedWeekdays: false,
    days: [
      { title: 'Upper', focus: 'Chest, Back, Shoulders, Arms', exercises: ['Bench Press', 'Seated Row', 'Lateral Raise'] },
      { title: 'Lower', focus: 'Legs, Calves', exercises: ['Back Squat', 'Leg Curl', 'Standing Calf Raise'] },
    ],
  },
]
