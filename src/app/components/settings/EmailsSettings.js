import { monthlyReportOptions } from "app/data/general"
import { infoToast } from "app/data/toastsTemplates"
import { updateDB } from "app/services/CrudDB"
import { StoreContext } from "app/store/store"
import React, { useContext, useState } from 'react'
import AppButton from "../ui/AppButton"
import { AppSelect } from "../ui/AppInputs"
import SettingsSection from "./SettingsSection"
import SettingsSectionSwitch from "./SettingsSectionSwitch"
import SettingsTitles from "./SettingsTitles"

export default function EmailsSettings() {

  const { myMemberType, myUserID, setToasts } = useContext(StoreContext)
  const [monthlyReports, setMonthlyReports] = useState('none')
  const [unpaidInvoicesEmail, setUnpaidInvoicesEmail] = useState(false)
  const [smsInvoiceNotifs, setSmsInvoiceNotifs] = useState(false)
  const isBusiness = myMemberType === 'business'

  const saveSettings = () => {
    updateDB(`users/${myUserID}/settings`, 'emails', {
      monthlyReports
    })
  }

  return (
    <div className="settings-sub-page">
      <SettingsTitles
        label="Emails & SMS"
        sublabel="Choose how you send and receive emails and SMS."
        icon="fas fa-mail-bulk"
      />
      <SettingsSectionSwitch
        label="Send me unpaid status emails"
        sublabel="Send me monthl emails of all unpaid invoices."
        value={unpaidInvoicesEmail}
        setValue={setUnpaidInvoicesEmail}
        className="sendUnpaidStatusEmails"
        badge="Business"
        businessAccess
      />
      <SettingsSectionSwitch
        label="Send SMS invoice notifications"
        sublabel="Send me SMS notifications when I receive a new invoice."
        value={smsInvoiceNotifs}
        setValue={setSmsInvoiceNotifs}
        className="sendSmsInvoiceNotifs"
        badge="Business"
        businessAccess
      />
      <SettingsSection
        label="Send monthly reports"
        sublabel="Send me monthly reports about my invoices to my email address."
        flexStart
        badge="Business"
        businessAccess
        className="sendMonthlyReportEmails"
      >
        <AppSelect
          options={monthlyReportOptions}
          value={monthlyReports}
          onChange={(e) => {
            isBusiness ? 
            setMonthlyReports(e.target.value) : 
            setToasts(infoToast('You need to be a business member to turn on this feature.'))
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
