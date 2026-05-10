import { ChevronLeft, MoreVertical, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface TopBarProps {
  title: string
  back?: boolean
  menu?: boolean
}

export function TopBar({ title, back = false, menu = false }: TopBarProps) {
  const navigate = useNavigate()
  return (
    <header className="top-bar">
      <button className="icon-button" type="button" onClick={() => (back ? navigate(-1) : undefined)} aria-label="Back">
        {back ? <ChevronLeft size={23} /> : <span className="status-time">9:41</span>}
      </button>
      <h1>{title}</h1>
      <button className="icon-button" type="button" onClick={() => navigate('/settings')} aria-label="Settings">
        {menu ? <MoreVertical size={22} /> : <Settings size={21} />}
      </button>
    </header>
  )
}
