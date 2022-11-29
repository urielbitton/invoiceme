import { useUserScheduledInvoices } from "app/hooks/invoiceHooks"
import { StoreContext } from "app/store/store"
import React, { useContext } from 'react'
import AppButton from "../ui/AppButton"
import SettingsTitles from "./SettingsTitles"

export default function ScheduledInvoicesSettings() {

  const { myUserID } = useContext(StoreContext)
  const scheduledInvoices = useUserScheduledInvoices(myUserID)

  const scheduledInvoicesList = scheduledInvoices?.map((invoice, index) => {
    return <ScheduledInvoice
      key={index}
      invoice={invoice}
    />
  })

  return (
    <div className="settings-sub-page">
      <SettingsTitles
        label="Scheduled Invoices"
        sublabel="Create and manage scheduled, automated invoices."
        icon="fas fa-calendar-alt"
      />
      <div className="scheduled-invoices-grid">
        {scheduledInvoicesList}
      </div>
    </div>
  )
}


export function ScheduledInvoice(props) {

  const { title, dateCreated, dayOfMonth, timeOfDay } = props.invoice
  const monthName = new Date(dateCreated?.toDate()).toLocaleString('default', { month: 'short' })

  return <div className="scheduled-invoice-card">
    <div className="header">
      <div className="calendar-container">
        <div className="month">{monthName}</div>
        <div className="day">{dayOfMonth}</div>
      </div>
      <h4>{title}</h4>
    </div>
    <div className="actions">
      <AppButton
        label="Edit"
        buttonType="invertedBtn"
      />
      <AppButton
        label="Delete"
        buttonType="invertedBtn"
      />
    </div>
  </div>
}