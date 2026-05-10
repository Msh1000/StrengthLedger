import { Flame, Star } from 'lucide-react'
import { TopBar } from '../components/layout/TopBar'
import { MiniLineChart } from '../components/charts/MiniLineChart'
import { GlassCard } from '../components/ui/GlassCard'
import { StatCard } from '../components/ui/StatCard'
import { useAppStore } from '../store/useAppStore'
import { bestOneRepMax, formatWeight, workoutVolume } from '../utils/calculations'

export function ProgressPage() {
  const workouts = useAppStore((state) => state.workouts)
  const topWorkout = workouts.length > 0 ? workouts.reduce((best, workout) => (workoutVolume(workout) > workoutVolume(best) ? workout : best), workouts[0]) : undefined
  const bestOrm = Math.max(...workouts.map((workout) => bestOneRepMax(workout)), 0)
  const totalVolume = workouts.reduce((sum, workout) => sum + workoutVolume(workout), 0)

  return (
    <div className="screen">
      <TopBar title="Bench Press" back menu />
      <div className="tab-strip">
        <button className="active" type="button">Overview</button>
        <button type="button">History</button>
        <button type="button">PRs</button>
      </div>
      <div className="stats-grid three">
        <StatCard label="Best 1RM" value={`${bestOrm || 102.5} kg`} accent icon={<Star size={15} />} />
        <StatCard label="Best Set" value="100 kg x 6" />
        <StatCard label="Total Volume" value={formatWeight(totalVolume || 24350)} />
      </div>
      <GlassCard className="progress-card">
        <div className="card-title-row">
          <h2>Estimated 1RM Progress</h2>
          <span>6 Months</span>
        </div>
        <MiniLineChart points={[78, 82, 86, 87, 91, 92, 96, 99, 101, 104]} />
      </GlassCard>
      <GlassCard className="progress-card">
        <h2>Recent PRs</h2>
        {['100 kg x 6', '95 kg x 6', '90 kg x 6'].map((set, index) => (
          <div className="pr-history" key={set}>
            <div>
              <span>{index === 0 ? 'May 13, 2026' : index === 1 ? 'May 1, 2026' : 'Apr 15, 2026'}</span>
              <strong>{set}</strong>
            </div>
            <Flame size={18} className="flame" fill="currentColor" />
          </div>
        ))}
      </GlassCard>
      {topWorkout ? <p className="fine-print">Best session: {topWorkout.name} at {formatWeight(workoutVolume(topWorkout))}</p> : null}
    </div>
  )
}
