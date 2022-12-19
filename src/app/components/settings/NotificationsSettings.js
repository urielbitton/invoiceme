import { errorToast, successToast } from "app/data/toastsTemplates"
import { useUserNotifSettings } from "app/hooks/userHooks"
import { updateDB } from "app/services/CrudDB"
import { StoreContext } from "app/store/store"
import { isEmptyObject } from "app/utils/generalUtils"
import React, { useContext, useEffect, useState } from 'react'
import AppButton from "../ui/AppButton"
import { AppSelect } from "../ui/AppInputs"
import SettingsSection from "./SettingsSection"
import SettingsSectionSwitch from "./SettingsSectionSwitch"
import SettingsTitles from "./SettingsTitles"

export default function NotificationsSettings() {

  const { myMemberType, myUserID, setToasts, setPageLoading } = useContext(StoreContext)
  const [showOutgoingInvoicesNotifs, setShowOutgoingInvoicesNotifs] = useState(true)
  const [showOutgoingEstimateNotifs, setShowOutgoingEstimateNotifs] = useState(true)
  const [showIncomingInvoicesNotifs, setShowIncomingInvoicesNotifs] = useState(true)
  const [showIncomingEstimateNotifs, setShowIncomingEstimateNotifs] = useState(true)
  const [showContactsNotifs, setShowContactsNotifs] = useState(true)
  const [showSmsNotifs, setShowSmsNotifs] = useState(true)
  const [showPaymentsNotifs, setShowPaymentsNotifs] = useState(true)
  const [showScheduleNotifs, setShowScheduleNotifs] = useState(false)
  const [overdueNotifs, setOverdueNotifs] = useState(true)
  const [monthlyReports, setMonthlyReports] = useState('none')
  const isBusiness = myMemberType === 'business'
  const myUserNotifSettings = useUserNotifSettings(myUserID)

  const allowSave = myUserNotifSettings?.showOutgoingInvoicesNotifs !== showOutgoingInvoicesNotifs ||
    myUserNotifSettings?.showOutgoingEstimateNotifs !== showOutgoingEstimateNotifs ||
    myUserNotifSettings?.showIncomingInvoicesNotifs !== showIncomingInvoicesNotifs ||
    myUserNotifSettings?.showIncomingEstimateNotifs !== showIncomingEstimateNotifs ||
    myUserNotifSettings?.showContactsNotifs !== showContactsNotifs ||
    myUserNotifSettings?.showSmsNotifs !== showSmsNotifs ||
    myUserNotifSettings?.showPaymentsNotifs !== showPaymentsNotifs ||
    myUserNotifSettings?.showScheduleNotifs !== showScheduleNotifs ||
    myUserNotifSettings?.overdueNotifs !== overdueNotifs ||
    myUserNotifSettings?.monthlyReports !== monthlyReports

  const saveSettings = () => {
    setPageLoading(true)
    updateDB(`users/${myUserID}/settings`, 'notifications', {
      showOutgoingInvoicesNotifs,
      showOutgoingEstimateNotifs,
      showIncomingInvoicesNotifs,
      showIncomingEstimateNotifs,
      showContactsNotifs,
      showSmsNotifs,
      showPaymentsNotifs,
      showScheduleNotifs,
      overdueNotifs,
      monthlyReports
    })
    .then(() => {
      setPageLoading(false)
      setToasts(successToast('Your settings have been saved.'))
    })
    .catch(err => {
      console.log(err)
      setPageLoading(false)
      setToasts(errorToast('There was an error while saving your settings. Please try again.'))
    })
  }

  useEffect(() => {
    if (!isEmptyObject(myUserNotifSettings)) {
      setShowOutgoingInvoicesNotifs(myUserNotifSettings?.showOutgoingInvoicesNotifs ?? true)
      setShowOutgoingEstimateNotifs(myUserNotifSettings?.showOutgoingEstimateNotifs ?? true)
      setShowIncomingInvoicesNotifs(myUserNotifSettings?.showIncomingInvoicesNotifs ?? true)
      setShowIncomingEstimateNotifs(myUserNotifSettings?.showIncomingEstimateNotifs ?? true)
      setShowContactsNotifs(myUserNotifSettings?.showContactsNotifs ?? true)
      setShowSmsNotifs(myUserNotifSettings?.showSmsNotifs ?? true)
      setShowPaymentsNotifs(myUserNotifSettings?.showPaymentsNotifs ?? true)
      setShowScheduleNotifs(myUserNotifSettings?.showScheduleNotifs ?? false)
      setOverdueNotifs(myUserNotifSettings?.overdueNotifs ?? 2)
      setMonthlyReports(myUserNotifSettings?.monthlyReports ?? 'none')
    }
  },[myUserNotifSettings])

  return (
    <div className="settings-sub-page">
      <SettingsTitles
        label="Notifications"
        sublabel="Choose how you see and receive notifications on the app."
        icon="fas fa-bell"
        button={
          <AppButton
            label="Save Settings"
            onClick={saveSettings}
            disabled={!allowSave}
          />
        }
      />
      <SettingsSectionSwitch
        label="Outgoing invoices notifications"
        sublabel="Show notifications when an invoice is created, sent, paid, or overdue."
        value={showOutgoingInvoicesNotifs}
        setValue={setShowOutgoingInvoicesNotifs}
        className="showOutgoingInvoiceNotifs"
      />
      <SettingsSectionSwitch
        label="Outgoing estimates notifications"
        sublabel="Show notifications when an estimate is created or sent."
        value={showOutgoingEstimateNotifs}
        setValue={setShowOutgoingEstimateNotifs}
        className="showOutgoingEstimateNotifs"
      />
      <SettingsSectionSwitch
        label="Incoming invoices notifications"
        sublabel="Show notifications when i receive an invoice."
        value={showIncomingInvoicesNotifs}
        setValue={setShowIncomingInvoicesNotifs}
        className="showIncomingInvoiceNotifs"
      /> 
      <SettingsSectionSwitch
        label="Incoming estimates notifications"
        sublabel="Show notifications when i receive an estimate."
        value={showIncomingEstimateNotifs}
        setValue={setShowIncomingEstimateNotifs}
        className="showIncomingEstimateNotifs"
      />
      <SettingsSectionSwitch
        label="Contacts notifications"
        sublabel="Show notifications when a contact is created or deleted."
        value={showContactsNotifs}
        setValue={setShowContactsNotifs}
        className="showContactNotifs"
      />
      <SettingsSectionSwitch
        label="SMS notifications"
        sublabel="Show notifications when an SMS is sent."
        value={showSmsNotifs}
        setValue={setShowSmsNotifs}
        className="showSmsNotifs"
      />
      <SettingsSectionSwitch
        label="Payments notifications"
        sublabel="Show notifications when a payment is received or sent."
        value={showPaymentsNotifs}
        setValue={setShowPaymentsNotifs}
        className="showPaymentNotifs"
      />
      <SettingsSectionSwitch  
        label="Scheduled invoices notifications"
        sublabel="Show notifications before a scheduled invoice is about to be sent, after it was sent and on creation."
        value={showScheduleNotifs}
        setValue={setShowScheduleNotifs}
        className="showScheduledInvoiceNotifs"
      />
      <SettingsSectionSwitch  
        label="Overdue invoices notifications"
        sublabel="Send me a notification when an invoice i sent is overdue."
        value={overdueNotifs}
        setValue={setOverdueNotifs}
        className="showScheduledInvoiceNotifs"
      />
      <SettingsSection
        label="Monthly reports notifications"
        sublabel="Save a brief or full monthly reports to your profile and get notified"
        flexStart
        badge="Business"
        className="showMonthlyReportNotifs"
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
