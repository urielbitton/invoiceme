import { useUserEstimateSettings } from "app/hooks/userHooks"
import { updateDB } from "app/services/CrudDB"
import { StoreContext } from "app/store/store"
import React, { useContext, useState } from 'react'
import AppButton from "../ui/AppButton"
import { AppTextarea } from "../ui/AppInputs"
import SettingsSection from "./SettingsSection"
import SettingsSectionSwitch from "./SettingsSectionSwitch"
import SettingsTitles from "./SettingsTitles"

export default function EstimatesSettings() {

  const { myUserID, setPageLoading } = useContext(StoreContext)
  const [showMyName, setShowMyName] = useState(true)
  const [showMyAddress, setShowMyAddress] = useState(true)
  const [showMyPhone, setShowMyPhone] = useState(true)
  const [showMyEmail, setShowMyEmail] = useState(false)
  const [showMyLogo, setShowMyLogo] = useState(true)
  const [showMyCompanyName, setShowMyCompanyName] = useState(false)
  const [showDueDate, setShowDueDate] = useState(true)
  const [showClientName, setShowClientName] = useState(true)
  const [showClientAddress, setShowClientAddress] = useState(true)
  const [showClientPhone, setShowClientPhone] = useState(true)
  const [showClientEmail, setShowClientEmail] = useState(false)
  const [showClientCompanyName, setShowClientCompanyName] = useState(false)
  const [showMyTaxNumbers, setShowMyTaxNumbers] = useState(true)
  const [showNotes, setShowNotes] = useState(true)
  const [invoiceNotes, setInvoiceNotes] = useState('')
  const [showThankYouMessage, setShowThankYouMessage] = useState(true)
  const [showInvoiceMeTag, setShowInvoiceMeTag] = useState(true)
  const myUserEstimateSettings = useUserEstimateSettings(myUserID)

  const saveSettings = () => {
    setPageLoading(true)
    updateDB(`users/${myUserID}/settings`, 'estimates', {
      showMyName,
      showMyAddress,
      showMyPhone,
      showMyEmail,
      showMyLogo,
      showMyCompanyName,
      showDueDate,
      showClientName,
      showClientAddress,
      showClientPhone,
      showClientEmail,
      showClientCompanyName,
      showNotes,
      invoiceNotes,
      showThankYouMessage,
      showInvoiceMeTag
    })
      .then(() => {
        setPageLoading(false)
      })
      .catch(err => {
        console.log(err)
        setPageLoading(false)
      })
  }

  return (
    <div className="settings-sub-page">
      <SettingsTitles
        label="Estimates"
        sublabel="Customize your estimate creation experience."
        icon="fas fa-file-invoice"
      />
      <SettingsSectionSwitch
        label="Show my name"
        sublabel="Show my name on estimate headers"
        value={showMyName}
        setValue={setShowMyName}
      />
      <SettingsSectionSwitch
        label="Show my address"
        sublabel="Show my address on estimate headers"
        value={showMyAddress}
        setValue={setShowMyAddress}
      />
      <SettingsSectionSwitch
        label="Show my phone"
        sublabel="Show my phone on estimate headers"
        value={showMyPhone}
        setValue={setShowMyPhone}
      />
      <SettingsSectionSwitch
        label="Show my email"
        sublabel="Show my email on estimate headers"
        value={showMyEmail}
        setValue={setShowMyEmail}
      />
      <SettingsSectionSwitch
        label="Show my logo"
        sublabel="Show my logo on estimate headers"
        value={showMyLogo}
        setValue={setShowMyLogo}
      />
      <SettingsSectionSwitch
        label="Show my company name"
        sublabel="Show my company name on estimate headers"
        value={showMyCompanyName}
        setValue={setShowMyCompanyName}
      />
      <SettingsSectionSwitch
        label="Show due date"
        sublabel="Show due date on estimate headers"
        value={showDueDate}
        setValue={setShowDueDate}
      />
      <SettingsSectionSwitch
        label="Show Tax Numbers"
        sublabel="Show tax numbers on estimate headers"
        value={showMyTaxNumbers}
        setValue={setShowMyTaxNumbers}
      />
      <SettingsSectionSwitch
        label="Show client name"
        sublabel="Show client name on estimates"
        value={showClientName}
        setValue={setShowClientName}
      />
      <SettingsSectionSwitch
        label="Show client address"
        sublabel="Show client address on estimates"
        value={showClientAddress}
        setValue={setShowClientAddress}
      />
      <SettingsSectionSwitch
        label="Show client phone"
        sublabel="Show client phone on estimates"
        value={showClientPhone}
        setValue={setShowClientPhone}
      />
      <SettingsSectionSwitch
        label="Show client email"
        sublabel="Show client email on estimates"
        value={showClientEmail}
        setValue={setShowClientEmail}
      />
      <SettingsSectionSwitch
        label="Show client company name"
        sublabel="Show client company name on estimates"
        value={showClientCompanyName}
        setValue={setShowClientCompanyName}
      />
      <SettingsSectionSwitch
        label="Show notes"
        sublabel="Show notes on estimates"
        value={showNotes}
        setValue={setShowNotes}
      />
      <SettingsSection
        label="Estimate notes"
        sublabel="Add global notes that show up on all estimates"
      >
        <AppTextarea
          value={invoiceNotes}
          onChange={e => setInvoiceNotes(e.target.value)}
        />
      </SettingsSection>
      <SettingsSectionSwitch
        label="Show 'Thank you' message"
        sublabel="Show 'Thank you' message on bottom of estimate"
        value={showThankYouMessage}
        setValue={setShowThankYouMessage}
      />
      <SettingsSectionSwitch
        badge="Business"
        label="Show 'Invoice Me' watermark"
        sublabel="Show 'Invoice Me' watermark on bottom of estimate"
        value={showInvoiceMeTag}
        setValue={setShowInvoiceMeTag}
        businessAccess
      />
      <div className="btn-group">
        <AppButton
          label="Save"
          onClick={saveSettings}
        />
      </div>
    </div>
  )
}
