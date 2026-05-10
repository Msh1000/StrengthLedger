import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { CalendarPage } from './pages/CalendarPage'
import { ExercisesPage } from './pages/ExercisesPage'
import { ProgressPage } from './pages/ProgressPage'
import { RoutinesPage } from './pages/RoutinesPage'
import { SettingsPage } from './pages/SettingsPage'
import { TodayPage } from './pages/TodayPage'
import { WorkoutPage } from './pages/WorkoutPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <TodayPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'routines', element: <RoutinesPage /> },
      { path: 'exercises', element: <ExercisesPage /> },
      { path: 'progress', element: <ProgressPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'workout/:id', element: <WorkoutPage /> },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
