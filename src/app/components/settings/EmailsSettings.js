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
  const [unpaidInvoicesEmail, setUnpaidInvoicesEmail] = useState(true)
  const [emailInvoiceNotifs, setEmailInvoiceNotifs] = useState(true)
  const [emailEstimateNotifs, setEmailEstimateNotifs] = useState(false)
  const [smsInvoiceNotifs, setSmsInvoiceNotifs] = useState(false)
  const [emailPaymentsNotifs, setEmailPaymentsNotifs] = useState(true)
  const isBusiness = myMemberType === 'business'
  const myUserEmailsSettings = useUserEmailSettings(myUserID)

  const allowSave = myUserEmailsSettings?.monthlyReports !== monthlyReports ||
    myUserEmailsSettings?.unpaidInvoicesEmail !== unpaidInvoicesEmail ||
    myUserEmailsSettings?.emailInvoiceNotifs !== emailInvoiceNotifs ||
    myUserEmailsSettings?.emailEstimateNotifs !== emailEstimateNotifs ||
    myUserEmailsSettings?.emailPaymentsNotifs !== emailPaymentsNotifs ||
    myUserEmailsSettings?.smsInvoiceNotifs !== smsInvoiceNotifs

  const saveSettings = () => {
    setPageLoading(true)
    updateDB(`users/${myUserID}/settings`, 'emails', {
      monthlyReports,
      unpaidInvoicesEmail,
      emailInvoiceNotifs,
      emailEstimateNotifs,
      smsInvoiceNotifs,
      emailPaymentsNotifs
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
      setUnpaidInvoicesEmail(myUserEmailsSettings?.unpaidInvoicesEmail ?? true)
      setEmailInvoiceNotifs(myUserEmailsSettings?.emailInvoiceNotifs ?? true)
      setEmailEstimateNotifs(myUserEmailsSettings?.emailEstimateNotifs ?? false)
      setSmsInvoiceNotifs(myUserEmailsSettings?.smsInvoiceNotifs ?? false)
      setEmailPaymentsNotifs(myUserEmailsSettings?.emailPaymentsNotifs ?? true)
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
        label="New invoice email"
        sublabel="Send me an email when I receive a new invoice."
        value={emailInvoiceNotifs}
        setValue={setEmailInvoiceNotifs}
        className="newInvoiceEmail"
        badge="Business"
        businessAccess
      />
      <SettingsSectionSwitch
        label="New estimate email"
        sublabel="Send me an email when I receive a new estimate."
        value={emailEstimateNotifs}
        setValue={setEmailEstimateNotifs}
        className="newEstimateEmail"
        badge="Business"
        businessAccess
      />
      <SettingsSectionSwitch
        label="Payment received email"
        sublabel="Send me an email when I receive a payment"
        value={emailPaymentsNotifs}
        setValue={setEmailPaymentsNotifs}
        className="newPaymentEmail"
        badge="Business"
        businessAccess
      />
      <SettingsSectionSwitch
        label="Overdue invoices emails"
        sublabel="Send me emails of any unpaid invoices."
        value={unpaidInvoicesEmail}
        setValue={setUnpaidInvoicesEmail}
        className="unpaidInvoicesEmails"
        badge="Business"
        businessAccess
      />
      <SettingsSectionSwitch
        label="SMS invoice notifications"
        sublabel="Send me SMS notifications when I receive a new invoice."
        value={smsInvoiceNotifs}
        setValue={setSmsInvoiceNotifs}
        className="newInvoiceSMS"
        badge="Business"
        businessAccess
      />
      <SettingsSection
        label="Monthly reports email"
        sublabel="Send me monthly reports about my invoices to my email address."
        flexStart
        badge="Business"
        businessAccess
        className="sendMonthlyReportEmails"
      >
        {/* <AppSelect
          options={monthlyReportOptions}
          value={monthlyReports}
          onChange={(e) => {
            isBusiness ? 
            setMonthlyReports(e.target.value) : 
            setToasts(infoToast('You need to be a business member to turn on this feature.'))
          }}
        /> */}
        <h5>Coming soon.</h5>
      </SettingsSection>
    </div>
  )
}
