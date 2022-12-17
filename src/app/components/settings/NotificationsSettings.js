import { monthlyReportOptions, overdueDaysOptions } from "app/data/general"
import { errorToast, infoToast, successToast } from "app/data/toastsTemplates"
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
  const [showInvoicesNotifs, setShowInvoicesNotifs] = useState(true)
  const [showEstimateNotifs, setShowEstimateNotifs] = useState(true)
  const [showContactsNotifs, setShowContactsNotifs] = useState(true)
  const [showSmsNotifs, setShowSmsNotifs] = useState(true)
  const [showPaymentsNotifs, setShowPaymentsNotifs] = useState(true)
  const [showScheduleNotifs, setShowScheduleNotifs] = useState(false)
  const [overdueDays, setOverdueDays] = useState(2)
  const [monthlyReports, setMonthlyReports] = useState('none')
  const isBusiness = myMemberType === 'business'
  const myUserNotifSettings = useUserNotifSettings(myUserID)

  const allowSave = myUserNotifSettings?.showInvoicesNotifs !== showInvoicesNotifs ||
    myUserNotifSettings?.showEstimateNotifs !== showEstimateNotifs ||
    myUserNotifSettings?.showContactsNotifs !== showContactsNotifs ||
    myUserNotifSettings?.showSmsNotifs !== showSmsNotifs ||
    myUserNotifSettings?.showPaymentsNotifs !== showPaymentsNotifs ||
    myUserNotifSettings?.showScheduleNotifs !== showScheduleNotifs ||
    myUserNotifSettings?.overdueDays !== overdueDays ||
    myUserNotifSettings?.monthlyReports !== monthlyReports

  const saveSettings = () => {
    setPageLoading(true)
    updateDB(`users/${myUserID}/settings`, 'notifications', {
      showInvoicesNotifs,
      showEstimateNotifs,
      showContactsNotifs,
      showSmsNotifs,
      showPaymentsNotifs,
      showScheduleNotifs,
      overdueDays,
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
      setShowInvoicesNotifs(myUserNotifSettings?.showInvoicesNotifs ?? true)
      setShowEstimateNotifs(myUserNotifSettings?.showEstimateNotifs ?? true)
      setShowContactsNotifs(myUserNotifSettings?.showContactsNotifs ?? true)
      setShowSmsNotifs(myUserNotifSettings?.showSmsNotifs ?? true)
      setShowPaymentsNotifs(myUserNotifSettings?.showPaymentsNotifs ?? true)
      setShowScheduleNotifs(myUserNotifSettings?.showScheduleNotifs ?? false)
      setOverdueDays(myUserNotifSettings?.overdueDays ?? 2)
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
        label="Show invoices notifications"
        sublabel="Show notifications when an invoice is created, sent, paid, or overdue."
        value={showInvoicesNotifs}
        setValue={setShowInvoicesNotifs}
        className="showInvoiceNotifs"
      />
      <SettingsSectionSwitch
        label="Show estimates notifications"
        sublabel="Show notifications when an estimate is created or sent."
        value={showEstimateNotifs}
        setValue={setShowEstimateNotifs}
        className="showEstimateNotifs"
      />
      <SettingsSectionSwitch
        label="Show contacts notifications"
        sublabel="Show notifications when a contact is created or deleted."
        value={showContactsNotifs}
        setValue={setShowContactsNotifs}
        className="showContactNotifs"
      />
      <SettingsSectionSwitch
        label="Show SMS notifications"
        sublabel="Show notifications when an SMS is sent."
        value={showSmsNotifs}
        setValue={setShowSmsNotifs}
        className="showSmsNotifs"
      />
      <SettingsSectionSwitch
        label="Show payments notifications"
        sublabel="Show notifications when a payment is received or sent."
        value={showPaymentsNotifs}
        setValue={setShowPaymentsNotifs}
        className="showPaymentNotifs"
      />
      <SettingsSectionSwitch  
        label="Show scheduled invoices notifications"
        sublabel="Show notifications before a scheduled invoice is about to be sent, after it was sent and on creation."
        value={showScheduleNotifs}
        setValue={setShowScheduleNotifs}
        className="showScheduledInvoiceNotifs"
      />
      <SettingsSection
        label="Show overdue invoices notifications"
        sublabel="Show notifications when an invoice is overdue by how many days?"
        flexStart
        className="showOverdueInvoiceNotifs"
      >
        <AppSelect
          options={overdueDaysOptions}
          value={overdueDays}
          onChange={(e) => setOverdueDays(e.target.value)}
        />
      </SettingsSection>
      <SettingsSection
        label="Create monthly reports"
        sublabel="Save a brief or full monthly reports to your profile and get notified"
        flexStart
        badge="Business"
        className="showMonthlyReportNotifs"
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
