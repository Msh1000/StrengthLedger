import type { HTMLAttributes, PropsWithChildren } from 'react'

interface GlassCardProps extends PropsWithChildren, HTMLAttributes<HTMLDivElement> {
  className?: string
  glow?: boolean
}

export function GlassCard({ children, className = '', glow = false, ...props }: GlassCardProps) {
  return (
    <div className={`glass-card ${glow ? 'glow-card' : ''} ${className}`} {...props}>
      {children}
    </div>
  )
}
