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
  const [showNotifications, setShowNotifications] = useState(true)
  const [showInvoicesNotifs, setShowInvoicesNotifs] = useState(true)
  const [showEstimateNotifs, setShowEstimateNotifs] = useState(true)
  const [showPaymentsNotifs, setShowPaymentsNotifs] = useState(true)
  const [showScheduleNotifs, setShowScheduleNotifs] = useState(true)
  const [overdueDays, setOverdueDays] = useState(2)
  const [monthlyReports, setMonthlyReports] = useState('none')
  const isBusiness = myMemberType === 'business'
  const myUserNotifSettings = useUserNotifSettings(myUserID)

  const allowSave = myUserNotifSettings?.showNotifications !== showNotifications ||
    myUserNotifSettings?.showInvoicesNotifs !== showInvoicesNotifs ||
    myUserNotifSettings?.showEstimateNotifs !== showEstimateNotifs ||
    myUserNotifSettings?.showPaymentsNotifs !== showPaymentsNotifs ||
    myUserNotifSettings?.showScheduleNotifs !== showScheduleNotifs ||
    myUserNotifSettings?.overdueDays !== overdueDays ||
    myUserNotifSettings?.monthlyReports !== monthlyReports

  const saveSettings = () => {
    setPageLoading(true)
    updateDB(`users/${myUserID}/settings`, 'notifications', {
      showNotifications,
      showInvoicesNotifs,
      showEstimateNotifs,
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
      setShowNotifications(myUserNotifSettings?.showNotifications || true)  
      setShowInvoicesNotifs(myUserNotifSettings?.showInvoicesNotifs || true)
      setShowEstimateNotifs(myUserNotifSettings?.showEstimateNotifs || true)
      setShowPaymentsNotifs(myUserNotifSettings?.showPaymentsNotifs || true)
      setShowScheduleNotifs(myUserNotifSettings?.showScheduleNotifs || true)
      setOverdueDays(myUserNotifSettings?.overdueDays)
      setMonthlyReports(myUserNotifSettings?.monthlyReports)
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
        label="Show popup notifications"
        value={showNotifications}
        setValue={setShowNotifications}
        className="showPopUpNotifs"
      />
      <SettingsSectionSwitch
        label="Show invoices notifications"
        value={showInvoicesNotifs}
        setValue={setShowInvoicesNotifs}
        className="showInvoiceNotifs"
      />
      <SettingsSectionSwitch
        label="Show estimates notifications"
        value={showEstimateNotifs}
        setValue={setShowEstimateNotifs}
        className="showEstimateNotifs"
      />
      <SettingsSectionSwitch
        label="Show payments notifications"
        value={showPaymentsNotifs}
        setValue={setShowPaymentsNotifs}
        className="showPaymentNotifs"
      />
      <SettingsSectionSwitch  
        label="Show scheduled invoices notifications"
        sublabel="Show notifications before a scheduled invoice is about to be sent and after it was sent."
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
