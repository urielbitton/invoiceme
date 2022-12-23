import { currencies, timeOfDaysOptions } from "app/data/general"
import { useScheduledInvoice, useUserScheduledInvoices } from "app/hooks/invoiceHooks"
import { StoreContext } from "app/store/store"
import { pdf } from '@react-pdf/renderer'
import {
  convertDateToInputFormat, convertInputDateToDateAndTimeFormat,
  dayOfMonthNumbers
} from "app/utils/dateUtils"
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from "react-router-dom"
import InvoiceContact from "../invoices/InvoiceContact"
import InvoiceItems from "../invoices/InvoiceItems"
import AppButton from "../ui/AppButton"
import { AppInput, AppSelect, AppSwitch, AppTextarea } from "../ui/AppInputs"
import SlideContainer from "../ui/SlideContainer"
import SlideElement from "../ui/SlideElement"
import SettingsTitles from "./SettingsTitles"
import firebase from 'firebase'
import {
  formatCurrency, formatPhoneNumber,
  truncateText
} from "app/utils/generalUtils"
import './styles/CreateScheduledInvoice.css'
import InvoicePreviewModal from "../invoices/InvoicePreviewModal"
import ProContent from "../ui/ProContent"
import {
  createScheduledInvoiceService, deleteScheduledInvoiceService,
  updateScheduledInvoiceService
} from "app/services/invoiceServices"
import { errorToast, infoToast, successToast } from "app/data/toastsTemplates"
import { useUserInvoiceSettings, useUserNotifSettings } from "app/hooks/userHooks"
import InvoicePaperDoc from "../invoices/InvoicePaperDoc"
import { blobToBase64 } from "app/utils/fileUtils"
import { displayThStNdRd } from "app/utils/dateUtils"
import PreventTabClose from "../ui/PreventTabClose"

