import AppButton from "app/components/ui/AppButton"
import { AppInput, AppTextarea } from "app/components/ui/AppInputs"
import DropdownButton from "app/components/ui/DropdownButton"
import { sendHtmlToEmailAsPDF } from "app/services/emailServices"
import { StoreContext } from "app/store/store"
import React, { useContext, useState } from 'react'
import { useParams } from "react-router-dom"
import './styles/InvoicePage.css'

export default function InvoicePage() {

  const { setPageLoading } = useContext(StoreContext)
  const [showDownloadMenu, setShowDownloadMenu] = useState(false)
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
    <div className="invoice-page">
      <div className="page-content">
        <div className="send-container">
          <h3>Send Invoice</h3>
          <AppInput
            label="Send To"
          />
          <AppInput
            label="Subject"
          />
          <AppTextarea
            label="Message"
          />
          attach files<br/>
          <AppButton
            label="Send"
            onClick={() => sendInvoice()}
            rightIcon="fas fa-paper-plane"
          />
          <hr/>
          <DropdownButton
            label="Download"
            rightIcon="fas fa-angle-down"
            showMenu={showDownloadMenu}
            setShowMenu={setShowDownloadMenu}
            items={[]}
          />
          <AppButton
            label="Print"
            rightIcon="fas fa-print"
          />
        </div>
        <div className="paper-container">

        </div>
      </div>
    </div>
  )
}
