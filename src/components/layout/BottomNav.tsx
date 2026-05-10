import { CalendarDays, Dumbbell, Home, LibraryBig, LineChart } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Today', icon: Home },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/routines', label: 'Routines', icon: LibraryBig },
  { to: '/exercises', label: 'Exercises', icon: Dumbbell },
  { to: '/progress', label: 'Progress', icon: LineChart },
]

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Primary">
      {navItems.map((item) => (
        <NavLink className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} to={item.to} key={item.to}>
          <item.icon size={19} strokeWidth={2.1} />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
