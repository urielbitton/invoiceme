import { deleteDB } from "app/services/CrudDB"
import { StoreContext } from "app/store/store"
import { convertClassicDateAndTime, displayThStNdRd } from "app/utils/dateUtils"
import React, { useContext } from 'react'
import { useNavigate } from "react-router-dom"
import AppButton from "../ui/AppButton"
import './styles/ScheduledInvoiceCard.css'

export function ScheduledInvoiceCard(props) {

  const { setPageLoading } = useContext(StoreContext)
  const { title, dateCreated, dayOfMonth, timeOfDay, active,
    lastSent, invoiceTemplate, scheduleID } = props.scheduled
  const { setInvoiceData, setShowInvoicePreview } = props
  const monthName = new Date(dateCreated?.toDate()).toLocaleString('default', { month: 'short' })
  const navigate = useNavigate()

  const showPreview = () => {
    setShowInvoicePreview(true)
    setInvoiceData({
      invoice: invoiceTemplate,
      taxNumbers: invoiceTemplate?.taxNumbers,
      items: invoiceTemplate?.items,
      subtotal: invoiceTemplate?.subtotal,
      taxRate1: invoiceTemplate?.taxRate1,
      taxRate2: invoiceTemplate?.taxRate2,
      total: invoiceTemplate?.total
    })
  }

  const deleteSchedule = () => {
    const confirm = window.confirm("Are you sure you want to delete this schedule?")
    if (confirm) {
      setPageLoading(true)
      deleteDB('scheduledInvoices', scheduleID)
      .then(() => {
        navigate('/settings/scheduled-invoices')
        alert("Scheduled invoice deleted.")
        setPageLoading(false)
      })
      .catch(err => {
        console.log(err)
        setPageLoading(false)
      })
    }
  }

  return <div className="scheduled-invoice-card">
    <div className="top">
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
          <i className="fas fa-clock" />
          {timeOfDay}:00{timeOfDay > 12 ? "PM" : "AM"}
        </h6>
        <h6>
          <i className="fas fa-history" />
          Last sent: {lastSent ? convertClassicDateAndTime(lastSent?.toDate()) : 'Never'}
        </h6>
      </div>
      <div className="content">
        <h5>Invoice Template</h5>
        <h6>
          <i className="fas fa-file-invoice" />
          {invoiceTemplate?.title}
        </h6>
        <h6>
          <i className="fas fa-eye" />
          <small
            className="underline bold"
            onClick={() => showPreview()}
          >
            Preview Invoice
          </small>
        </h6>
      </div>
      <div className="content">
        <h5>Contact</h5>
        <h6>
          <i className="fas fa-user" />
          {invoiceTemplate?.invoiceTo?.name}
        </h6>
        <h6>
          <i className="fas fa-envelope" />
          {invoiceTemplate?.invoiceTo?.email}
        </h6>
      </div>
    </div>
    <div className="actions">
      <AppButton
        label="Edit"
        buttonType="invertedBtn"
        onClick={() => navigate(`/settings/scheduled-invoices/new?scheduleID=${scheduleID}&edit=true`)}
      />
      <AppButton
        label="Delete"
        buttonType="invertedBtn"
        onClick={() => deleteSchedule()}
      />
    </div>
  </div>
}