export default function CreateScheduledInvoice() {

  const { myUserID, myUser, setPageLoading, myMemberType,
    setToasts } = useContext(StoreContext)
  const [slidePosition, setSlidePosition] = useState(0)
  const [scheduleTitle, setScheduleTitle] = useState('')
  const [invoiceTitle, setInvoiceTitle] = useState('')
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [invoiceCurrency, setInvoiceCurrency] = useState(currencies[0])
  const [invoiceNotes, setInvoiceNotes] = useState('')
  const [taxRate1, setTaxRate1] = useState(0)
  const [taxRate2, setTaxRate2] = useState(0)
  const [invoiceItems, setInvoiceItems] = useState([])
  const [itemName, setItemName] = useState("")
  const [itemPrice, setItemPrice] = useState(0)
  const [itemQuantity, setItemQuantity] = useState(1)
  const [itemTaxRate, setItemTaxRate] = useState(0)
  const [editItemID, setEditItemID] = useState(null)
  const [invoiceContact, setInvoiceContact] = useState(null)
  const [dayOfMonth, setDayOfMonth] = useState(1)
  const [timeOfDay, setTimeOfDay] = useState(timeOfDaysOptions[0].value)
  const [emailMessage, setEmailMessage] = useState('')
  const [emailSubject, setEmailSubject] = useState('')
  const [contactName, setContactName] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [contactAddress, setContactAddress] = useState("")
  const [contactCity, setContactCity] = useState("")
  const [contactRegion, setContactRegion] = useState("")
  const [contactPostcode, setContactPostcode] = useState("")
  const [contactCountry, setContactCountry] = useState("")
  const [contactImg, setContactImg] = useState("")
  const [showInvoicePreview, setShowInvoicePreview] = useState(false)
  const [invoiceData, setInvoiceData] = useState(null)
  const [activeSchedule, setActiveSchedule] = useState(true)
  const userScheduledInvoices = useUserScheduledInvoices(myUserID)
  const [searchParams, setSearchParams] = useSearchParams()
  const editMode = searchParams.get('edit') === 'true'
  const editInvoiceID = searchParams.get('scheduleID')
  const paramViewMode = searchParams.get('mode') === 'view'
  const editSchedule = useScheduledInvoice(myUserID, editInvoiceID)
  const navigate = useNavigate()
  const numOfSlides = 4
  const calculatedSubtotal = invoiceItems?.reduce((acc, item) => (acc + (item?.price * item?.quantity)), 0)
  const calculatedTotal = invoiceItems?.reduce((acc, item) => (acc + ((item?.price + (item?.price * item?.taxRate / 100)) * item?.quantity)), 0)
  const calculatedTaxRate = invoiceItems?.every(item => item?.taxRate === invoiceItems[0]?.taxRate) ? invoiceItems[0]?.taxRate : null
  const invoicePaperRef = useRef(null)
  const dayOfMonthOptions = dayOfMonthNumbers()
  const maxScheduledInvoicesNum = 5
  const notifSettings = useUserNotifSettings(myUserID)
  const invSettings = useUserInvoiceSettings(myUserID)

  const creatingSchedule = invoiceTitle.length || 
  scheduleTitle.length || 
  invoiceNumber.length || 
  invoiceCurrency.length || 
  invoiceNotes.length || 
  invoiceItems.length || 
  invoiceContact || 
  dayOfMonth || 
  timeOfDay || 
  emailMessage.length || 
  emailSubject.length || 
  activeSchedule

  const invoice = {
    invoiceNumber,
    dateCreated: firebase.firestore.Timestamp.fromDate(new Date()),
    dateDue: firebase.firestore.Timestamp.fromDate(new Date()),
    invoiceTo: invoiceContact,
    currency: invoiceCurrency,
    notes: invoiceNotes,
    myBusiness: myUser?.myBusiness,
    items: invoiceItems,
    taxRate1,
    taxRate2,
    subtotal: calculatedSubtotal,
    total: calculatedTotal,
  }

  const PDFDoc = () => {
    return <InvoicePaperDoc
      invoice={invoice}
      myBusiness={invoice?.myBusiness}
      taxNumbers={myUser?.taxNumbers}
      invoiceItems={invoiceItems}
      calculatedSubtotal={calculatedSubtotal}
      calculatedTaxRate={calculatedTaxRate}
      calculatedTotal={calculatedTotal}
      myUser={myUser}
      invSettings={invSettings}
    />
  }

  const allowSlide2 = invoiceTitle?.length > 0 &&
    invoiceNumber?.length > 0 &&
    invoiceItems?.length > 0

  const allowSlide3 = !!invoiceContact

  const allowSlide4 = scheduleTitle?.length > 0 &&
    emailSubject?.length > 0 &&
    emailMessage?.length > 0

  const allowCreateSchedule = scheduleTitle &&
    invoiceTitle &&
    invoiceNumber &&
    invoiceCurrency &&
    invoiceContact &&
    invoiceItems?.length > 0 &&
    dayOfMonth &&
    timeOfDay &&
    emailMessage &&
    emailSubject

  const handleNextSlide = () => {
    if (slidePosition === 0) {
      allowSlide2 ? setSlidePosition(slidePosition + 1) :
        setToasts(infoToast('Please add an invoice name, number and at least one item.'))
    }
    else if (slidePosition === 1) {
      allowSlide3 ? setSlidePosition(slidePosition + 1) :
        setToasts(infoToast('Please select a contact'))
    }
    else if (slidePosition === 2) {
      allowSlide4 ? setSlidePosition(slidePosition + 1) :
        setToasts(infoToast('Please add a schedule title, email subject and message'))
    }
    else {
      slidePosition < numOfSlides - 1 && setSlidePosition(slidePosition + 1)
    }
  }

  const slideNav = <div className="slide-nav">
    <AppButton
      label="Back"
      leftIcon="fal fa-arrow-left"
      buttonType="invertedBtn"
      onClick={() => slidePosition > 0 && setSlidePosition(slidePosition - 1)}
      disabled={slidePosition === 0}
    />
    <AppButton
      label="Next"
      rightIcon="fal fa-arrow-right"
      buttonType="invertedBtn"
      onClick={() => handleNextSlide()}
      disabled={slidePosition === numOfSlides - 1}
    />
  </div>

  const showPreview = () => {
    setShowInvoicePreview(true)
    setInvoiceData({
      invoice: editSchedule?.invoiceTemplate || invoice,
      taxNumbers: editSchedule?.invoiceTemplate?.taxNumbers,
      items: editSchedule?.invoiceTemplate?.items || invoiceItems,
      taxRate1: editSchedule?.invoiceTemplate?.taxRate1 || taxRate1,
      taxRate2: editSchedule?.invoiceTemplate?.taxRate2 || taxRate2,
      subtotal: editSchedule?.invoiceTemplate?.subTotal || calculatedSubtotal,
      total: editSchedule?.invoiceTemplate?.total || calculatedTotal
    })
  }

  const createScheduledInvoice = () => {
    const confirm = window.confirm(`Are you sure you want to create this scheduled invoice? `+
    `It will be sent automatically every ${displayThStNdRd(+dayOfMonth)} of the month at `+
     `${timeOfDaysOptions?.find(time => time.value === timeOfDay).label}.`)
    if (!confirm) return setToasts(infoToast('Scheduled invoice not created.'))
    if (!!!allowCreateSchedule)
      return setToasts(infoToast("Please fill in all required fields."))
    if (userScheduledInvoices?.length > (maxScheduledInvoicesNum - 1))
      return setToasts(errorToast(`You can only have ${maxScheduledInvoicesNum} scheduled invoices at a time.`))
    setPageLoading(true)
    pdf(<PDFDoc />).toBlob()
      .then((blob) => {
        blobToBase64(blob)
          .then((base64) => {
            return createScheduledInvoiceService(
              myUser,
              invoiceNumber,
              invoiceCurrency,
              invoiceContact,
              invoiceItems,
              invoiceNotes,
              calculatedSubtotal,
              taxRate1,
              taxRate2,
              invoiceTitle,
              calculatedTotal,
              dayOfMonth,
              timeOfDay,
              scheduleTitle,
              emailSubject,
              emailMessage,
              activeSchedule,
              base64,
              notifSettings.showScheduleNotifs,
              setPageLoading
            )
              .then(() => {
                setPageLoading(false)
                setToasts(successToast('Scheduled Invoice Created.'))
                navigate('/settings/scheduled-invoices')
              })
              .catch(err => {
                setPageLoading(false)
                console.log(err)
                setToasts(errorToast('Error creating scheduled invoice. Please try again. If the problem persists, please contact us for assistance.'))
              })
          })
      })
  }

  const updateScheduledInvoice = () => {
    updateScheduledInvoiceService(
      editInvoiceID,
      {
        ...editSchedule,
        isActive: activeSchedule,
        dayOfMonth: +dayOfMonth,
        timeOfDay: +timeOfDay,
        title: scheduleTitle,
        emailSubject,
        emailMessage,
        invoiceTemplate: {
          ...editSchedule?.invoiceTemplate,
          title: invoiceTitle,
          invoiceNumber,
          invoiceOwnerID: myUserID,
          dateCreated: firebase.firestore.Timestamp.fromDate(new Date()),
          dateDue: firebase.firestore.Timestamp.fromDate(new Date()),
          invoiceTo: invoiceContact,
          currency: invoiceCurrency,
          myBusiness: myUser?.myBusiness,
          notes: invoiceNotes,
          taxRate1: +taxRate1,
          taxRate2: +taxRate2,
          items: invoiceItems,
          subtotal: +calculatedSubtotal,
          total: +calculatedTotal
        }
      },
      setPageLoading,
      notifSettings.showScheduleNotifs
    )
      .then(() => {
        setToasts(successToast('Scheduled Invoice Updated.'))
        navigate('/settings/scheduled-invoices')
      })
  }

  const deleteScheduledInvoice = () => {
    deleteScheduledInvoiceService(
      myUserID,
      editInvoiceID,
      setPageLoading,
      setToasts,
      notifSettings.showScheduleNotifs
    )
      .then(() => {
        navigate('/settings/scheduled-invoices')
      })
  }

  useEffect(() => {
    if (!editMode) return
    if (!editSchedule) return
    setInvoiceTitle(editSchedule.invoiceTemplate.title)
    setInvoiceNumber(editSchedule.invoiceTemplate.invoiceNumber)
    setInvoiceContact(editSchedule.invoiceTemplate.invoiceTo)
    setInvoiceItems(editSchedule.invoiceTemplate.items)
    setInvoiceNotes(editSchedule.invoiceTemplate.notes)
    setTaxRate1(editSchedule.invoiceTemplate.taxRate1)
    setTaxRate2(editSchedule.invoiceTemplate.taxRate2)
    setInvoiceCurrency(editSchedule.invoiceTemplate.currency)
    setScheduleTitle(editSchedule.title)
    setEmailSubject(editSchedule.emailSubject)
    setEmailMessage(editSchedule.emailMessage)
    setDayOfMonth(editSchedule.dayOfMonth)
    setTimeOfDay(editSchedule.timeOfDay)
    setActiveSchedule(editSchedule.isActive)
  }, [editSchedule, editMode])

  useEffect(() => {
    if (paramViewMode)
      setSlidePosition(3)
  }, [])

  return (
    myMemberType === 'business' ?
      (editMode ? editSchedule?.ownerID === myUserID : true) ?
        <div className="settings-sub-page create-scheduled-page">
          <SettingsTitles
            label="Create a scheduled invoice"
            sublabel="Create an automated invoice that will be sent to your chosen contact on a recurring schedule."
            icon="fas fa-calendar-alt"
          />
          <div className="page-content">
            <SlideContainer>
              <SlideElement
                index={0}
                slidePosition={slidePosition}
              >
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="form-title">
                    <h4>Invoice Template</h4>
                    <h6>Create an invoice template for your scheduled invoice.</h6>
                  </div>
                  <AppInput
                    label="Invoice Name"
                    value={invoiceTitle}
                    onChange={(e) => setInvoiceTitle(e.target.value)}
                  />
                  <AppInput
                    label="Invoice Number"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    iconright={
                      <div className="icon-container">
                        <span>INV</span>
                      </div>
                    }
                    className="icon-input"
                  />
                  <AppSelect
                    label="Currency"
                    options={currencies}
                    value={invoiceCurrency}
                    onChange={(e) => setInvoiceCurrency(currencies.find(currency => currency.value === e.target.value))}
                  />
                  <div className="split-row">
                    <AppInput
                      label="Tax Rate 1"
                      type="number"
                      value={taxRate1}
                      onChange={(e) => setTaxRate1(e.target.value)}
                      iconright={
                        <div className="icon-container">
                          <i className="fas fa-percent" />
                        </div>
                      }
                      className="icon-input"
                    />
                    <AppInput
                      label="Tax Rate 2"
                      type="number"
                      value={taxRate2}
                      onChange={(e) => setTaxRate2(e.target.value)}
                      iconright={
                        <div className="icon-container">
                          <i className="fas fa-percent" />
                        </div>
                      }
                      className="icon-input"
                    />
                  </div>
                  <AppTextarea
                    label="Notes"
                    value={invoiceNotes}
                    onChange={(e) => setInvoiceNotes(e.target.value)}
                  />
                </form>
                <InvoiceItems
                  itemName={itemName}
                  setItemName={setItemName}
                  itemPrice={itemPrice}
                  setItemPrice={setItemPrice}
                  itemTaxRate={itemTaxRate}
                  setItemTaxRate={setItemTaxRate}
                  itemQuantity={itemQuantity}
                  setItemQuantity={setItemQuantity}
                  invoiceCurrency={invoiceCurrency}
                  editItemID={editItemID}
                  setEditItemID={setEditItemID}
                  invoiceItems={invoiceItems}
                  setInvoiceItems={setInvoiceItems}
                />
              </SlideElement>
              <SlideElement
                index={1}
                slidePosition={slidePosition}
              >
                <div className="form-title">
                  <h4>Invoice Contact</h4>
                  <h6>Choose a contact to send your scheduled invoice to.</h6>
                </div>
                <InvoiceContact
                  contactName={contactName}
                  setContactName={setContactName}
                  contactEmail={contactEmail}
                  setContactEmail={setContactEmail}
                  contactPhone={contactPhone}
                  setContactPhone={setContactPhone}
                  contactAddress={contactAddress}
                  setContactAddress={setContactAddress}
                  contactCity={contactCity}
                  setContactCity={setContactCity}
                  contactRegion={contactRegion}
                  setContactRegion={setContactRegion}
                  contactPostcode={contactPostcode}
                  setContactPostcode={setContactPostcode}
                  contactCountry={contactCountry}
                  setContactCountry={setContactCountry}
                  contactImg={contactImg}
                  setContactImg={setContactImg}
                  invoiceContact={invoiceContact}
                  setInvoiceContact={setInvoiceContact}
                />
              </SlideElement>
              <SlideElement
                index={2}
                slidePosition={slidePosition}
              >
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="form-title">
                    <h4>Schedule Details</h4>
                    <h6>Create your customized schedule.</h6>
                  </div>
                  <AppInput
                    label="Schedule Name"
                    value={scheduleTitle}
                    onChange={(e) => setScheduleTitle(e.target.value)}
                  />
                  <AppSelect
                    label="Day of The Month"
                    options={dayOfMonthOptions}
                    value={dayOfMonth}
                    onChange={(e) => setDayOfMonth(+e.target.value)}
                  />
                  <AppSelect
                    label="Time of Day"
                    options={timeOfDaysOptions}
                    value={timeOfDay}
                    onChange={(e) => setTimeOfDay(+timeOfDaysOptions?.find(time => time.value === +e.target.value).value)}
                  />
                  <AppInput
                    label="Email Subject"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                  />
                  <AppTextarea
                    label="Email Message"
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                  />
                </form>
              </SlideElement>
              <SlideElement
                index={3}
                slidePosition={slidePosition}
              >
                <div
                  onSubmit={(e) => e.preventDefault()}
                  className="review-form"
                >
                  <div className="form-title">
                    <h4>Review Automated Invoice Details</h4>
                    <h6>Make sure the information is correct before creating your automated invoice.</h6>
                  </div>
                  <div className="section">
                    <h5>Scheduled invoice is&nbsp;
                      <span className={!activeSchedule ? 'inactive' : ''}>
                        {activeSchedule ? 'active' : 'inactive'}
                      </span>
                    </h5>
                    <AppSwitch
                      checked={activeSchedule}
                      onChange={(e) => setActiveSchedule(e.target.checked)}
                    />
                  </div>
                  <div className="section">
                    <h5>
                      Invoice Template
                      <i
                        className="fas fa-pen"
                        onClick={() => setSlidePosition(0)}
                      />
                    </h5>
                    <h6>
                      <span>Invoice Name: </span>
                      {invoiceTitle}
                    </h6>
                    <h6>
                      <span>Invoice Total: </span>
                      {invoiceCurrency.symbol}{formatCurrency(calculatedTotal.toFixed(2))}
                    </h6>
                    <small
                      className="underline bold"
                      onClick={() => showPreview()}
                    >Preview Invoice</small>
                  </div>
                  <div className="section">
                    <h5>
                      Invoice Contact
                      <i
                        className="fas fa-pen"
                        onClick={() => setSlidePosition(1)}
                      />
                    </h5>
                    <h6>
                      <img src={invoiceContact?.photoURL} />
                      <span>Name: </span>{invoiceContact?.name}<br />
                      <span>Email: </span>{invoiceContact?.email}<br />
                      <span>Phone: </span>{formatPhoneNumber(invoiceContact?.phone)}<br />
                      <span>Address: </span>{invoiceContact?.address}<br />
                      <span>Location: </span>{invoiceContact?.city}, {invoiceContact?.region}, {invoiceContact?.country} {invoiceContact?.postcode}<br />
                    </h6>
                  </div>
                  <div className="section">
                    <h5>
                      Schedule Details
                      <i
                        className="fas fa-pen"
                        onClick={() => setSlidePosition(2)}
                      />
                    </h5>
                    <h6>
                      <span>Shedule Title: </span>
                      {scheduleTitle}
                    </h6>
                    <h6>
                      <span>Day of the Month: </span>
                      {dayOfMonth}
                    </h6>
                    <h6>
                      <span>Time of Day: </span>
                      {timeOfDay}
                    </h6>
                    <h6>
                      <span>Email Subject: </span>
                      {emailSubject}
                    </h6>
                    <h6>
                      <span>Email Message:</span><br />
                    </h6>
                    <p>{truncateText(emailMessage, 100)}</p>
                  </div>
                  <div className="btn-group">
                    {
                      !editMode ?
                        <AppButton
                          label="Create Scheduled Invoice"
                          onClick={createScheduledInvoice}
                          rightIcon="far fa-arrow-right"
                        /> :
                        <>
                          <AppButton
                            label="Save Changes"
                            onClick={updateScheduledInvoice}
                          />
                          <AppButton
                            label="Delete Scheduled Invoice"
                            onClick={deleteScheduledInvoice}
                            buttonType="invertedRedBtn"
                          />
                        </>
                    }
                  </div>
                </div>
              </SlideElement>
              {slideNav}
            </SlideContainer>
            <PreventTabClose preventClose={creatingSchedule} />
          </div>
          <InvoicePreviewModal
            invoiceData={invoiceData}
            showInvoicePreview={showInvoicePreview}
            setShowInvoicePreview={setShowInvoicePreview}
            invoicePaperRef={invoicePaperRef}
            isSchedule
          />
        </div> :
        <>You do not have access to view this page</> :
      <ProContent />
  )
}
