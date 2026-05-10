import { MoreVertical, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface TopBarProps {
  title: string
  /** @deprecated Back navigation is intentionally removed from main screens; use bottom nav instead. */
  back?: boolean
  menu?: boolean
}

export function TopBar({ title, menu = false }: TopBarProps) {
  const navigate = useNavigate()
  return (
    <header className="top-bar">
      <span className="top-bar-spacer" aria-hidden="true" />
      <h1>{title}</h1>
      <button className="icon-button" type="button" onClick={() => navigate('/settings')} aria-label="Settings">
        {menu ? <MoreVertical size={22} /> : <Settings size={21} />}
      </button>
    </header>
  )
}
