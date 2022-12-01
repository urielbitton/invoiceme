import { monthlyReportOptions } from "app/data/general"
import { updateDB } from "app/services/CrudDB"
import { StoreContext } from "app/store/store"
import React, { useContext, useState } from 'react'
import AppButton from "../ui/AppButton"
import { AppSelect } from "../ui/AppInputs"
import SettingsSection from "./SettingsSection"
import SettingsTitles from "./SettingsTitles"

export default function EmailsSettings() {

  const { myMemberType, myUserID } = useContext(StoreContext)
  const [monthlyReports, setMonthlyReports] = useState('none')
  const isBusiness = myMemberType === 'business'

  const saveSettings = () => {
    updateDB(`users/${myUserID}/settings`, 'emails', {
      monthlyReports
    })
  }

  return (
    <div className="settings-sub-page">
      <SettingsTitles
        label="Emails"
        sublabel="Choose how you send and receive emails."
        icon="fas fa-envelope"
      />
      <SettingsSection
        label="Send monthly reports"
        sublabel="Send me monthly reports about my invoices to my email address."
        flexStart
        badge="Business"
      >
        <AppSelect
          options={monthlyReportOptions}
          value={monthlyReports}
          onChange={(e) => {
            isBusiness ? 
            setMonthlyReports(e.target.value) : 
            alert('You need to be a business member to turn on this feature.')
          }}
        />
      </SettingsSection>
      <div className="btn-group">
        <AppButton
          label="Save"
          onClick={saveSettings}
        />
      </div>
    </div>
  )
}
