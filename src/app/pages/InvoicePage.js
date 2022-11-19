import React from 'react'
import { useParams } from "react-router-dom"

export default function InvoicePage() {

  const invoiceID = useParams().invoiceID

  return (
    <div>
      <h1>Invoice Page</h1>
      <h2>Invoice ID: {invoiceID}</h2>
    </div>
  )
}
