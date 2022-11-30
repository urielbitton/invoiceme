import { updateDB } from "app/services/CrudDB"
import { StoreContext } from "app/store/store"
import React, { useContext, useEffect, useState } from 'react'
import AppButton from "../ui/AppButton"
import { AppInput, AppTextarea } from "../ui/AppInputs"
import SettingsSection from "./SettingsSection"
import SettingsSectionSwitch from "./SettingsSectionSwitch"
import SettingsTitles from "./SettingsTitles"

export default function InvoicesSettings() {

  const { myUserID, myUser, setPageLoading } = useContext(StoreContext)
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
  const [taxNumbers, setTaxNumbers] = useState([])
  const [taxName, setTaxName] = useState('')
  const [taxNumber, setTaxNumber] = useState('')
  const [taxRate, setTaxRate] = useState(0)
  const [showThankYouMessage, setShowThankYouMessage] = useState(true)
  const [showInvoiceMeTag, setShowInvoiceMeTag] = useState(true)
  const allowAddTax = taxName && taxNumber && taxRate

  const deleteTaxNumber = (taxNumber) => {
    const confirm = window.confirm(`Are you sure you want to delete tax item: ${taxNumber.name}?`)
    if (confirm) {
      const newTaxNumbers = taxNumbers.filter(tax => tax.number !== taxNumber.number)
      setTaxNumbers(newTaxNumbers)
    }
  }

  const taxNumbersList = taxNumbers?.map((taxNumber, index) => {
    return <div
      key={index}
      className="tax-item-container"
    >
      <h5>Tax Number {index + 1}</h5>
      <div className="tax-item">
        <span>{taxNumber.name},</span>
        <span>{taxNumber.number},</span>
        <span>{taxNumber.value}%</span>
        <i
          className="fas fa-trash"
          onClick={() => deleteTaxNumber(taxNumber)}
        />
      </div>
    </div>
  })

  const saveSettings = () => {
    setPageLoading(true)
    updateDB(`users/${myUserID}/settings`, 'settings', {
      invoices: {
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
        showMyTaxNumbers,
        showNotes,
        invoiceNotes,
        showThankYouMessage,
        showInvoiceMeTag
      }
    })
      .then(() => {
        updateDB('users', myUserID, {
          taxNumbers
        })
          .then(() => {
            setPageLoading(false)
          })
          .catch(err => {
            console.log(err)
            setPageLoading(false)
          })
      })
      .catch(err => {
        console.log(err)
        setPageLoading(false)
      })
  }

  const addTaxNumber = () => {
    if (!!!allowAddTax) return alert('Please fill out the tax name, number and rate.')
    setTaxNumbers([...taxNumbers, { name: taxName, number: taxNumber, value: taxRate }])
    setTaxName('')
    setTaxNumber('')
    setTaxRate(0)
  }

  useEffect(() => {
    setTaxNumbers(myUser?.taxNumbers)
  }, [myUser])

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
        label="Tax Information"
        sublabel="Add your tax information to be displayed on your invoices"
      >
        <div className="tax-list">
          {taxNumbersList}
        </div>
        <div className="tax-row">
          <AppInput
            label="Tax Name"
            value={taxName}
            onChange={(e) => setTaxName(e.target.value)}
            className="full"
          />
          <AppInput
            label="Tax Number"
            value={taxNumber}
            onChange={(e) => setTaxNumber(e.target.value)}
          />
          <AppInput
            label="Tax Rate"
            value={taxRate}
            onChange={(e) => setTaxRate(e.target.value)}
            type="number"
            iconleft={
              <div className="icon-container">
                <i className="fal fa-percent" />
              </div>
            }
            className="icon-input"
          />
          <small onClick={() => addTaxNumber()}><i className="far fa-plus" />Add</small>
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
      <SettingsSectionSwitch
        label="Show 'Thank you' message"
        sublabel="Show 'Thank you' message on bottom of invoice"
        value={showThankYouMessage}
        setValue={setShowThankYouMessage}
      />
      <SettingsSectionSwitch
        badge="Business"
        label="Show 'Invoice Me' watermark"
        sublabel="Show 'Invoice Me' watermark on bottom of invoice"
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
