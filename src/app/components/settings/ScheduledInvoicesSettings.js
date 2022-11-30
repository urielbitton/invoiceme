import { useUserScheduledInvoices } from "app/hooks/invoiceHooks"
import { StoreContext } from "app/store/store"
import React, { useContext, useRef, useState } from 'react'
import InvoicePreviewModal from "../invoices/InvoicePreviewModal"
import AppButton from "../ui/AppButton"
import { ScheduledInvoiceCard } from "./ScheduledInvoiceCard"
import SettingsTitles from "./SettingsTitles"

export default function ScheduledInvoicesSettings() {

  const { myUserID } = useContext(StoreContext)
  const [showInvoicePreview, setShowInvoicePreview] = useState(false)
  const [invoiceData, setInvoiceData] = useState(null)
  const scheduledInvoices = useUserScheduledInvoices(myUserID)
  const invoicePaperRef = useRef(null)

  const scheduledInvoicesList = scheduledInvoices?.map((scheduled, index) => {
    return <ScheduledInvoiceCard
      key={index}
      scheduled={scheduled}
      setInvoiceData={setInvoiceData}
      setShowInvoicePreview={setShowInvoicePreview}
    />
  })

  return (
    <div className="settings-sub-page">
      <SettingsTitles
        label="Scheduled Invoices"
        sublabel="Create and manage automated invoices on a recurring schedule."
        icon="fas fa-calendar-alt"
        button={
          <AppButton
            label="Create Scheduled Invoice"
            leftIcon="fal fa-plus"
            url={`/settings/scheduled-invoices/new`}
          />
        }
        badge="Business"
      />
      <div className="scheduled-invoices-grid">
        {scheduledInvoicesList}
      </div>
      <InvoicePreviewModal
        invoiceData={invoiceData}
        showInvoicePreview={showInvoicePreview}
        setShowInvoicePreview={setShowInvoicePreview}
        invoicePaperRef={invoicePaperRef}
      />
    </div>
  )
}