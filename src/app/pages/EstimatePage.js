import AppButton from "app/components/ui/AppButton"
import { AppInput, AppTextarea } from "app/components/ui/AppInputs"
import DropdownButton from "app/components/ui/DropdownButton"
import FileUploader from "app/components/ui/FileUploader"
import HelmetTitle from "app/components/ui/HelmetTitle"
import { StoreContext } from "app/store/store"
import { blobToBase64, downloadHtmlElementAsImage } from "app/utils/fileUtils"
import { formatCurrency, validateEmail } from "app/utils/generalUtils"
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from "react-router-dom"
import './styles/InvoicePage.css'
import { useEstimate } from "app/hooks/estimateHooks"
import { deleteEstimateService, sendEstimateService } from "app/services/estimatesServices"
import EstimatePaper from "app/components/estimates/EstimatePaper"
import EmptyPage from "app/components/ui/EmptyPage"
import { errorToast, infoToast, successToast } from "app/data/toastsTemplates"
import { useUserEstimateSettings, useUserNotifSettings } from "app/hooks/userHooks"
import AppModal from "app/components/ui/AppModal"
import { convertClassicDate } from "app/utils/dateUtils"
import { PDFDownloadLink, pdf } from "@react-pdf/renderer"
import EstimatePaperDoc from "app/components/estimates/EstimatePaperDoc"

export default function EstimatePage() {

  const { setPageLoading, myUserID, myUser, setNavItemInfo,
    setToasts } = useContext(StoreContext)
  const [showDownloadMenu, setShowDownloadMenu] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [contactEmail, setContactEmail] = useState('')
  const [emailSubject, setEmailSubject] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [estimateItems, setestimateItems] = useState([])
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const maxFileSize = 1024 * 1024 * 5
  const myBusiness = myUser?.myBusiness
  const taxNumbers = myBusiness?.taxNumbers
  const estimateID = useParams().estimateID
  const estimate = useEstimate(myUserID, estimateID)
  const calculatedSubtotal = estimate?.items?.reduce((acc, item) => (acc + (item.price * item.quantity)), 0)
  const calculatedTotal = estimate?.items?.reduce((acc, item) => (acc + ((item.price + (item.price * item.taxRate / 100)) * item.quantity)), 0)
  const calculatedTaxRate = estimate?.items?.every(item => item.taxRate === estimate?.items[0].taxRate) ? estimate?.items[0].taxRate : null
  const estimatePaperRef = useRef(null)
  const navigate = useNavigate()
  const notifsSettings = useUserNotifSettings(myUserID)
  const estSettings = useUserEstimateSettings(myUserID)

  const allowSendEstimate = estimateItems.length > 0 &&
    validateEmail(contactEmail) &&
    estimate

  const sendEstimate = () => {
    if (!allowSendEstimate) return setToasts(infoToast('Please fill in all fields.'))
    const confirm = estimate?.isSent ? window.confirm('This estimate has already been sent, would you like to send it again?') : true
    if (!confirm) return setToasts(infoToast('Estimate not sent.'))
      pdf(<PaperDoc />).toBlob()
      .then((blob) => {
        blobToBase64(blob)
        .then((base64) => {
          sendEstimateService(
            myUser?.email,
            contactEmail,
            emailSubject,
            emailMessage.replace(/\r\n|\r|\n/g, "</br>"),
            base64,
            `${estimate.estimateNumber}.pdf`,
            uploadedFiles,
            myUserID,
            estimateID,
            estimate.estimateNumber,
            setPageLoading,
            setToasts,
            notifsSettings.showOutgoingEstimateNotifs
          )
        })
        .catch((err) => {
          console.log(err)
          setToasts(errorToast('Error sending invoice. Please try again.'))
        })
      })
  }

  const deleteEstimate = () => {
    deleteEstimateService(myUserID, estimateID, setPageLoading, setToasts, notifsSettings.showOutgoingEstimateNotifs)
  }

  const downloadAsImage = () => {
    downloadHtmlElementAsImage(
      document.querySelector('invoice-paper-container'),
      `${estimate.estimateNumber}.png`,
    )
  }

  const downloadAsPdf = () => {
    // @ts-ignore
    document.querySelector('.pdf-download-link').click()
    setToasts(successToast('PDF Downloaded'))
  }

  const PaperDoc = () => {
    return <EstimatePaperDoc
      estimate={estimate}
      myBusiness={myBusiness}
      taxNumbers={taxNumbers}
      estimateItems={estimateItems}
      calculatedSubtotal={calculatedSubtotal}
      calculatedTaxRate={calculatedTaxRate}
      calculatedTotal={calculatedTotal}
      myUser={myUser}
      estSettings={estSettings}
    />
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
        <h6>Total <span>{estimate?.currency?.symbol}{formatCurrency(estimate?.total?.toFixed(2))}</span></h6>
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
                label="Edit Estimate"
                leftIcon="fas fa-pen"
                onClick={() => navigate(`/estimates/new?estimateID=${estimateID}&edit=true`)}
                buttonType="invertedBtn"
                className="edit-invoice-btn"
              />
              <AppButton
                label="Delete Estimate"
                leftIcon="fas fa-trash"
                buttonType="invertedRedBtn"
                onClick={() => deleteEstimate()}
              />
            </div>
          </div>
          <EstimatePaper
            estimate={estimate}
            myBusiness={myBusiness}
            taxNumbers={taxNumbers}
            estimateItems={estimateItems}
            calculatedSubtotal={calculatedSubtotal}
            calculatedTaxRate={calculatedTaxRate}
            calculatedTotal={calculatedTotal}
            estimatePaperRef={estimatePaperRef}
          />
        </div>
        <AppModal
          showModal={showDetailsModal}
          setShowModal={setShowDetailsModal}
          label="Estimate Details"
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
              <span>{convertClassicDate(estimate?.dateCreated?.toDate())}</span>
            </h6>
            <h6>
              Estimate Status
              <span className="capitalize">{estimate?.status}</span>
            </h6>
            <h6>
              Estimate sent to client
              <span>{estimate?.isSent ? 'Yes' : 'No'}</span>
            </h6>
            <h6>
              Client Email
              <span>{estimate?.estimateTo?.email}</span>
            </h6>
          </div>
          <div className="details-section">
            <h4>Tax Numbers</h4>
            <p>
              <i className="far fa-info-circle" />&nbsp;
              To edit tax numbers visit your invoices settings page <Link to="/settings/invoices?goTo=enterTaxInfo">here</Link>.
            </p>
          </div>
        </AppModal>
        <PDFDownloadLink
          style={{ display: 'none' }}
          className="pdf-download-link"
          document={<PaperDoc />}
          fileName={`${estimate.estimateNumber}.pdf`}
        >
          {({ loading }) => loading ? 'Loading' : 'PDF Download'}
        </PDFDownloadLink>
      </div> :

      <EmptyPage
        object={estimate}
        label="Estimate Not Found"
        sublabel="This estimate does not exist or was deleted."
        btnLabel='All Estimates'
        btnLink='/estimates'
      />
  )
}
