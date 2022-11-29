import React from 'react'
import SettingsTitles from "./SettingsTitles"

export default function EmailsSettings() {
  return (
    <div className="settings-sub-page">
      <SettingsTitles
        label="Emails"
        sublabel="Choose how you send and receive emails."
        icon="fas fa-envelope"
      />
    </div>
  )
}
