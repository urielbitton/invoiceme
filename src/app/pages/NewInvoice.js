import AppButton from "app/components/ui/AppButton"
import { AppInput, AppSelect, AppSwitch, AppTextarea } from "app/components/ui/AppInputs"
import AppTable from "app/components/ui/AppTable"
import PageTitleBar from "app/components/ui/PageTitleBar"
import { currencies } from "app/data/general"
import { StoreContext } from "app/store/store"
import { convertDateToInputFormat } from "app/utils/dateUtils"
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import './styles/NewInvoicePage.css'

export default function NewInvoice() {

  const { myUserID, setNavItemInfo } = useContext(StoreContext)
  const [invoiceName, setInvoiceName] = useState("")
  const [invoiceNumber, setInvoiceNumber] = useState("")
  const [invoiceDueDate, setInvoiceDueDate] = useState(convertDateToInputFormat(new Date()))
  const [invoiceSubTotal, setInvoiceSubTotal] = useState(null)
  const [invoiceCurrency, setInvoiceCurrency] = useState(currencies[0])
  const [showTaxRates, setShowTaxRates] = useState(false)
  const [taxRate1, setTaxRate1] = useState(null)
  const [taxRate2, setTaxRate2] = useState(null)
  const [status, setStatus] = useState('unpaid')
  const [invoiceItems, setInvoiceItems] = useState([])
  const [invoiceContact, setInvoiceContact] = useState(null)
  const [invoiceNotes, setInvoiceNotes] = useState("")
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [numOfPages, setNumOfPages] = useState(1)
  const [pageNum, setPageNum] = useState(0)
  const [numOfHits, setNumOfHits] = useState(0)
  const [hitsPerPage, setHitsPerPage] = useState(10)
  const filters = `ownerID: ${myUserID}`
  const navigate = useNavigate()

  const statusOptions = [
    { value: 'unpaid', label: 'Unpaid' },
    { value: 'paid', label: 'Paid' },
    { value: 'partially-paid', label: 'Partially Paid' },
    { value: 'overdue', label: 'Overdue' },
  ]

  const addInvoiceItem = () => {

  }

  const addContact = () => {

  }

  useEffect(() => {
    setNavItemInfo({
      label: <small
        onClick={() => navigate(-1)}
        className="go-back"
      ><i className="fal fa-arrow-left" />Back</small>,
      sublabel: <>
        <h6 className="numbers">Subtotal: {invoiceCurrency?.symbol}{invoiceSubTotal?.toFixed(2)}</h6>
        <h6 className="numbers">Tax: {(taxRate1 + taxRate2)?.toFixed(2)}%</h6>
        <h6 className="numbers">
          <strong>Total: {invoiceCurrency?.symbol}{(invoiceSubTotal * (taxRate1 + taxRate2))?.toFixed(2)}</strong>
        </h6>
      </>
    })
  }, [invoiceSubTotal])

  return (
    <div className="new-invoice-page">
      <PageTitleBar
        title="Create an Invoice"
        hasBorder
      />
      <div className="page-content">
        <form onSubmit={(e) => e.preventDefault()}>
          <AppInput
            label="Invoice Name"
            value={invoiceName}
            onChange={(e) => setInvoiceName(e.target.value)}
          />
          <AppInput
            label="Invoice Number"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
          />
          <AppInput
            label="Due Date"
            type="date"
            value={invoiceDueDate}
            onChange={(e) => setInvoiceDueDate(e.target.value)}
            className="date-input"
          />
          <AppInput
            label="Invoice Amount"
            type="number"
            value={invoiceSubTotal}
            onChange={(e) => setInvoiceSubTotal(+e.target.value)}
          />
          <AppSelect
            label="Currency"
            options={currencies}
            value={invoiceCurrency}
            onChange={(e) => setInvoiceCurrency(e.target.value)}
          />
          <AppSwitch
            label="Show Tax Rates"
            checked={showTaxRates}
            onChange={(e) => setShowTaxRates(e.target.checked)}
          />
          {showTaxRates && (
            <div className="tax-rates">
              <AppInput
                label="Tax Rate 1"
                type="number"
                value={taxRate1}
                onChange={(e) => setTaxRate1(+e.target.value)}
              />
              <AppInput
                label="Tax Rate 2"
                type="number"
                value={taxRate2}
                onChange={(e) => setTaxRate2(+e.target.value)}
              />
            </div>
          )}
          <AppSelect
            label="Status"
            options={statusOptions}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
          <AppTextarea
            label="Notes"
            value={invoiceNotes}
            onChange={(e) => setInvoiceNotes(e.target.value)}
          />
        </form>
        <div className="invoice-items">
          <h4>Invoice Items</h4>
          <AppTable
            headers={[
              'Item',
              'Date',
              'Unit Price',
              'Quantity',
              'Total',
              'Edit'
            ]}
            rows={invoiceItems}
          />
          <AppButton
            label="Add Item"
            rightIcon="fal fa-plus"
            onClick={() => addInvoiceItem()}
          />
        </div>
        <div className="invoice-contact">
          <h4>Invoice Contact</h4>
          <AppInput
            label="Search Contact"

          />
          <AppTable
            headers={[
              'Name',
              'Email',
              'Phone',
              'Address',
              'Add Contact',
              'Edit'
            ]}
            rows={invoiceContact ? [invoiceContact] : []}
          />
        </div>
      </div>
    </div>
  )
}
