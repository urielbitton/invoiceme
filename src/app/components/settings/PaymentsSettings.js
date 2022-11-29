import React from 'react'
import SettingsTitles from "./SettingsTitles"

export default function PaymentsSettings() {
  return (
    <div className="settings-sub-page">
      <SettingsTitles
        label="Payments"
        sublabel="Manage and choose your payment options."
        icon="fas fa-credit-card"
      />
    </div>
  )
}
