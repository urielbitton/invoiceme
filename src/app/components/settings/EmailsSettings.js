import { monthlyReportOptions } from "app/data/general"
import { errorToast, infoToast, successToast } from "app/data/toastsTemplates"
import { useUserEmailSettings } from "app/hooks/userHooks"
import { updateDB } from "app/services/CrudDB"
import { StoreContext } from "app/store/store"
import { isEmptyObject } from "app/utils/generalUtils"
import React, { useContext, useEffect, useState } from 'react'
import AppButton from "../ui/AppButton"
import { AppSelect } from "../ui/AppInputs"
import SettingsSection from "./SettingsSection"
import SettingsSectionSwitch from "./SettingsSectionSwitch"
import SettingsTitles from "./SettingsTitles"

export default function EmailsSettings() {

  const { myMemberType, myUserID, setToasts, setPageLoading } = useContext(StoreContext)
  const [monthlyReports, setMonthlyReports] = useState('none')
  const [unpaidInvoicesEmail, setUnpaidInvoicesEmail] = useState(false)
  const [emailInvoiceNotifs, setEmailInvoiceNotifs] = useState(false)
  const [smsInvoiceNotifs, setSmsInvoiceNotifs] = useState(false)
  const isBusiness = myMemberType === 'business'
  const myUserEmailsSettings = useUserEmailSettings(myUserID)

  const allowSave = myUserEmailsSettings?.monthlyReports !== monthlyReports ||
    myUserEmailsSettings?.unpaidInvoicesEmail !== unpaidInvoicesEmail ||
    myUserEmailsSettings?.emailInvoiceNotifs !== emailInvoiceNotifs ||
    myUserEmailsSettings?.smsInvoiceNotifs !== smsInvoiceNotifs

  const saveSettings = () => {
    setPageLoading(true)
    updateDB(`users/${myUserID}/settings`, 'emails', {
      monthlyReports,
      unpaidInvoicesEmail,
      emailInvoiceNotifs,
      smsInvoiceNotifs
    })
    .then(() => {
      setPageLoading(false)
      setToasts(successToast('Settings saved successfully.'))
    })
    .catch(err => {
      console.log(err)
      setPageLoading(false)
      setToasts(errorToast('There was an error while saving your settings. Please try again.'))
    })
  }

  useEffect(() => {
    if (!isEmptyObject(myUserEmailsSettings)) {
      setMonthlyReports(myUserEmailsSettings?.monthlyReports ?? 'none')
      setUnpaidInvoicesEmail(myUserEmailsSettings?.unpaidInvoicesEmail ?? false)
      setEmailInvoiceNotifs(myUserEmailsSettings?.emailInvoiceNotifs ?? false)
      setSmsInvoiceNotifs(myUserEmailsSettings?.smsInvoiceNotifs ?? false)
    }
  },[myUserEmailsSettings])

  return (
    <div className="settings-sub-page">
      <SettingsTitles
        label="Emails & SMS"
        sublabel="Choose how you send and receive emails and SMS."
        icon="fas fa-mail-bulk"
        button={
          <AppButton
            label="Save Settings"
            onClick={saveSettings}
            disabled={!allowSave}
          />
        }
      />
      <SettingsSectionSwitch
        label="Send me unpaid status emails"
        sublabel="Send me monthly emails of all unpaid invoices."
        value={unpaidInvoicesEmail}
        setValue={setUnpaidInvoicesEmail}
        className="sendUnpaidStatusEmails"
        badge="Business"
        businessAccess
      />
      <SettingsSectionSwitch
        label="Send email invoice notifications"
        sublabel="Send me an email when I receive a new invoice."
        value={emailInvoiceNotifs}
        setValue={setEmailInvoiceNotifs}
        className="sendEmailInvoiceNotifs"
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
    </div>
  )
}
