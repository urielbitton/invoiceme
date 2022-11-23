// @ts-nocheck
import AppButton from "app/components/ui/AppButton"
import { AppInput, AppTextarea } from "app/components/ui/AppInputs"
import AppModal from "app/components/ui/AppModal"
import AppTable from "app/components/ui/AppTable"
import DropdownButton from "app/components/ui/DropdownButton"
import FileUploader from "app/components/ui/FileUploader"
import HelmetTitle from "app/components/ui/HelmetTitle"
import IconContainer from "app/components/ui/IconContainer"
import { useInvoice } from "app/hooks/invoiceHooks"
import { deleteInvoiceService, sendInvoiceService } from "app/services/invoiceServices"
import { StoreContext } from "app/store/store"
import { convertClassicDate } from "app/utils/dateUtils"
import { domToPDFDownload } from "app/utils/fileUtils"
import { formatCurrency, formatPhoneNumber, validateEmail } from "app/utils/generalUtils"
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom"
import './styles/InvoicePage.css'
import { invoicePaperStyles } from "app/components/invoices/invoicePaperStyles"

export default function InvoicePage() {

  const { setPageLoading, myUserID, myUser, setNavItemInfo } = useContext(StoreContext)
  const [showDownloadMenu, setShowDownloadMenu] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [contactEmail, setContactEmail] = useState('')
  const [emailSubject, setEmailSubject] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [invoiceItems, setInvoiceItems] = useState([])
  const [showEditModal, setShowEditModal] = useState(false)
  const maxFileSize = 1024 * 1024 * 5
  const invoiceID = useParams().invoiceID
  const invoice = useInvoice(myUserID, invoiceID)
  const myBusiness = myUser?.myBusiness
  const calculatedSubtotal = invoice?.items?.reduce((acc, item) => (acc + (item.price * item.quantity)), 0)
  const calculatedTotal = invoice?.items?.reduce((acc, item) => (acc + ((item.price + (item.price * item.taxRate / 100)) * item.quantity)), 0)
  const calculatedTaxRate = invoice?.items?.every(item => item.taxRate === invoice?.items[0].taxRate) ? invoice?.items[0].taxRate : null
  const invoicePaperRef = useRef(null)
  const navigate = useNavigate()

  const allowSendInvoice = invoiceItems.length > 0 &&
    validateEmail(contactEmail) &&
    invoice

  const invoiceItemsList = invoiceItems?.map((item, index) => {
    return <div
      className="invoice-item-row"
      style={index === invoiceItems.length - 1 ? invoicePaperStyles?.invoiceItemRowLast : invoicePaperStyles?.invoiceItemRow}
      key={index}
    >
      <h6 style={invoicePaperStyles?.invoiceItemRowH6}>{(index + 1)}</h6>
      <h6 style={invoicePaperStyles?.invoiceItemRowH6}>{item.name}</h6>
      <h6 style={invoicePaperStyles?.invoiceItemRowH6}>{invoice.currency.symbol}{formatCurrency(item.price.toFixed(2))}</h6>
      <h6 style={invoicePaperStyles?.invoiceItemRowH6}>{item.quantity}</h6>
      <h6 style={invoicePaperStyles?.invoiceItemRowH6}>{item.taxRate}%</h6>
      <h6 style={invoicePaperStyles?.invoiceItemRowH6}>{invoice.currency.symbol}{item.total.toFixed(2)}</h6>
      <div 
        className="actions no-print"
        style={invoicePaperStyles?.invoiceItemRowActions}
      >
        <IconContainer
          icon="fas fa-pen"
          onClick={() => console.log('edit')}
          bgColor="transparent"
          iconColor="var(--grayText)"
          iconSize="13px"
          dimensions="20px"
        />
        <IconContainer
          icon="fas fa-trash"
          onClick={() => console.log('delete')}
          bgColor="transparent"
          iconColor="var(--grayText)"
          iconSize="13px"
          dimensions="20px"
        />
      </div>
    </div>
  })

  const sendInvoice = () => {
    if (!allowSendInvoice) return alert('Please fill in all fields.')
    const confirm = invoice?.isSent ? window.confirm('This invoice has already been sent, would you like to send it again?') : true
    if (confirm) {
      sendInvoiceService(
        contactEmail,
        emailSubject,
        emailMessage.replace(/\r\n|\r|\n/g, "</br>"),
        document.querySelector('.invoice-page .paper-container'),
        `${invoice.invoiceNumber}.pdf`,
        uploadedFiles,
        myUserID,
        invoiceID,
        invoice.invoiceNumber,
        setPageLoading
      )
    }
  }

  const deleteInvoice = () => {
    deleteInvoiceService(myUserID, invoiceID, setPageLoading)
  }

  const printInvoice = () => {
    window.print()
  }

  const saveInvoice = () => {

  }

  const downloadAsPDF = () => {
    domToPDFDownload(
      document.querySelector('.invoice-page .paper-container'), 
      `${invoice.invoiceNumber}.pdf`
    )
  }

  useEffect(() => {
    if (invoice) {
      setContactEmail(invoice?.invoiceTo?.email || '')
      setEmailSubject(`${invoice?.title} - ${invoice?.invoiceNumber}`)
      setEmailMessage(
        `Hi ${invoice?.invoiceTo?.name},\n\nPlease find attached your invoice` +
        ` ${invoice?.invoiceNumber}.\n\nThanks,\n\n${myUser?.firstName}`
      )
      setInvoiceItems(invoice?.items || [])
    }
    setNavItemInfo({
      label: <small
        onClick={() => navigate(-1)}
        className="go-back"
      >
        <i className="fal fa-arrow-left" />Back
      </small>,
      sublabel: <div className="meta-data">
        <h6>Invoice Name: <span>{invoice?.title}</span></h6>
        <h6>Status: <span>{invoice?.status}</span></h6>
        <h6>Sent: <span>{invoice?.isSent ? 'Yes' : 'No'}</span></h6>
        <h6>Paid: <span>{invoice?.isPaid ? 'Yes' : 'No'}</span></h6>
      </div>
    })
  }, [invoice])


  return (
    invoice ?
      <div className="invoice-page">
        <HelmetTitle title={`Invoice #${invoice.invoiceNumber}`} />
        <div className="page-content">
          <div className="send-container">
            <div className="top">
              <h3>Send Invoice</h3>
              {
                invoice.isSent &&
                <h5>
                  <span><i className="fas fa-paper-plane" />Invoice Sent</span>
                  <i className="far fa-check" />
                </h5>
              }
              <AppInput
                label="Send To"
                placeholder="Bill to email"
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
              />
              <AppInput
                label="Subject"
                placeholder="Invoice email subject"
                value={emailSubject}
                onChange={e => setEmailSubject(e.target.value)}
              />
              <AppTextarea
                label="Message"
                placeholder="Invoice email message"
                value={emailMessage}
                onChange={e => setEmailMessage(e.target.value)}
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
                  leftIcon="fas fa-arrow-to-bottom"
                  rightIcon="far fa-angle-down"
                  showMenu={showDownloadMenu}
                  setShowMenu={setShowDownloadMenu}
                  items={[
                    { 
                      label: 'PDF Download', 
                      icon: 'fas fa-file-pdf', 
                      onClick: () => downloadAsPDF()
                    },
                    { label: 'Image Download', icon: 'fas fa-image', onClick: () => console.log('Image') },
                  ]}
                  buttonType="white"
                  dropdownPosition="place-left-top"
                />
                <AppButton
                  label="Print"
                  leftIcon="fas fa-print"
                  buttonType="white"
                  onClick={() => printInvoice()}
                />
              </div>
            </div>
            <div className="bottom">
              <AppButton
                label="Edit Invoice"
                leftIcon="fas fa-pen"
                onClick={() => setShowEditModal(true)}
                buttonType="invertedBtn"
                className="edit-invoice-btn"
              />
              <AppButton
                label="Delete Invoice"
                leftIcon="fas fa-trash"
                buttonType="invertedBtn"
                onClick={() => deleteInvoice()}
                className="delete-btn"
              />
            </div>
          </div>
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
                  <h5 style={invoicePaperStyles?.headerH5}>Tax Number: {myBusiness.taxNumber}</h5>
                  <h5 style={invoicePaperStyles?.headerH5}>{formatPhoneNumber(myBusiness.phone)}</h5>
                  <h5 style={invoicePaperStyles?.headerH5}>{myBusiness.address}</h5>
                  <h5 style={invoicePaperStyles?.headerH5}>{myBusiness.city}, {myBusiness.region} {myBusiness.postcode}</h5>
                </div>
                <div 
                  className="right"
                  style={invoicePaperStyles?.headerRight}
                >
                  <h3 style={invoicePaperStyles?.headerRightH3}>Invoice</h3>
                  <h5 style={invoicePaperStyles?.headerH5}>#{invoice.invoiceNumber}</h5>
                  <h5 style={invoicePaperStyles?.headerH5}>Invoice Date: {convertClassicDate(invoice.dateCreated.toDate())}</h5>
                  <h5 style={invoicePaperStyles?.headerH5}>Date Due: <span style={invoicePaperStyles?.headerH5Span}>{convertClassicDate(invoice.dateDue.toDate())}</span></h5>
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
                  'Total',
                  'Actions'
                ]}
                rows={invoiceItemsList}
                tableStyles={{minWidth: '100%'}}
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
                <span>{invoice.currency?.symbol}{formatCurrency(calculatedTotal)}</span>
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
        </div>
        <AppModal
          showModal={showEditModal}
          setShowModal={setShowEditModal}
          label="Edit Invoice"
        >

        </AppModal>
      </div> :
      null
  )
}
