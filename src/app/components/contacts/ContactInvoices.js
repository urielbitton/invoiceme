import { showXResultsOptions } from "app/data/general"
import React, { useState } from 'react'
import InvoiceRow from "../invoices/InvoiceRow"
import AppButton from "../ui/AppButton"
import { AppSelect } from "../ui/AppInputs"
import AppTable from "../ui/AppTable"

export default function ContactInvoices({invoices}) {

  const [showAmount, setShowAmount] = useState(showXResultsOptions[0].value)

  const invoicesList = invoices
  ?.slice(0, showAmount)
  .map((invoice, index) => {
    return <InvoiceRow
      key={index}
      invoice={invoice}
    />
  })

  return (
    <div className="contact-invoices-content contact-content">
      <div className="header">
        <h5>Invoices: {invoices?.length}</h5>
        <AppSelect
          label="Show:"
          options={showXResultsOptions}
          value={showAmount}
          onChange={(e) => setShowAmount(e.target.value)}
        />
      </div>
      <AppTable
        headers={[
          "Invoice #",
          "Title",
          "Client",
          "Items",
          "Total",
          "Date Created",
          "Paid",
          'Actions'
        ]}
        rows={invoicesList}
      />
      <div className="btn-group">
        {
          showAmount <= invoices?.length &&
          <AppButton
            label="Show More"
            onClick={() => setShowAmount(showAmount + showXResultsOptions[0].value)}
          />
        }
      </div>
    </div>
  )
}
