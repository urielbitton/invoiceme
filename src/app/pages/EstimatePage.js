import AppButton from "app/components/ui/AppButton"
import { AppInput, AppTextarea } from "app/components/ui/AppInputs"
import AppTable from "app/components/ui/AppTable"
import DropdownButton from "app/components/ui/DropdownButton"
import FileUploader from "app/components/ui/FileUploader"
import HelmetTitle from "app/components/ui/HelmetTitle"
import { StoreContext } from "app/store/store"
import { convertClassicDate } from "app/utils/dateUtils"
import { domToPDFDownload, downloadHtmlElementAsImage } from "app/utils/fileUtils"
import { formatCurrency, formatPhoneNumber, validateEmail } from "app/utils/generalUtils"
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom"
import './styles/InvoicePage.css'
import { invoicePaperStyles } from "app/components/invoices/invoicePaperStyles"
import { useEstimate } from "app/hooks/estimateHooks"
import { deleteEstimateService, sendEstimateService } from "app/services/estimatesServices"

export default function EstimatePage() {

  const { setPageLoading, myUserID, myUser, setNavItemInfo } = useContext(StoreContext)
  const [showDownloadMenu, setShowDownloadMenu] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [contactEmail, setContactEmail] = useState('')
  const [emailSubject, setEmailSubject] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [estimateItems, setestimateItems] = useState([])
  const maxFileSize = 1024 * 1024 * 5
  const estimateID = useParams().estimateID
  const estimate = useEstimate(myUserID, estimateID)
  const myBusiness = myUser?.myBusiness
  const calculatedSubtotal = estimate?.items?.reduce((acc, item) => (acc + (item.price * item.quantity)), 0)
  const calculatedTotal = estimate?.items?.reduce((acc, item) => (acc + ((item.price + (item.price * item.taxRate / 100)) * item.quantity)), 0)
  const calculatedTaxRate = estimate?.items?.every(item => item.taxRate === estimate?.items[0].taxRate) ? estimate?.items[0].taxRate : null
  const invoicePaperRef = useRef(null)
  const navigate = useNavigate()

  const allowSendEstimate = estimateItems.length > 0 &&
    validateEmail(contactEmail) &&
    estimate

  const taxNumbersList = myBusiness?.taxNumbers?.map((taxNum, index) => {
    return <h5 
      style={invoicePaperStyles?.headerH5}
      key={index}
    >
      {taxNum.name}: {taxNum.value}
    </h5>
  })

  const estimateItemsList = estimateItems?.map((item, index) => {
    return <div
      className="invoice-item-row"
      style={index === estimateItems.length - 1 ? invoicePaperStyles?.invoiceItemRowLast : invoicePaperStyles?.invoiceItemRow}
      key={index}
    >
      <h6 style={invoicePaperStyles?.invoiceItemRowH6}>{(index + 1)}</h6>
      <h6 style={invoicePaperStyles?.invoiceItemRowH6}>{item.name}</h6>
      <h6 style={invoicePaperStyles?.invoiceItemRowH6}>{estimate.currency.symbol}{formatCurrency(item.price.toFixed(2))}</h6>
      <h6 style={invoicePaperStyles?.invoiceItemRowH6}>{item.quantity}</h6>
      <h6 style={invoicePaperStyles?.invoiceItemRowH6}>{item.taxRate}%</h6>
      <h6 style={invoicePaperStyles?.invoiceItemRowH6}>{estimate.currency.symbol}{item.total.toFixed(2)}</h6>
    </div>
  })

  const sendEstimate = () => {
    if (!allowSendEstimate) return alert('Please fill in all fields.')
    const confirm = estimate?.isSent ? window.confirm('This estimate has already been sent, would you like to send it again?') : true
    if (confirm) {
      sendEstimateService(
        myUser?.email,
        contactEmail,
        emailSubject,
        emailMessage.replace(/\r\n|\r|\n/g, "</br>"),
        document.querySelector('.invoice-page .paper-container'),
        `${estimate.estimateNumber}.pdf`,
        uploadedFiles,
        myUserID,
        estimateID,
        estimate.estimateNumber,
        setPageLoading
      )
    }
  }

  const deleteEstimate = () => {
    deleteEstimateService(myUserID, estimateID, setPageLoading)
  }

  const downloadAsPDF = () => {
    domToPDFDownload(
      document.querySelector('.invoice-page .paper-container'), 
      `${estimate.estimateNumber}.pdf`,
      true
    )
  }

  const downloadAsImage = () => {
    downloadHtmlElementAsImage(
      document.getElementsByClassName('paper-container')[0],
      `${estimate.estimateNumber}.png`,
    )
  }

  useEffect(() => {
    if (estimate) {
      setContactEmail(estimate?.estimateTo?.email || '')
      setEmailSubject(`${estimate?.title} - ${estimate?.estimateNumber}`)
      setEmailMessage(
        `Hi ${estimate?.estimateTo?.name},\n\nPlease find attached your estimate` +
        ` ${estimate?.estimateNumber}.\n\nThanks,\n\n${myUser?.firstName}`
      )
      setestimateItems(estimate?.items || [])
    }
    setNavItemInfo({
      label: <small
        onClick={() => navigate(-1)}
        className="go-back"
      >
        <i className="fal fa-arrow-left" />Back
      </small>,
      sublabel: <div className="meta-data column">
        <h6>Estimate Name <span>{estimate?.title}</span></h6>
        <h6>Sent <span>{estimate?.isSent ? 'Yes' : 'No'}</span></h6>
      </div>
    })
    return () => setNavItemInfo(null)
  }, [estimate])


  return (
    estimate ?
      <div className="invoice-page">
        <HelmetTitle title={`Estimate #${estimate.estimateNumber}`} />
        <div className="page-content">
          <div className="send-container">
            <div className="top">
              <h3>Send Estimate</h3>
              {
                estimate.isSent &&
                <h5>
                  <span><i className="fas fa-paper-plane" />Estimate Sent</span>
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
                placeholder="Estimate email subject"
                value={emailSubject}
                onChange={e => setEmailSubject(e.target.value)}
              />
              <AppTextarea
                label="Message"
                placeholder="Estimate email message"
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
                onClick={() => sendEstimate()}
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
                    { 
                      label: 'Image Download', 
                      icon: 'fas fa-image', 
                      onClick: () => downloadAsImage() 
                    }
                  ]}
                  buttonType="white"
                  dropdownPosition="place-left-top"
                />
                <AppButton
                  label="Print"
                  leftIcon="fas fa-print"
                  buttonType="white"
                  onClick={() => window.print()}
                />
              </div>
            </div>
            <div className="bottom">
              <AppButton
                label="Edit Estimate"
                leftIcon="fas fa-pen"
                onClick={() => navigate(`/estimates/new?estimateID=${estimateID}&edit=true`)}
                buttonType="invertedBtn"
                className="edit-invoice-btn"
              />
              <AppButton
                label="Delete Estimate"
                leftIcon="fas fa-trash"
                buttonType="invertedBtn"
                onClick={() => deleteEstimate()}
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
                  <h5 style={invoicePaperStyles?.headerH5}>{formatPhoneNumber(myBusiness.phone)}</h5>
                  <h5 style={invoicePaperStyles?.headerH5}>{myBusiness.address}</h5>
                  <h5 style={invoicePaperStyles?.headerH5}>{myBusiness.city}, {myBusiness.region} {myBusiness.postcode}</h5>
                  {taxNumbersList}
                </div>
                <div 
                  className="right"
                  style={invoicePaperStyles?.headerRight}
                >
                  <h3 style={invoicePaperStyles?.headerRightH3}>Estimate</h3>
                  <h5 style={invoicePaperStyles?.headerH5}>#{estimate.estimateNumber}</h5>
                  <h5 style={invoicePaperStyles?.headerH5}>Estimate Date: {convertClassicDate(estimate.dateCreated.toDate())}</h5>
                  <h5 style={invoicePaperStyles?.headerH5}>
                    Date Due: <span style={invoicePaperStyles?.headerH5Span}>{convertClassicDate(estimate.dateDue.toDate())}</span>
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
                <h5 style={invoicePaperStyles?.billtoSectionH5}>{estimate.estimateTo.name}</h5>
                <h5 style={invoicePaperStyles?.billtoSectionH5}>{estimate.estimateTo.address}</h5>
                <h5 style={invoicePaperStyles?.billtoSectionH5}>{formatPhoneNumber(estimate.estimateTo.phone)}</h5>
                <h5 style={invoicePaperStyles?.billtoSectionH5}>
                  {estimate.estimateTo.city}, {estimate.estimateTo.region},&nbsp;
                  ({estimate.estimateTo.country}) {estimate.estimateTo.postcode}
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
                rows={estimateItemsList}
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
                <span>{estimate.currency?.symbol}{formatCurrency(calculatedSubtotal)}</span>
              </h6>
              <h6 
                className="totals"
                style={invoicePaperStyles?.totalsSectionH6Totals}
              >
                <span>Total</span>
                <span>{estimate.currency?.symbol}{formatCurrency(calculatedTotal)} {estimate.currency?.value}</span>
              </h6>
            </div>
            {
              estimate.notes?.length > 0 &&
              <div 
                className="notes-section"
                style={invoicePaperStyles?.notesSection}
              >
                <h4 style={invoicePaperStyles?.notesSectionH4}>Notes</h4>
                <p style={invoicePaperStyles?.notesSectionP}>{estimate.notes}</p>
              </div>
            }
            <div 
              className="foot-notes"
              style={invoicePaperStyles?.footNotes}
            >
              <h6 style={invoicePaperStyles?.footNotesH6}>Thank you for your business.</h6>
              <small style={invoicePaperStyles?.footNotesSmall}>
                Estimate generated by&nbsp;
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
      </div> :
      null
  )
}
