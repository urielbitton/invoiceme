import React from 'react'
import SettingsTitles from "./SettingsTitles"

export default function NotificationsSettings() {
  return (
    <div className="settings-sub-page">
      <SettingsTitles
        label="Notifications"
        sublabel="Choose how you see and receive notifications on the app."
        icon="fas fa-bell"
      />
    </div>
  )
}
