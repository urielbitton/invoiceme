import AppButton from "app/components/ui/AppButton"
import { AppInput, AppTextarea } from "app/components/ui/AppInputs"
import DropdownButton from "app/components/ui/DropdownButton"
import FileUploader from "app/components/ui/FileUploader"
import HelmetTitle from "app/components/ui/HelmetTitle"
import { useInvoice } from "app/hooks/invoiceHooks"
import { deleteInvoiceService, sendInvoiceService } from "app/services/invoiceServices"
import { StoreContext } from "app/store/store"
import { blobToBase64, downloadHtmlElementAsImage } from "app/utils/fileUtils"
import { formatCurrency, validateEmail } from "app/utils/generalUtils"
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from "react-router-dom"
import './styles/InvoicePage.css'
import AppModal from "app/components/ui/AppModal"
import InvoicePaper from "app/components/invoices/InvoicePaper"
import EmptyPage from "app/components/ui/EmptyPage"
import { errorToast, infoToast, successToast } from "app/data/toastsTemplates"
import { useUserInvoiceSettings, useUserNotifSettings } from "app/hooks/userHooks"
import { convertClassicDate } from "app/utils/dateUtils"
import InvoicePaperDoc from "app/components/invoices/InvoicePaperDoc"
import { PDFDownloadLink, pdf } from "@react-pdf/renderer"

