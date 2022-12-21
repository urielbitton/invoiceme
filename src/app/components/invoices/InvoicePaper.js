// @ts-nocheck
import { useUserInvoiceSettings } from "app/hooks/userHooks"
import { StoreContext } from "app/store/store"
import { convertClassicDate } from "app/utils/dateUtils"
import { formatCurrency, formatPhoneNumber } from "app/utils/generalUtils"
import React, { useContext } from 'react'
import AppTable from "../ui/AppTable"
import './styles/InvoicePaper.css'

export default function InvoicePaper(props) {

  const { myUser, myUserID } = useContext(StoreContext)
  const { invoice, myBusiness, taxNumbers, invoiceItems,
    calculatedSubtotal, calculatedTaxRate, calculatedTotal,
    invoicePaperRef } = props
  const myTaxNumbers = taxNumbers || myUser?.taxNumbers
  const invSettings = useUserInvoiceSettings(myUserID)

  const invoiceItemsList = invoiceItems?.map((item, index) => {
    return <div
      className="invoice-item-row"
      key={index}
    >
      <h6>{(index + 1)}</h6>
      <h6>{item?.name}</h6>
      <h6>{invoice?.currency?.symbol}{formatCurrency(item?.price?.toFixed(2))}</h6>
      <h6>{item?.quantity}</h6>
      <h6>{item?.taxRate}%</h6>
      <h6>{invoice?.currency?.symbol}{item?.total?.toFixed(2)}</h6>
    </div>
  })

  const taxNumbersList = myTaxNumbers?.map((taxNum, index) => {
    return <h5
      className="tax-numbers"
      key={index}
    >
      {taxNum.name}: {taxNum.number}
    </h5>
  })

  return (
    invSettings &&
    <div
      className="invoice-paper-container"
      ref={invoicePaperRef}
    >
      <header>
        {
          invSettings.showMyLogo &&
          <img
            src={invoice?.myBusiness?.logo || myBusiness?.logo}
            alt="Logo"
          />
        }
        <div
          className="header-row"
        >
          <div
            className="left"
          >
            {invSettings.showMyName && <h3>{invoice?.myBusiness?.name || myBusiness?.name}</h3>}
            {invSettings.showMyAddress && <h5>{invoice?.myBusiness?.address || myBusiness?.address}</h5>}
            {invSettings.showMyPhone && <h5>{formatPhoneNumber(invoice?.myBusiness?.phone || myBusiness?.phone)}</h5>}
            {invSettings.showMyEmail && <h5>{invoice?.myBusiness?.email || myBusiness?.email}</h5>}
            <h5>
              {invoice?.myBusiness?.city || myBusiness?.city},&nbsp;
              {invoice?.myBusiness?.region || myBusiness?.region},&nbsp;
              {invSettings.showMyCountry ? `${invoice?.myBusiness?.country || myBusiness?.country} ` : null}
              {invoice?.myBusiness?.postcode || myBusiness?.postcode}
            </h5>
            {invSettings.showMyTaxNumbers && taxNumbersList}
          </div>
          <div
            className="right"
          >
            <h3>Invoice</h3>
            <h5>#{invoice?.invoiceNumber}</h5>
            <h5>Invoice Date: {convertClassicDate(invoice?.dateCreated.toDate())}</h5>
            {
              invSettings?.showDueDate &&
              <h5>
                Date Due: <span>{convertClassicDate(invoice?.dateDue.toDate())}</span>
              </h5>
            }
          </div>
        </div>
      </header>
      <div
        className="billto-section"
      >
        <div className="side">
          <h4>Bill To</h4>
          {invSettings.showClientName && <h5>{invoice?.invoiceTo.name}</h5>}
          {invSettings.showClientAddress && <h5>{invoice?.invoiceTo.address}</h5>}
          {invSettings.showClientPhone && <h5>{formatPhoneNumber(invoice?.invoiceTo.phone)}</h5>}
          {invSettings.showClientEmail && <h5>{invoice?.invoiceTo.email}</h5>}
          <h5>
            {invoice?.invoiceTo.city}, {invoice?.invoiceTo.region},&nbsp;
            ({invSettings.showClientCountry && invoice?.invoiceTo.country}) {invoice?.invoiceTo.postcode}
          </h5>
        </div>
        <div className="side" />
      </div>
      <div
        className="items-section"
      >
        <AppTable
          headers={[
            'Item #',
            'Service',
            'Price',
            'Quantity',
            'Tax Rate',
            'Total'
          ]}
          rows={invoiceItemsList}
        />
      </div>
      <div
        className="totals-section"
      >
        <h6>
          <span>Tax Rate</span>
          <span>{calculatedTaxRate}%</span>
        </h6>
        <h6>
          <span>Subtotal</span>
          <span>{invoice?.currency?.symbol}{formatCurrency(calculatedSubtotal)}</span>
        </h6>
        <h6
          className="totals"
        >
          <span>Total</span>
          <span>{invoice?.currency?.symbol}{formatCurrency(calculatedTotal)} {invoice?.currency?.value}</span>
        </h6>
      </div>
      {
        (invoice?.notes?.length > 0 || invSettings?.invoiceNotes?.length > 0) && invSettings?.showNotes && 
        <div
          className="notes-section"
        >
          <h4>Notes</h4>
          <p>{invoice?.notes || invSettings.invoiceNotes}</p>
        </div>
      }
      <div
        className="foot-notes"
      >
        <h6>{invSettings.thankYouMessage || 'Thank you for your business.'}</h6>
        {
          invSettings.showInvoiceMeTag &&
          <small>
            Invoice generated by&nbsp;
            <a
              href="https://invoiceme.pro"
            >
              InvoiceMe
            </a>
          </small>
        }
      </div>
    </div>
  )
}
