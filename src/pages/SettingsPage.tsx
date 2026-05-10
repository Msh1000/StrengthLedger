import { Bell, Download, Palette, Trash2, Upload } from 'lucide-react'
import { TopBar } from '../components/layout/TopBar'
import { GlassCard } from '../components/ui/GlassCard'
import { useAppStore } from '../store/useAppStore'
import { requestNotificationPermission } from '../utils/notifications'
import type { ColorTheme } from '../types'

const QUICK_REST_OPTIONS = [30, 45, 60, 90, 120, 150, 180, 240, 300]

const COLOR_THEMES: { id: ColorTheme; label: string }[] = [
  { id: 'purple', label: 'Purple' },
  { id: 'blue', label: 'Blue' },
  { id: 'green', label: 'Green' },
  { id: 'orange', label: 'Orange' },
  { id: 'red', label: 'Red' },
]

export function SettingsPage() {
  const settings = useAppStore((state) => state.settings)
  const updateSettings = useAppStore((state) => state.updateSettings)
  const workouts = useAppStore((state) => state.workouts)
  const exercises = useAppStore((state) => state.exercises)
  const routines = useAppStore((state) => state.routines)
  const resetAllData = useAppStore((state) => state.resetAllData)

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ workouts, exercises, routines, settings }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'strengthledger-export.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleClearData = async () => {
    if (!confirm('Clear ALL data? This will permanently delete all workouts, routines, and settings. This cannot be undone.')) return
    await resetAllData()
  }

  const handleRequestNotifications = async () => {
    const result = await requestNotificationPermission()
    if (result === 'granted') {
      await updateSettings({ notifications: true })
    }
  }

  return (
    <div className="screen">
      <TopBar title="Settings" />

      <GlassCard className="settings-card">
        <span className="settings-label">Appearance</span>
        <SettingRow
          label="Dark Mode"
          value={settings.darkMode ? 'On' : 'Off'}
          onClick={() => void updateSettings({ darkMode: !settings.darkMode })}
        />
        <div className="settings-row settings-theme-row">
          <span><Palette size={16} /> Colour Theme</span>
          <div className="theme-chips">
            {COLOR_THEMES.map((theme) => (
              <button
                key={theme.id}
                type="button"
                className={`theme-chip theme-chip-${theme.id} ${settings.colorTheme === theme.id ? 'active' : ''}`}
                onClick={() => void updateSettings({ colorTheme: theme.id })}
                aria-label={theme.label}
                title={theme.label}
              />
            ))}
          </div>
        </div>
      </GlassCard>

      <GlassCard className="settings-card">
        <span className="settings-label">Training Preferences</span>
        <SettingRow
          label="Units"
          value={settings.units === 'metric' ? 'Metric (kg)' : 'Imperial (lb)'}
          onClick={() => void updateSettings({ units: settings.units === 'metric' ? 'imperial' : 'metric' })}
        />
        <div className="settings-row settings-rest-row">
          <span>Default Rest Time</span>
          <div className="chip-scroll">
            {QUICK_REST_OPTIONS.map((seconds) => (
              <button
                key={seconds}
                type="button"
                className={`filter-chip ${settings.defaultRestSeconds === seconds ? 'active' : ''}`}
                onClick={() => void updateSettings({ defaultRestSeconds: seconds })}
              >
                {seconds}s
              </button>
            ))}
          </div>
        </div>
        <SwitchRow
          label="Auto-Start Rest Timer"
          checked={settings.autoStartRest}
          onChange={(checked) => void updateSettings({ autoStartRest: checked })}
        />
        <SwitchRow
          label="Include Bodyweight in Volume"
          checked={settings.includeBodyweight}
          onChange={(checked) => void updateSettings({ includeBodyweight: checked })}
        />
      </GlassCard>

      <GlassCard className="settings-card">
        <span className="settings-label">Sound & Alerts</span>
        <SwitchRow
          label="Sound on Rest Complete"
          checked={settings.sound}
          onChange={(checked) => void updateSettings({ sound: checked })}
        />
        <SwitchRow
          label="Vibration on Rest Complete"
          checked={settings.vibration}
          onChange={(checked) => void updateSettings({ vibration: checked })}
        />
        <div className="settings-row">
          <span><Bell size={16} /> Notifications</span>
          {settings.notifications ? (
            <SwitchValue checked={settings.notifications} onChange={(checked) => void updateSettings({ notifications: checked })} />
          ) : (
            <button className="filter-chip active" type="button" onClick={() => void handleRequestNotifications()}>
              Enable
            </button>
          )}
        </div>
      </GlassCard>

      <GlassCard className="settings-card">
        <span className="settings-label">Data</span>
        <button className="settings-row" type="button" onClick={exportData}>
          <span><Download size={16} /> Export Data</span>
        </button>
        <label className="settings-row import-row" style={{ cursor: 'pointer' }}>
          <span><Upload size={16} /> Import Data</span>
          <input type="file" accept="application/json" style={{ display: 'none' }} />
        </label>
        <button className="settings-row danger-text" type="button" onClick={() => void handleClearData()}>
          <span><Trash2 size={16} /> Clear All Data</span>
        </button>
      </GlassCard>

      <p className="fine-print" style={{ textAlign: 'center', marginTop: 24 }}>StrengthLedger v1.0</p>
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
      <SwitchValue checked={checked} onChange={onChange} />
    </label>
  )
}

function SwitchValue({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <input className="switch" type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
  )
}
