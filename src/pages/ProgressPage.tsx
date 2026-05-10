import { Flame, Star } from 'lucide-react'
import { useState } from 'react'
import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { TopBar } from '../components/layout/TopBar'
import { MiniLineChart } from '../components/charts/MiniLineChart'
import { GlassCard } from '../components/ui/GlassCard'
import { StatCard } from '../components/ui/StatCard'
import { useAppStore } from '../store/useAppStore'
import { bestOneRepMax, completedSets, estimatedOneRepMax, formatDuration, formatWeight, toNumber, workoutVolume } from '../utils/calculations'

type Tab = 'overview' | 'history' | 'prs'

export function ProgressPage() {
  const navigate = useNavigate()
  const workouts = useAppStore((state) => state.workouts)
  const [tab, setTab] = useState<Tab>('overview')

  const sortedWorkouts = [...workouts].sort((a, b) => (a.date < b.date ? 1 : -1))
  const bestOrm = Math.max(...workouts.map((workout) => bestOneRepMax(workout)), 0)
  const totalVolume = workouts.reduce((sum, workout) => sum + workoutVolume(workout), 0)

  const prList = workouts
    .flatMap((workout) =>
          workout.exercises.flatMap((exercise) =>
            exercise.sets
          .filter((set) => set.completed && toNumber(set.weight) > 0 && toNumber(set.reps) > 0)
          .map((set) => ({
            id: `${workout.id}-${exercise.id}-${set.id}`,
            date: workout.date,
            exerciseName: exercise.name,
            weight: toNumber(set.weight),
            reps: toNumber(set.reps),
            orm: estimatedOneRepMax(toNumber(set.weight), toNumber(set.reps)),
          })),
      ),
    )
    .sort((a, b) => b.orm - a.orm)
    .slice(0, 12)

  const trend = workouts
    .slice(-10)
    .map((workout) => bestOneRepMax(workout))
    .filter((value) => value > 0)

  return (
    <div className="screen">
      <TopBar title="Progress" />
      <div className="tab-strip">
        <button className={tab === 'overview' ? 'active' : ''} type="button" onClick={() => setTab('overview')}>Overview</button>
        <button className={tab === 'history' ? 'active' : ''} type="button" onClick={() => setTab('history')}>History</button>
        <button className={tab === 'prs' ? 'active' : ''} type="button" onClick={() => setTab('prs')}>PRs</button>
      </div>

      {tab === 'overview' ? (
        <>
          <div className="stats-grid three">
            <StatCard label="Best 1RM" value={`${bestOrm || 0} kg`} accent icon={<Star size={15} />} />
            <StatCard label="Workouts" value={`${workouts.length}`} />
            <StatCard label="Total Volume" value={formatWeight(totalVolume)} />
          </div>
          <GlassCard className="progress-card">
            <div className="card-title-row">
              <h2>Estimated 1RM Trend</h2>
              <span>{trend.length} sessions</span>
            </div>
            {trend.length > 1 ? <MiniLineChart points={trend} /> : <p className="muted-line">Log a few workouts to see your trend.</p>}
          </GlassCard>
        </>
      ) : null}

      {tab === 'history' ? (
        <div className="stack">
          {sortedWorkouts.length === 0 ? (
            <GlassCard className="empty-state"><h2>No workouts yet</h2><p className="muted-line">Your completed sessions will appear here.</p></GlassCard>
          ) : (
            sortedWorkouts.map((workout) => (
              <GlassCard className="summary-row" key={workout.id} onClick={() => navigate(`/workout/${workout.id}`)} role="button" tabIndex={0}>
                <div>
                  <strong>{workout.name}</strong>
                  <span>{format(new Date(`${workout.date}T12:00:00`), 'MMM d, yyyy')} - {formatDuration(workout.durationSeconds)}</span>
                  <span>{completedSets(workout)} sets - {formatWeight(workoutVolume(workout))}</span>
                </div>
                <strong className="accent-text">{bestOneRepMax(workout) || '--'} kg</strong>
              </GlassCard>
            ))
          )}
        </div>
      ) : null}

      {tab === 'prs' ? (
        <div className="stack">
          {prList.length === 0 ? (
            <GlassCard className="empty-state"><h2>No PRs yet</h2><p className="muted-line">Complete a working set with a weight and rep count to track PRs.</p></GlassCard>
          ) : (
            prList.map((pr) => (
              <GlassCard className="pr-history" key={pr.id}>
                <div>
                  <span>{format(new Date(`${pr.date}T12:00:00`), 'MMM d, yyyy')}</span>
                  <strong>{pr.exerciseName} - {pr.weight} kg x {pr.reps}</strong>
                </div>
                <div className="pr-history-orm">
                  <Flame size={18} className="flame" fill="currentColor" />
                  <span>{pr.orm} kg</span>
                </div>
              </GlassCard>
            ))
          )}
        </div>
      ) : null}
    </div>
  )
}
