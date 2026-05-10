export const requestNotificationPermission = async () => {
  if (!('Notification' in window) || Notification.permission !== 'default') return
  await Notification.requestPermission()
}

export const notifyRestComplete = (exerciseName?: string) => {
  if ('vibrate' in navigator) {
    navigator.vibrate([120, 80, 120])
  }

  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Rest complete', {
      body: exerciseName ? `Ready for ${exerciseName}` : 'Time for your next set.',
      silent: false,
    })
  }
}
