import React from 'react'
import SettingsTitles from "./SettingsTitles"

export default function EstimatesSettings() {
  return (
    <div className="settings-sub-page">
      <SettingsTitles
        label="Estimates"
        sublabel="Customize your estimate creation experience."
        icon="fas fa-file-invoice"
      />
    </div>
  )
}
