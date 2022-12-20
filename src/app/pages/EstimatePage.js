import AppButton from "app/components/ui/AppButton"
import { AppInput, AppTextarea } from "app/components/ui/AppInputs"
import DropdownButton from "app/components/ui/DropdownButton"
import FileUploader from "app/components/ui/FileUploader"
import HelmetTitle from "app/components/ui/HelmetTitle"
import { StoreContext } from "app/store/store"
import { domToPDFDownload, downloadHtmlElementAsImage } from "app/utils/fileUtils"
import { formatCurrency, validateEmail } from "app/utils/generalUtils"
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom"
import './styles/InvoicePage.css'
import { useEstimate } from "app/hooks/estimateHooks"
import { deleteEstimateService, sendEstimateService } from "app/services/estimatesServices"
import EstimatePaper from "app/components/estimates/EstimatePaper"
import EmptyPage from "app/components/ui/EmptyPage"
import { infoToast } from "app/data/toastsTemplates"
import { useUserEstimateSettings } from "app/hooks/userHooks"
import AppModal from "app/components/ui/AppModal"
import { convertClassicDate } from "app/utils/dateUtils"

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
  const estSettings = useUserEstimateSettings(myUserID)

  const allowSendEstimate = estimateItems.length > 0 &&
    validateEmail(contactEmail) &&
    estimate

  const sendEstimate = () => {
    if (!allowSendEstimate) return setToasts(infoToast('Please fill in all fields.'))
    const confirm = estimate?.isSent ? window.confirm('This estimate has already been sent, would you like to send it again?') : true
    if (confirm) {
      sendEstimateService(
        myUser?.email,
        contactEmail,
        emailSubject,
        emailMessage.replace(/\r\n|\r|\n/g, "</br>"),
        document.querySelector('.invoice-page .invoice-paper-container'),
        `${estimate.estimateNumber}.pdf`,
        uploadedFiles,
        myUserID,
        estimateID,
        estimate.estimateNumber,
        setPageLoading,
        setToasts,
        estSettings.showOutgoingEstimateNotifs
      )
    }
  }

  const deleteEstimate = () => {
    deleteEstimateService(myUserID, estimateID, setPageLoading, setToasts, estSettings.showOutgoingEstimateNotifs)
  }

  const downloadAsPDF = () => {
    domToPDFDownload(
      document.querySelector('.invoice-page .invoice-paper-container'),
      `${estimate.estimateNumber}.pdf`,
      true
    )
  }

  const downloadAsImage = () => {
    downloadHtmlElementAsImage(
      document.querySelector('invoice-paper-container'),
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
              To edit tax numbers for this estimate only, hover over the tax numbers 
              on the estimate sheet on this page and type a new value.
            </p>
          </div>
        </AppModal>
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
