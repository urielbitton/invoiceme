import React, { useState } from 'react'
import AppButton from "../ui/AppButton"
import { AppInput, AppSwitch, AppTextarea } from "../ui/AppInputs"
import SettingsSection from "./SettingsSection"
import SettingsSectionSwitch from "./SettingsSectionSwitch"
import SettingsTitles from "./SettingsTitles"

export default function InvoicesSettings() {

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
  const [taxRate1, setTaxRate1] = useState(0)
  const [taxRate2, setTaxRate2] = useState(0)
  const [taxRateName1, setTaxRateName1] = useState('')
  const [taxRateName2, setTaxRateName2] = useState('')
  const [taxNumber1, setTaxNumber1] = useState('')
  const [taxNumber2, setTaxNumber2] = useState('')

  const saveSettings = () => {

  }

  return (
    <div className="settings-sub-page">
      <SettingsTitles
        label="Invoices"
        sublabel="Customize your invoice creation experience."
        icon="fas fa-file-invoice-dollar"
      />
      <SettingsSectionSwitch
        label="Show my name"
        sublabel="Show my name on invoice headers"
        value={showMyName}
        setValue={setShowMyName}
      />
      <SettingsSectionSwitch
        label="Show my address"
        sublabel="Show my address on invoice headers"
        value={showMyAddress}
        setValue={setShowMyAddress}
      />
      <SettingsSectionSwitch
        label="Show my phone"
        sublabel="Show my phone on invoice headers"
        value={showMyPhone}
        setValue={setShowMyPhone}
      />
      <SettingsSectionSwitch
        label="Show my email"
        sublabel="Show my email on invoice headers"
        value={showMyEmail}
        setValue={setShowMyEmail}
      />
      <SettingsSectionSwitch
        label="Show my logo"
        sublabel="Show my logo on invoice headers"
        value={showMyLogo}
        setValue={setShowMyLogo}
      />
      <SettingsSectionSwitch
        label="Show my company name"
        sublabel="Show my company name on invoice headers"
        value={showMyCompanyName}
        setValue={setShowMyCompanyName}
      />
      <SettingsSectionSwitch
        label="Show due date"
        sublabel="Show due date on invoice headers"
        value={showDueDate}
        setValue={setShowDueDate}
      />
      <SettingsSectionSwitch
        label="Show Tax Numbers"
        sublabel="Show tax numbers on invoice headers"
        value={showMyTaxNumbers}
        setValue={setShowMyTaxNumbers}
      />
      <SettingsSectionSwitch
        label="Show client name"
        sublabel="Show client name on invoices"
        value={showClientName}
        setValue={setShowClientName}
      />
      <SettingsSectionSwitch
        label="Show client address"
        sublabel="Show client address on invoices"
        value={showClientAddress}
        setValue={setShowClientAddress}
      />
      <SettingsSectionSwitch
        label="Show client phone"
        sublabel="Show client phone on invoices"
        value={showClientPhone}
        setValue={setShowClientPhone}
      />
      <SettingsSectionSwitch
        label="Show client email"
        sublabel="Show client email on invoices"
        value={showClientEmail}
        setValue={setShowClientEmail}
      />
      <SettingsSectionSwitch
        label="Show client company name"
        sublabel="Show client company name on invoices"
        value={showClientCompanyName}
        setValue={setShowClientCompanyName}
      />
      <SettingsSectionSwitch
        label="Show notes"
        sublabel="Show notes on invoices"
        value={showNotes}
        setValue={showNotes}
      />
      <SettingsSection
        label="Tax Numbers"
        sublabel="Tax numbers are shown on invoices"
      >
        <AppInput
          label="Tax Number 1"
          value={taxNumber1}
          onChange={(e) => setTaxNumber1(e.target.value)}
        />
        <AppInput
          label="Tax Number 2"
          value={taxNumber2}
          onChange={(e) => setTaxNumber2(e.target.value)}
        />
      </SettingsSection>
      <SettingsSection
        label="Tax Rates"
        sublabel="Set automatic tax rates for all invoices"
      >
        <div className="split-row">
          <AppInput
            label="Tax Label 1"
            type="number"
            value={taxRateName1}
            onChange={(e) => setTaxRateName1(e.target.value)}
            iconleft={
              <div className="icon-container">
                <i className="fal fa-percent" />
              </div>
            }
            className="icon-input"
          />
          <AppInput
            label="Tax Label 2"
            type="number"
            value={taxRateName2}
            onChange={(e) => setTaxRateName2(e.target.value)}
            iconleft={
              <div className="icon-container">
                <i className="fal fa-percent" />
              </div>
            }
            className="icon-input"
          />
        </div>
        <div className="split-row">
          <AppInput
            label="Tax Rate 1"
            type="number"
            value={taxRate1}
            onChange={(e) => setTaxRate1(e.target.value)}
            iconleft={
              <div className="icon-container">
                <i className="fal fa-percent" />
              </div>
            }
            className="icon-input"
          />
          <AppInput
            label="Tax Rate 2"
            type="number"
            value={taxRate2}
            onChange={(e) => setTaxRate2(e.target.value)}
            iconleft={
              <div className="icon-container">
                <i className="fal fa-percent" />
              </div>
            }
            className="icon-input"
          />
        </div>
      </SettingsSection>
      <SettingsSection
        label="Invoice notes"
        sublabel="Add global notes that show up on all invoices"
      >
        <AppTextarea
          value={invoiceNotes}
          onChange={e => setInvoiceNotes(e.target.value)}
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
