import { useUserScheduledInvoices } from "app/hooks/invoiceHooks"
import { StoreContext } from "app/store/store"
import { convertClassicDateAndTime, displayThStNdRd } from "app/utils/dateUtils"
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
        sublabel="Create and manage automated invoices on a recurring schedule."
        icon="fas fa-calendar-alt"
        button={
          <AppButton
            label="Create Scheduled Invoice"
            leftIcon="fal fa-plus"
            url={`/settings/scheduled-invoices/new`}
          />
        }
      />
      <div className="scheduled-invoices-grid">
        {scheduledInvoicesList}
      </div>
    </div>
  )
}


export function ScheduledInvoice(props) {

  const { title, dateCreated, dayOfMonth, timeOfDay, active,
    lastSent } = props.invoice
  const monthName = new Date(dateCreated?.toDate()).toLocaleString('default', { month: 'short' })

  return <div className="scheduled-invoice-card">
    <div className="header">
      <div className="calendar-container">
        <div className="month">{monthName}</div>
        <div className="day">{dayOfMonth}</div>
      </div>
      <h4>
        {title}
        <small>{active ? 'Active' : 'Inactive'}</small>
      </h4>
    </div>
    <div className="content">
      <h5>Schedule</h5>
      <h6>
        <i className="fas fa-calendar-alt" />
        Every month on the {dayOfMonth}{displayThStNdRd(dayOfMonth)}
      </h6>
      <h6>
        <i className="fas fa-clock"/>
        {timeOfDay}:00{timeOfDay > 12 ? "PM" : "AM"}
      </h6>
      <h6>
        <i className="fas fa-history"/>
        Last sent: {convertClassicDateAndTime(lastSent?.toDate())}
      </h6>
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