import AppButton from "app/components/ui/AppButton"
import { AppInput, AppTextarea } from "app/components/ui/AppInputs"
import DropdownButton from "app/components/ui/DropdownButton"
import FileUploader from "app/components/ui/FileUploader"
import { sendHtmlToEmailAsPDF } from "app/services/emailServices"
import { StoreContext } from "app/store/store"
import React, { useContext, useState } from 'react'
import { useParams } from "react-router-dom"
import './styles/InvoicePage.css'

export default function InvoicePage() {

  const { setPageLoading } = useContext(StoreContext)
  const [showDownloadMenu, setShowDownloadMenu] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const maxFileSize = 1024 * 1024 * 5
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
        'test.pdf',
        uploadedFiles.map(file => file.file)
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
            placeholder="Bill to email"
          />
          <AppInput
            label="Subject"
            placeholder="Invoice email subject"
          />
          <AppTextarea
            label="Message"
            placeholder="Invoice email message"
          />
          <FileUploader
            isDragging={isDragging}
            setIsDragging={setIsDragging}
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
            maxFileSize={maxFileSize}
            icon="fas fa-paperclip"
            text="Attach Files"
          />
          <AppButton
            label="Send"
            onClick={() => sendInvoice()}
            rightIcon="fas fa-paper-plane"
          />
          <div className="additional-actions">
            <DropdownButton
              label="Download As"
              rightIcon="fas fa-angle-down"
              showMenu={showDownloadMenu}
              setShowMenu={setShowDownloadMenu}
              items={[
                {label: 'Pdf', icon: 'fas fa-file-pdf', onClick: () => console.log('PDF')},
                {label: 'Excel', icon: 'fas fa-file-excel', onClick: () => console.log('Excel')},
                {label: 'Word', icon: 'fas fa-file-word', onClick: () => console.log('Word')},
                {label: 'Image', icon: 'fas fa-image', onClick: () => console.log('Image')},
              ]}
              buttonType="white"
              dropdownPosition="place-left"
            />
            <AppButton
              label="Print"
              rightIcon="fas fa-print"
              buttonType="white"
            />
          </div>
        </div>
        <div className="paper-container">

        </div>
      </div>
    </div>
  )
}
