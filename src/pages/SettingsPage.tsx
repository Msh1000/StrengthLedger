import { Download, Trash2, Upload } from 'lucide-react'
import { TopBar } from '../components/layout/TopBar'
import { GlassCard } from '../components/ui/GlassCard'
import { useAppStore } from '../store/useAppStore'

export function SettingsPage() {
  const settings = useAppStore((state) => state.settings)
  const updateSettings = useAppStore((state) => state.updateSettings)
  const workouts = useAppStore((state) => state.workouts)
  const exercises = useAppStore((state) => state.exercises)

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ workouts, exercises, settings }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'strengthlog-export.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="screen">
      <TopBar title="Settings" back />
      <GlassCard className="settings-card">
        <span className="settings-label">Preferences</span>
        <SettingRow label="Units" value={settings.units === 'metric' ? 'Metric (kg)' : 'Imperial (lb)'} onClick={() => void updateSettings({ units: settings.units === 'metric' ? 'imperial' : 'metric' })} />
        <SettingRow label="Default Rest Time" value={`${settings.defaultRestSeconds} sec`} onClick={() => void updateSettings({ defaultRestSeconds: settings.defaultRestSeconds === 120 ? 90 : 120 })} />
        <SwitchRow label="Auto Start Rest Timer" checked={settings.autoStartRest} onChange={(checked) => void updateSettings({ autoStartRest: checked })} />
        <SwitchRow label="Include Bodyweight in Volume" checked={settings.includeBodyweight} onChange={(checked) => void updateSettings({ includeBodyweight: checked })} />
        <SwitchRow label="Vibration" checked={settings.vibration} onChange={(checked) => void updateSettings({ vibration: checked })} />
        <SwitchRow label="Sound" checked={settings.sound} onChange={(checked) => void updateSettings({ sound: checked })} />
        <SettingRow label="Dark Mode" value={settings.darkMode ? 'On' : 'Off'} onClick={() => void updateSettings({ darkMode: !settings.darkMode })} />
      </GlassCard>

      <GlassCard className="settings-card">
        <span className="settings-label">Data</span>
        <button className="settings-row" type="button" onClick={exportData}>
          <span>Export Data</span>
          <Download size={18} />
        </button>
        <label className="settings-row import-row">
          <span>Import Data</span>
          <Upload size={18} />
          <input type="file" accept="application/json" />
        </label>
        <button className="settings-row danger-text" type="button">
          <span>Clear All Data</span>
          <Trash2 size={18} />
        </button>
      </GlassCard>
    </div>
  )
}

function SettingRow({ label, value, onClick }: { label: string; value: string; onClick: () => void }) {
  return (
    <button className="settings-row" type="button" onClick={onClick}>
      <span>{label}</span>
      <strong>{value}</strong>
    </button>
  )
}

function SwitchRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="settings-row">
      <span>{label}</span>
      <input className="switch" type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </label>
  )
}
