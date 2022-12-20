// @ts-nocheck
import { useUserInvoiceSettings } from "app/hooks/userHooks"
import { StoreContext } from "app/store/store"
import { convertClassicDate } from "app/utils/dateUtils"
import { formatCurrency, formatPhoneNumber } from "app/utils/generalUtils"
import React, { useContext } from 'react'
import AppTable from "../ui/AppTable"
import { invoicePaperStyles } from "./invoicePaperStyles"
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
      style={index === invoiceItems.length - 1 ? invoicePaperStyles?.invoiceItemRowLast : invoicePaperStyles?.invoiceItemRow}
      key={index}
    >
      <h6 style={invoicePaperStyles?.invoiceItemRowH6}>{(index + 1)}</h6>
      <h6 style={invoicePaperStyles?.invoiceItemRowH6}>{item?.name}</h6>
      <h6 style={invoicePaperStyles?.invoiceItemRowH6}>{invoice?.currency.symbol}{formatCurrency(item?.price?.toFixed(2))}</h6>
      <h6 style={invoicePaperStyles?.invoiceItemRowH6}>{item?.quantity}</h6>
      <h6 style={invoicePaperStyles?.invoiceItemRowH6}>{item?.taxRate}%</h6>
      <h6 style={invoicePaperStyles?.invoiceItemRowH6}>{invoice?.currency.symbol}{item?.total?.toFixed(2)}</h6>
    </div>
  })

  const taxNumbersList = myTaxNumbers?.map((taxNum, index) => {
    return <h5
      style={invoicePaperStyles?.headerH5}
      className="tax-numbers"
      contentEditable
      key={index}
    >
      {taxNum.name}: {taxNum.number}
    </h5>
  })

  return (
    invSettings &&
    <div
      className="invoice-paper-container"
      style={invoicePaperStyles?.container}
      ref={invoicePaperRef}
    >
      <header style={invoicePaperStyles?.header}>
        {
          invSettings.showMyLogo &&
          <img
            style={invoicePaperStyles?.headerImg}
            src={invoice?.myBusiness?.logo || myBusiness?.logo}
            alt="Logo"
          />
        }
        <div
          className="header-row"
          style={invoicePaperStyles?.headerRow}
        >
          <div
            className="left"
            style={invoicePaperStyles?.headerLeft}
          >
            {invSettings.showMyName && <h3 style={invoicePaperStyles?.headerLeftH3}>{invoice?.myBusiness?.name || myBusiness?.name}</h3>}
            {invSettings.showMyAddress && <h5 style={invoicePaperStyles?.headerH5}>{invoice?.myBusiness?.address || myBusiness?.address}</h5>}
            {invSettings.showMyPhone && <h5 style={invoicePaperStyles?.headerH5}>{formatPhoneNumber(invoice?.myBusiness?.phone || myBusiness?.phone)}</h5>}
            <h5 style={invoicePaperStyles?.headerH5}>
              {invoice?.myBusiness?.city || myBusiness?.city},&nbsp;
              {invoice?.myBusiness?.region || myBusiness?.region},&nbsp;
              {invSettings.showMyCountry ? `${invoice?.myBusiness?.country || myBusiness?.country} ` : null}
              {invoice?.myBusiness?.postcode || myBusiness?.postcode}
            </h5>
            {invSettings.showMyTaxNumbers && taxNumbersList}
          </div>
          <div
            className="right"
            style={invoicePaperStyles?.headerRight}
          >
            <h3 style={invoicePaperStyles?.headerRightH3}>Invoice</h3>
            <h5 style={invoicePaperStyles?.headerH5}>#{invoice?.invoiceNumber}</h5>
            <h5 style={invoicePaperStyles?.headerH5}>Invoice Date: {convertClassicDate(invoice?.dateCreated.toDate())}</h5>
            {
              invSettings?.showDueDate &&
              <h5 style={invoicePaperStyles?.headerH5}>
                Date Due: <span style={invoicePaperStyles?.headerH5Span}>{convertClassicDate(invoice?.dateDue.toDate())}</span>
              </h5>
            }
          </div>
        </div>
      </header>
      <div
        className="billto-section"
        style={invoicePaperStyles?.billToSection}
      >
        <div className="side">
          <h4 style={invoicePaperStyles?.billtoSectionH4}>Bill To</h4>
          {invSettings.showClientName && <h5 style={invoicePaperStyles?.billtoSectionH5}>{invoice?.invoiceTo.name}</h5>}
          {invSettings.showClientAddress && <h5 style={invoicePaperStyles?.billtoSectionH5}>{invoice?.invoiceTo.address}</h5>}
          {invSettings.showClientPhone && <h5 style={invoicePaperStyles?.billtoSectionH5}>{formatPhoneNumber(invoice?.invoiceTo.phone)}</h5>}
          <h5 style={invoicePaperStyles?.billtoSectionH5}>
            {invoice?.invoiceTo.city}, {invoice?.invoiceTo.region},&nbsp;
            ({invSettings.showClientCountry && invoice?.invoiceTo.country}) {invoice?.invoiceTo.postcode}
          </h5>
        </div>
        <div className="side" />
      </div>
      <div
        className="items-section"
        style={invoicePaperStyles?.itemsSection}
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
          tableStyles={{ minWidth: '100%' }}
          headerStyles={invoicePaperStyles?.appTableHeaders}
          headerItemStyles={invoicePaperStyles?.appTableHeadersH5}
          lastHeaderClassName="no-print"
        />
      </div>
      <div
        className="totals-section"
        style={invoicePaperStyles?.totalsSection}
      >
        <h6 style={invoicePaperStyles?.totalsSectionH6First}>
          <span>Tax Rate</span>
          <span>{calculatedTaxRate}%</span>
        </h6>
        <h6 style={invoicePaperStyles?.totalsSectionH6}>
          <span>Subtotal</span>
          <span>{invoice?.currency?.symbol}{formatCurrency(calculatedSubtotal)}</span>
        </h6>
        <h6
          className="totals"
          style={invoicePaperStyles?.totalsSectionH6Totals}
        >
          <span>Total</span>
          <span>{invoice?.currency?.symbol}{formatCurrency(calculatedTotal)} {invoice?.currency?.value}</span>
        </h6>
      </div>
      {
        invoice?.notes?.length > 0 && invSettings?.showNotes && 
        <div
          className="notes-section"
          style={invoicePaperStyles?.notesSection}
        >
          <h4 style={invoicePaperStyles?.notesSectionH4}>Notes</h4>
          <p style={invoicePaperStyles?.notesSectionP}>{invSettings.invoiceNotes || invoice?.notes}</p>
        </div>
      }
      <div
        className="foot-notes"
        style={invoicePaperStyles?.footNotes}
      >
        <h6 style={invoicePaperStyles?.footNotesH6}>{invSettings.thankYouMessage || 'Thank you for your business.'}</h6>
        {
          invSettings.showInvoiceMeTag &&
          <small style={invoicePaperStyles?.footNotesSmall}>
            Invoice generated by&nbsp;
            <a
              href="https://invoiceme.pro"
              style={invoicePaperStyles?.footNotesLink}
            >
              InvoiceMe
            </a>
          </small>}
      </div>
    </div>
  )
}
