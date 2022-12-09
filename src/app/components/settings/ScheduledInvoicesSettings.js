import { useUserScheduledInvoices } from "app/hooks/invoiceHooks"
import { StoreContext } from "app/store/store"
import React, { useContext, useRef, useState } from 'react'
import { NavLink, Route, Routes, useLocation } from "react-router-dom"
import InvoicePreviewModal from "../invoices/InvoicePreviewModal"
import AppButton from "../ui/AppButton"
import AppTabsBar from "../ui/AppTabsBar"
import ScheduledEvents from "./ScheduledEvents"
import { ScheduledInvoiceCard } from "./ScheduledInvoiceCard"
import SettingsTitles from "./SettingsTitles"

export default function ScheduledInvoicesSettings() {

  const { myUserID } = useContext(StoreContext)
  const [showInvoicePreview, setShowInvoicePreview] = useState(false)
  const [invoiceData, setInvoiceData] = useState(null)
  const scheduledInvoices = useUserScheduledInvoices(myUserID)
  const invoicePaperRef = useRef(null)
  const location= useLocation()

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
      <AppTabsBar
        noSpread
        spacedOut={15}
      >
        <NavLink 
          to=""
          className={location.pathname !== '/settings/scheduled-invoices' ? 'not-active' : ''}
        >
          Invoices
        </NavLink>
        <NavLink to="events">
          Events
        </NavLink>
      </AppTabsBar>
      <div className="scheduled-routes">
        <Routes>
          <Route path="" element={
            <div className="scheduled-invoices-grid">{scheduledInvoicesList}</div>
            } 
          />
          <Route path="events" element={<ScheduledEvents />} />
        </Routes>
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