import { MoreHorizontal, Plus } from 'lucide-react'
import { TopBar } from '../components/layout/TopBar'
import { GlassCard } from '../components/ui/GlassCard'
import { useAppStore } from '../store/useAppStore'

export function RoutinesPage() {
  const routines = useAppStore((state) => state.routines)

  return (
    <div className="screen">
      <TopBar title="Routines" />
      <div className="routine-actions">
        <button className="icon-button" type="button" aria-label="Create routine">
          <Plus size={22} />
        </button>
      </div>
      <div className="routine-stack">
        {routines.map((routine) => (
          <GlassCard className={`routine-card ${routine.active ? 'active' : ''}`} key={routine.id} glow={routine.active}>
            <div className="routine-title">
              <div>
                <h2>{routine.name}</h2>
                <p>{routine.daysPerWeek} days per week</p>
              </div>
              {routine.active ? <span className="active-badge">Active</span> : <MoreHorizontal size={20} />}
            </div>
            {routine.days.map((day) => (
              <div className="routine-day" key={day.title}>
                <strong>{day.title}</strong>
                <span>{day.focus}</span>
              </div>
            ))}
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
