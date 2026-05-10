import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string
  accent?: boolean
  icon?: ReactNode
}

export function StatCard({ label, value, accent = false, icon }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className={accent ? 'stat-value accent-text' : 'stat-value'}>{value}</div>
      {icon ? <div className="stat-icon">{icon}</div> : null}
    </div>
  )
}
