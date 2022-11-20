import AppButton from "app/components/ui/AppButton"
import { sendHtmlToEmailAsPDF } from "app/services/emailServices"
import { StoreContext } from "app/store/store"
import React, { useContext } from 'react'
import { useParams } from "react-router-dom"

export default function InvoicePage() {

  const { setPageLoading } = useContext(StoreContext)
  const invoiceID = useParams().invoiceID

  const sendInvoice = () => {
    const confirm = window.confirm("Send invoice to client?")
    if (confirm) {
      setPageLoading(true)
      sendHtmlToEmailAsPDF(
        'urielas@hotmail.com', 
        'Invoice Email', 
        'Test invoice email', 
        '<h1>Test</h1>', 
        'test.pdf'
      )
      .then(() => {
        setPageLoading(false)
        alert("Invoice sent!")
      })
      .catch((error) => {
        setPageLoading(false)
        alert(error.message)
      })
    }
  }

  return (
    <div>
      <h1>Invoice Page</h1>
      <h2>Invoice ID: {invoiceID}</h2>
      <br/>
      <AppButton
        label="Send Invoice"
        rightIcon="fas fa-paper-plane"
        onClick={() => sendInvoice()}
      />
    </div>
  )
}
