import { StoreContext } from "app/store/store"
import React, { useContext } from 'react'
import InvoicePaper from "./InvoicePaper"
import './styles/InvoicePreviewModal.css'

export default function InvoicePreviewModal(props) {

  const { myUser } = useContext(StoreContext)
  const { showInvoicePreview, setShowInvoicePreview, invoiceData,
    invoicePaperRef, isScheduled } = props

  return (
    <div className={`invoice-preview-modal ${showInvoicePreview ? 'show' : ''}`}>
      <i
        className="fal fa-times"
        onClick={() => setShowInvoicePreview(false)}
      />
      <InvoicePaper
        invoice={invoiceData?.invoice}
        invoiceItems={invoiceData?.items}
        myBusiness={myUser?.myBusiness}
        taxNumbers={invoiceData?.taxNumbers}
        calculatedSubtotal={invoiceData?.subtotal}
        calculatedTaxRate={invoiceData?.taxRate1 + invoiceData?.taxRate2}
        calculatedTotal={invoiceData?.total}
        dayOfMonth={invoiceData?.dayOfMonth}
        invoicePaperRef={invoicePaperRef}
        isScheduled={isScheduled}
      />
    </div>
  )
}
