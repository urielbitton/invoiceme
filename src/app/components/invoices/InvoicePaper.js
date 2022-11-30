import { convertClassicDate } from "app/utils/dateUtils"
import { formatCurrency, formatPhoneNumber } from "app/utils/generalUtils"
import React from 'react'
import AppTable from "../ui/AppTable"
import { invoicePaperStyles } from "./invoicePaperStyles"

export default function InvoicePaper(props) {

  const { invoice, myBusiness, taxNumbersList, invoiceItems,
    calculatedSubtotal, calculatedTaxRate, calculatedTotal,
    invoicePaperRef } = props

  const invoiceItemsList = invoiceItems?.map((item, index) => {
    return <div
      className="invoice-item-row"
      style={index === invoiceItems.length - 1 ? invoicePaperStyles?.invoiceItemRowLast : invoicePaperStyles?.invoiceItemRow}
      key={index}
    >
      <h6 style={invoicePaperStyles?.invoiceItemRowH6}>{(index + 1)}</h6>
      <h6 style={invoicePaperStyles?.invoiceItemRowH6}>{item?.name}</h6>
      <h6 style={invoicePaperStyles?.invoiceItemRowH6}>{invoice.currency.symbol}{formatCurrency(item?.price?.toFixed(2))}</h6>
      <h6 style={invoicePaperStyles?.invoiceItemRowH6}>{item?.quantity}</h6>
      <h6 style={invoicePaperStyles?.invoiceItemRowH6}>{item?.taxRate}%</h6>
      <h6 style={invoicePaperStyles?.invoiceItemRowH6}>{invoice.currency.symbol}{item?.total?.toFixed(2)}</h6>
    </div>
  })

  return (
    <div
      className="paper-container"
      style={invoicePaperStyles?.container}
      ref={invoicePaperRef}
    >
      <header style={invoicePaperStyles?.header}>
        <img
          style={invoicePaperStyles?.headerImg}
          src={myBusiness.logo}
          alt="Logo"
        />
        <div
          className="header-row"
          style={invoicePaperStyles?.headerRow}
        >
          <div
            className="left"
            style={invoicePaperStyles?.headerLeft}
          >
            <h3 style={invoicePaperStyles?.headerLeftH3}>{myBusiness.name}</h3>
            <h5 style={invoicePaperStyles?.headerH5}>{formatPhoneNumber(myBusiness.phone)}</h5>
            <h5 style={invoicePaperStyles?.headerH5}>{myBusiness.address}</h5>
            <h5 style={invoicePaperStyles?.headerH5}>{myBusiness.city}, {myBusiness.region} {myBusiness.postcode}</h5>
            {taxNumbersList}
          </div>
          <div
            className="right"
            style={invoicePaperStyles?.headerRight}
          >
            <h3 style={invoicePaperStyles?.headerRightH3}>Invoice</h3>
            <h5 style={invoicePaperStyles?.headerH5}>#{invoice.invoiceNumber}</h5>
            <h5 style={invoicePaperStyles?.headerH5}>Invoice Date: {convertClassicDate(invoice.dateCreated.toDate())}</h5>
            <h5 style={invoicePaperStyles?.headerH5}>
              Date Due: <span style={invoicePaperStyles?.headerH5Span}>{convertClassicDate(invoice.dateDue.toDate())}</span>
            </h5>
          </div>
        </div>
      </header>
      <div
        className="billto-section"
        style={invoicePaperStyles?.billToSection}
      >
        <div className="side">
          <h4 style={invoicePaperStyles?.billtoSectionH4}>Bill To</h4>
          <h5 style={invoicePaperStyles?.billtoSectionH5}>{invoice.invoiceTo.name}</h5>
          <h5 style={invoicePaperStyles?.billtoSectionH5}>{invoice.invoiceTo.address}</h5>
          <h5 style={invoicePaperStyles?.billtoSectionH5}>{formatPhoneNumber(invoice.invoiceTo.phone)}</h5>
          <h5 style={invoicePaperStyles?.billtoSectionH5}>
            {invoice.invoiceTo.city}, {invoice.invoiceTo.region},&nbsp;
            ({invoice.invoiceTo.country}) {invoice.invoiceTo.postcode}
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
          <span>{invoice.currency?.symbol}{formatCurrency(calculatedSubtotal)}</span>
        </h6>
        <h6
          className="totals"
          style={invoicePaperStyles?.totalsSectionH6Totals}
        >
          <span>Total</span>
          <span>{invoice.currency?.symbol}{formatCurrency(calculatedTotal)} {invoice.currency?.value}</span>
        </h6>
      </div>
      {
        invoice.notes?.length > 0 &&
        <div
          className="notes-section"
          style={invoicePaperStyles?.notesSection}
        >
          <h4 style={invoicePaperStyles?.notesSectionH4}>Notes</h4>
          <p style={invoicePaperStyles?.notesSectionP}>{invoice.notes}</p>
        </div>
      }
      <div
        className="foot-notes"
        style={invoicePaperStyles?.footNotes}
      >
        <h6 style={invoicePaperStyles?.footNotesH6}>Thank you for your business.</h6>
        <small style={invoicePaperStyles?.footNotesSmall}>
          Invoice generated by&nbsp;
          <a
            href="https://invoiceme-six.vercel.app"
            style={invoicePaperStyles?.footNotesLink}
          >
            InvoiceMe
          </a>
        </small>
      </div>
    </div>
  )
}
