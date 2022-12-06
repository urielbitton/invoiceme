// @ts-nocheck
import { StoreContext } from "app/store/store"
import { convertClassicDate } from "app/utils/dateUtils"
import { formatCurrency, formatPhoneNumber } from "app/utils/generalUtils"
import React, { useContext } from 'react'
import { invoicePaperStyles } from "../invoices/invoicePaperStyles"
import AppTable from "../ui/AppTable"

export default function EstimatePaper(props) {

  const { myUser } = useContext(StoreContext)
  const { estimate, myBusiness, taxNumbers, estimateItems,
    calculatedSubtotal, calculatedTaxRate, calculatedTotal,
    estimatePaperRef } = props
  const myTaxNumbers = taxNumbers || myUser?.taxNumbers

  const invoiceItemsList = estimateItems?.map((item, index) => {
    return <div
      className="invoice-item-row"
      style={index === estimateItems.length - 1 ? invoicePaperStyles?.invoiceItemRowLast : invoicePaperStyles?.invoiceItemRow}
      key={index}
    >
      <h6 style={invoicePaperStyles?.invoiceItemRowH6}>{(index + 1)}</h6>
      <h6 style={invoicePaperStyles?.invoiceItemRowH6}>{item?.name}</h6>
      <h6 style={invoicePaperStyles?.invoiceItemRowH6}>{estimate?.currency.symbol}{formatCurrency(item?.price?.toFixed(2))}</h6>
      <h6 style={invoicePaperStyles?.invoiceItemRowH6}>{item?.quantity}</h6>
      <h6 style={invoicePaperStyles?.invoiceItemRowH6}>{item?.taxRate}%</h6>
      <h6 style={invoicePaperStyles?.invoiceItemRowH6}>{estimate?.currency.symbol}{item?.total?.toFixed(2)}</h6>
    </div>
  })

  const taxNumbersList = myTaxNumbers?.map((taxNum, index) => {
    return <h5 
      style={invoicePaperStyles?.headerH5}
      key={index}
    >
      {taxNum.name}: {taxNum.number}
    </h5>
  })

  return (
    <div
      className="paper-container"
      style={invoicePaperStyles?.container}
      ref={estimatePaperRef}
    >
      <header style={invoicePaperStyles?.header}>
        <img
          style={invoicePaperStyles?.headerImg}
          src={estimate?.myBusiness?.logo || myBusiness?.logo}
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
            <h3 style={invoicePaperStyles?.headerLeftH3}>{estimate?.myBusiness?.name || myBusiness.name}</h3>
            <h5 style={invoicePaperStyles?.headerH5}>{formatPhoneNumber(estimate?.myBusiness?.phone || myBusiness.phone)}</h5>
            <h5 style={invoicePaperStyles?.headerH5}>{estimate?.myBusiness?.address || myBusiness.address}</h5>
            <h5 style={invoicePaperStyles?.headerH5}>
              {estimate?.myBusiness?.city || myBusiness.city},&nbsp;
              {estimate?.myBusiness?.region || myBusiness.region},&nbsp; 
              {estimate?.myBusiness?.postcode || myBusiness.postcode}
            </h5>
            {taxNumbersList}
          </div>
          <div
            className="right"
            style={invoicePaperStyles?.headerRight}
          >
            <h3 style={invoicePaperStyles?.headerRightH3}>Invoice</h3>
            <h5 style={invoicePaperStyles?.headerH5}>#{estimate?.invoiceNumber}</h5>
            <h5 style={invoicePaperStyles?.headerH5}>Invoice Date: {convertClassicDate(estimate?.dateCreated.toDate())}</h5>
            <h5 style={invoicePaperStyles?.headerH5}>
              Date Due: <span style={invoicePaperStyles?.headerH5Span}>{convertClassicDate(estimate?.dateDue.toDate())}</span>
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
          <h5 style={invoicePaperStyles?.billtoSectionH5}>{estimate?.estimateTo.name}</h5>
          <h5 style={invoicePaperStyles?.billtoSectionH5}>{estimate?.estimateTo.address}</h5>
          <h5 style={invoicePaperStyles?.billtoSectionH5}>{formatPhoneNumber(estimate?.estimateTo.phone)}</h5>
          <h5 style={invoicePaperStyles?.billtoSectionH5}>
            {estimate?.estimateTo.city}, {estimate?.estimateTo.region},&nbsp;
            ({estimate?.estimateTo.country}) {estimate?.estimateTo.postcode}
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
          <span>{estimate?.currency?.symbol}{formatCurrency(calculatedSubtotal)}</span>
        </h6>
        <h6
          className="totals"
          style={invoicePaperStyles?.totalsSectionH6Totals}
        >
          <span>Total</span>
          <span>{estimate?.currency?.symbol}{formatCurrency(calculatedTotal)} {estimate?.currency?.value}</span>
        </h6>
      </div>
      {
        estimate?.notes?.length > 0 &&
        <div
          className="notes-section"
          style={invoicePaperStyles?.notesSection}
        >
          <h4 style={invoicePaperStyles?.notesSectionH4}>Notes</h4>
          <p style={invoicePaperStyles?.notesSectionP}>{estimate?.notes}</p>
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
            href="https://invoiceme.pro"
            style={invoicePaperStyles?.footNotesLink}
          >
            InvoiceMe
          </a>
        </small>
      </div>
    </div>
  )
}
