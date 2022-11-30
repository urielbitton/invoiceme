import React from 'react'
import SettingsTitles from "./SettingsTitles"

export default function ContactsSettings() {
  return (
    <div className="settings-sub-page">
      <SettingsTitles
        label="Contacts"
        sublabel="Customize your contact creation experience."
        icon="fas fa-users"
      />
    </div>
  )
}