export default function InvoicePage() {

  const { setPageLoading, myUserID, myUser, setNavItemInfo,
    setToasts } = useContext(StoreContext)
  const [showDownloadMenu, setShowDownloadMenu] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [contactEmail, setContactEmail] = useState('')
  const [emailSubject, setEmailSubject] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [invoiceItems, setInvoiceItems] = useState([])
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const maxFileSize = 1024 * 1024 * 5
  const myBusiness = myUser?.myBusiness
  const taxNumbers = myBusiness?.taxNumbers
  const invoiceID = useParams().invoiceID
  const invoice = useInvoice(myUserID, invoiceID)
  const calculatedSubtotal = invoice?.items?.reduce((acc, item) => (acc + (item.price * item.quantity)), 0)
  const calculatedTotal = invoice?.items?.reduce((acc, item) => (acc + ((item.price + (item.price * item.taxRate / 100)) * item.quantity)), 0)
  const calculatedTaxRate = invoice?.items?.every(item => item.taxRate === invoice?.items[0].taxRate) ? invoice?.items[0].taxRate : null
  const invoicePaperRef = useRef(null)
  const navigate = useNavigate()
  const notifSettings = useUserNotifSettings(myUserID)
  const invSettings = useUserInvoiceSettings(myUserID)

  const allowSendInvoice = invoiceItems.length > 0 &&
    validateEmail(contactEmail) &&
    invoice

  const PaperDoc = () => {
    return <InvoicePaperDoc
      invoice={invoice}
      myBusiness={myBusiness}
      taxNumbers={taxNumbers}
      invoiceItems={invoiceItems}
      calculatedSubtotal={calculatedSubtotal}
      calculatedTaxRate={calculatedTaxRate}
      calculatedTotal={calculatedTotal}
      myUser={myUser}
      invSettings={invSettings}
    />
  }

  const sendInvoice = () => {
    if (!allowSendInvoice) return setToasts(infoToast('Please fill in all fields.'))
    const confirm = invoice?.isSent ? window.confirm('This invoice has already been sent, would you like to send it again?') : true
    if (!confirm) return setToasts(infoToast('Invoice not sent.'))
    pdf(<PaperDoc />).toBlob()
      .then((blob) => {
        blobToBase64(blob)
        .then((base64) => {
          sendInvoiceService(
            myUser?.email,
            contactEmail,
            emailSubject,
            emailMessage,
            base64,
            `${invoice.invoiceNumber}.pdf`,
            uploadedFiles,
            myUserID,
            invoiceID,
            invoice.invoiceNumber,
            setPageLoading,
            setToasts,
            notifSettings.showOutgoingInvoicesNotifs
          )
        })
        .catch((err) => {
          console.log(err)
          setToasts(errorToast('Error sending invoice. Please try again.'))
        })
      })
  }

    const deleteInvoice = () => {
      deleteInvoiceService(myUserID, invoiceID, setPageLoading, setToasts, notifSettings.showOutgoingInvoicesNotifs)
    }

    const downloadAsPdf = () => {
      // @ts-ignore
      document.querySelector('.pdf-download-link').click()
      setToasts(successToast('PDF Downloaded'))
    }

    const downloadAsImage = () => {
      downloadHtmlElementAsImage(
        document.querySelector('.invoice-paper-container'),
        `${invoice.invoiceNumber}.png`,
      )
    }

    useEffect(() => {
      if (invoice) {
        setContactEmail(invoice?.invoiceTo?.email || '')
        setEmailSubject(`${invoice?.title} - ${invoice?.invoiceNumber}`)
        setEmailMessage(
          `Hi ${invoice?.invoiceTo?.name?.split(' ')[0]},\n\nPlease find attached your invoice` +
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
        sublabel: <div className="meta-data column">
          <h6>Invoice Name <span>{invoice?.title}</span></h6>
          <h6>Status <span>{invoice?.status}</span></h6>
          <h6>Sent <span>{invoice?.isSent ? 'Yes' : 'No'}</span></h6>
          <h6>Paid <span>{invoice?.isPaid ? 'Yes' : 'No'}</span></h6>
          <h6>Scheduled <span>{invoice?.isScheduled ? 'Yes' : 'No'}</span></h6>
          <h6>Total <span>{invoice?.currency?.symbol}{formatCurrency(invoice?.total?.toFixed(2))}</span></h6>
          <AppButton
            label="Details"
            leftIcon="fas fa-info-circle"
            buttonType="invertedBtn"
            onClick={() => setShowDetailsModal(true)}
            className="nav-btn"
          />
        </div>
      })
      return () => setNavItemInfo(null)
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
                    buttonType="white"
                    dropdownPosition="place-left-bottom"
                    showMenu={showDownloadMenu}
                    setShowMenu={setShowDownloadMenu}
                    items={[
                      {
                        label: 'PDF Download',
                        icon: 'fas fa-file-pdf',
                        onClick: () => downloadAsPdf()
                      },
                      {
                        label: 'Image Download',
                        icon: 'fas fa-image',
                        onClick: () => downloadAsImage()
                      }
                    ]}
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
                  label="Edit Invoice"
                  leftIcon="fas fa-pen"
                  onClick={() => navigate(`/invoices/new?invoiceID=${invoiceID}&edit=true`)}
                  buttonType="invertedBtn"
                  className="edit-invoice-btn"
                />
                <AppButton
                  label="Delete Invoice"
                  leftIcon="fas fa-trash"
                  buttonType="invertedRedBtn"
                  onClick={() => deleteInvoice()}
                />
              </div>
            </div>
            <InvoicePaper
              invoice={invoice}
              myBusiness={myBusiness}
              taxNumbers={taxNumbers}
              invoiceItems={invoiceItems}
              calculatedSubtotal={calculatedSubtotal}
              calculatedTaxRate={calculatedTaxRate}
              calculatedTotal={calculatedTotal}
              invoicePaperRef={invoicePaperRef}
            />
          </div>
          <AppModal
            showModal={showDetailsModal}
            setShowModal={setShowDetailsModal}
            label="Invoice Details"
            portalClassName="invoice-details-modal"
            actions={
              <AppButton
                label="Done"
                onClick={() => setShowDetailsModal(false)}
              />
            }
          >
            <div className="details-section">
              <h4>Additional Information</h4>
              <h6>
                Date Created
                <span>{convertClassicDate(invoice?.dateCreated?.toDate())}</span>
              </h6>
              <h6>
                Invoice Status
                <span className="capitalize">{invoice?.status}</span>
              </h6>
              <h6>
                Scheduled Invoice
                <span>Yes</span>
              </h6>
              <h6>
                Invoice is Paid
                <span>{invoice?.isPaid ? 'Yes' : 'No'}</span>
              </h6>
              <h6>
                Invoice sent to client
                <span>{invoice?.isSent ? 'Yes' : 'No'}</span>
              </h6>
              <h6>
                Part of my revenue
                <span>{invoice?.partOfTotal ? 'Yes' : 'No'}</span>
              </h6>
              <h6>
                Client Email
                <span>{invoice?.invoiceTo?.email}</span>
              </h6>
            </div>
            <div className="details-section">
              <h4>Tax Numbers</h4>
              <p>
                <i className="far fa-info-circle" />&nbsp;
                To edit tax numbers visit your invoice settings page <Link to="/settings/invoices?goTo=enterTaxInfo">here</Link>.
              </p>
            </div>
            <div className="details-section">
              <h4>Scheduled Invoices</h4>
              <p>
                <i className="far fa-clock" />&nbsp;
                Editing a scheduled invoice here will not modify the scheduled invoice for future dates and will
                only change what you see for your own records. To edit a scheduled invoice for future dates, please visit
                the scheduled invoices page <Link to="/settings/scheduled-invoices">here</Link>.
              </p>
            </div>
          </AppModal>
          <PDFDownloadLink
            style={{ display: 'none' }}
            className="pdf-download-link"
            document={<PaperDoc />}
            fileName={`${invoice.invoiceNumber}.pdf`}
          >
            {({ loading }) => loading ? 'Loading' : 'PDF Download'}
          </PDFDownloadLink>
        </div> :

        <EmptyPage
          object={invoice}
          label="Invoice Not Found"
          sublabel="This invoice does not exist or was deleted."
          btnLabel='All Invoices'
          btnLink='/invoices'
        />
    )
  }
