import InvoiceContact from "app/components/invoices/InvoiceContact"
import InvoiceItems from "app/components/invoices/InvoiceItems"
import AppButton from "app/components/ui/AppButton"
import { AppInput, AppSelect, AppTextarea } from "app/components/ui/AppInputs"
import HelmetTitle from "app/components/ui/HelmetTitle"
import PageTitleBar from "app/components/ui/PageTitleBar"
import { currencies } from "app/data/general"
import { errorToast, infoToast, successToast } from "app/data/toastsTemplates"
import { useEstimate } from "app/hooks/estimateHooks"
import { useUserEstimateSettings } from "app/hooks/userHooks"
import { createEstimateService, deleteEstimateService,
  updateEstimateService
} from "app/services/estimatesServices"
import { StoreContext } from "app/store/store"
import { convertDateToInputFormat, convertInputDateToDateAndTimeFormat, dateToMonthName } from "app/utils/dateUtils"
import { formatCurrency } from "app/utils/generalUtils"
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from "react-router-dom"
import './styles/NewInvoicePage.css'

export default function NewEstimatePage() {

  const { myUserID, myUser, setNavItemInfo, setPageLoading,
    setToasts } = useContext(StoreContext)
  const [estimateName, setEstimateName] = useState("")
  const [estimateNumber, setEstimateNumber] = useState("")
  const [estimateDate, setEstimateDate] = useState(convertDateToInputFormat(new Date()))
  const [estimateDueDate, setEstimateDueDate] = useState(convertDateToInputFormat(new Date()))
  const [estimateCurrency, setEstimateCurrency] = useState(currencies[0])
  const [taxRate1, setTaxRate1] = useState(null)
  const [taxRate2, setTaxRate2] = useState(null)
  const [status, setStatus] = useState('unpaid')
  const [estimateItems, setEstimateItems] = useState([])
  const [estimateContact, setEstimateContact] = useState(null)
  const [estimateNotes, setEstimateNotes] = useState("")
  const [itemName, setItemName] = useState("")
  const [itemPrice, setItemPrice] = useState(0)
  const [itemQuantity, setItemQuantity] = useState(1)
  const [itemTaxRate, setItemTaxRate] = useState(0)
  const [editItemID, setEditItemID] = useState(null)
  const [contactName, setContactName] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [contactAddress, setContactAddress] = useState("")
  const [contactCity, setContactCity] = useState("")
  const [contactRegion, setContactRegion] = useState("")
  const [contactCountry, setContactCountry] = useState("")
  const [contactPostcode, setContactPostcode] = useState("")
  const [searchParams, setSearchParams] = useSearchParams()
  const editMode = searchParams.get('edit') === 'true'
  const editEstimateID = searchParams.get('estimateID')
  const editEstimate = useEstimate(myUserID, editEstimateID)
  const navigate = useNavigate()
  const calculatedSubtotal = estimateItems?.reduce((acc, item) => (acc + (item.price * item.quantity)), 0)
  const calculatedTotal = estimateItems?.reduce((acc, item) => (acc + ((item.price + (item.price * item.taxRate / 100)) * item.quantity)), 0)
  const estSettings = useUserEstimateSettings(myUserID)

  const allowCreateEstimate = estimateName?.length > 0 &&
    estimateNumber?.length > 0 &&
    estimateDueDate?.length > 0 &&
    estimateCurrency &&
    estimateItems?.length > 0 &&
    estimateContact

  const navItemInfoRender = {
    label: <small
      onClick={() => navigate(-1)}
      className="go-back"
    >
      <i className="fal fa-arrow-left" />Back
    </small>,
    sublabel: <div className="numbers-table">
      <h6>
        <span>Tax</span>
        <span>{(taxRate1 + taxRate2)?.toFixed(2)}%</span>
      </h6>
      <h6>
        <span>Subtotal</span>
        <span>{estimateCurrency?.symbol}{formatCurrency(calculatedSubtotal?.toFixed(2))}</span>
      </h6>
      <h6>
        <span>Total</span>
        <strong>
          <span>{estimateCurrency?.symbol}{formatCurrency(calculatedTotal?.toFixed(2))} {estimateCurrency?.value}</span>
        </strong>
      </h6>
      <h6>
        <span>Items</span>
        <span>{estimateItems?.length}</span>
      </h6>
      <h6>
        <span>Bill To</span>
        <span>{estimateContact?.name}</span>
      </h6>
    </div>
  }

  const createEstimate = () => {
    if (!allowCreateEstimate) return setToasts(infoToast("Please fill out all required fields."))
    setPageLoading(true)
    createEstimateService(
      myUserID, myUser?.myBusiness, myUser?.taxNumbers, estimateCurrency, estimateDate, estimateDueDate, estimateNumber, estimateContact,
      estimateItems, estimateNotes, taxRate1, taxRate2, calculatedSubtotal,
      calculatedTotal, estimateName, estSettings.showEstimateNotifs
    )
      .then(() => {
        setPageLoading(false)
        navigate('/estimates')
        setToasts(successToast('Estimate created successfully.'))
      })
      .catch(err => {
        setPageLoading(false)
        console.log(err)
        setToasts(errorToast('Error creating estimate.'))
      })
  }

  const updateEstimate = () => {
    if (!allowCreateEstimate) return setToasts(infoToast("Please fill out all required fields."))
    const updatedProps = {
      title: estimateName,
      estimateNumber,
      dateCreated: convertInputDateToDateAndTimeFormat(estimateDate),
      dateDue: convertInputDateToDateAndTimeFormat(estimateDueDate),
      currency: estimateCurrency,
      estimateTo: estimateContact,
      items: estimateItems,
      monthLabel: dateToMonthName(new Date(estimateDate)),
      notes: estimateNotes,
      taxRate1,
      taxRate2,
      subtotal: calculatedSubtotal,
      total: calculatedTotal,
    }
    updateEstimateService(
      myUserID,
      editEstimateID,
      updatedProps,
      setPageLoading,
      setToasts,
      estSettings.showEstimateNotifs
    )
      .then(() => {
        navigate(`/estimates/${editEstimateID}`)
      })
  }

  const deleteEstimate = () => {
    deleteEstimateService(myUserID, editEstimateID, setPageLoading, setToasts, estSettings.showEstimateNotifs)
      .then(() => {
        navigate('/estimates')
      })
  }

  useEffect(() => {
    setNavItemInfo(navItemInfoRender)
    return () => setNavItemInfo(null)
  }, [taxRate1, taxRate2, estimateItems, estimateContact, estimateCurrency])

  useEffect(() => {
    setItemTaxRate(taxRate1 + taxRate2)
  }, [taxRate1, taxRate2])

  useEffect(() => {
    if (editMode) {
      setEstimateName(editEstimate?.title)
      setEstimateCurrency(editEstimate?.currency)
      setEstimateDate(convertDateToInputFormat(editEstimate?.dateCreated?.toDate()))
      setEstimateDueDate(convertDateToInputFormat(editEstimate?.dateDue?.toDate()))
      setEstimateNumber(editEstimate?.estimateNumber)
      setStatus(editEstimate?.status)
      setEstimateContact(editEstimate?.estimateTo)
      setEstimateItems(editEstimate?.items)
      setEstimateNotes(editEstimate?.notes)
      setTaxRate1(editEstimate?.taxRate1)
      setTaxRate2(editEstimate?.taxRate2)
    }
  }, [editMode, editEstimate])

  return (
    <div className="new-invoice-page">
      <HelmetTitle title={!editMode ? 'Create New Estimate' : 'Edit Estimate'} />
      <PageTitleBar
        title={!editMode ? 'Create An Estimate' : 'Edit Estimate'}
        hasBorder
      />
      <div className="page-content">
        <form onSubmit={(e) => e.preventDefault()}>
          <AppInput
            label="Estimate Name"
            placeholder="Montly consulting services"
            value={estimateName}
            onChange={(e) => setEstimateName(e.target.value)}
          />
          <AppInput
            label="Estimate Number"
            placeholder="91288349"
            value={estimateNumber}
            onChange={(e) => setEstimateNumber(e.target.value)}
            iconleft={
              <div className="icon-container">
                <span>EST-</span>
              </div>
            }
            className="icon-input"
          />
          <div className="split-row">
            <AppInput
              label="Estimate Date"
              type="date"
              value={estimateDate}
              onChange={(e) => setEstimateDate(e.target.value)}
              className="date-input"
            />
            <AppInput
              label="Due Date"
              type="date"
              value={estimateDueDate}
              onChange={(e) => setEstimateDate(e.target.value)}
              className="date-input"
            />
          </div>
          <AppSelect
            label="Currency"
            options={currencies}
            value={estimateCurrency}
            onChange={(e) => setEstimateCurrency(currencies.find(currency => currency.value === e.target.value))}
          />
          <div className="split-row">
            <AppInput
              label="Tax Rate 1"
              placeholder="5"
              type="number"
              value={taxRate1}
              onChange={(e) => setTaxRate1(+e.target.value)}
              iconleft={
                <div className="icon-container">
                  <i className="fal fa-percent" />
                </div>
              }
              className="icon-input"
            />
            <AppInput
              label="Tax Rate 2"
              placeholder="10"
              type="number"
              value={taxRate2}
              onChange={(e) => setTaxRate2(+e.target.value)}
              iconleft={
                <div className="icon-container">
                  <i className="fal fa-percent" />
                </div>
              }
              className="icon-input"
            />
          </div>
          <AppTextarea
            label="Notes"
            placeholder="Enter any notes you want to include on the estimate"
            value={estimateNotes}
            onChange={(e) => setEstimateNotes(e.target.value)}
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
          invoiceCurrency={estimateCurrency}
          editItemID={editItemID}
          setEditItemID={setEditItemID}
          invoiceItems={estimateItems}
          setInvoiceItems={setEstimateItems}
          title="Estimate"
        />
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
          invoiceContact={estimateContact}
          setInvoiceContact={setEstimateContact}
        />
      </div>
      <div className="btn-group">
        <AppButton
          label={!editMode ? 'Create Estimate' : 'Update Estimate'}
          onClick={!editMode ? createEstimate : updateEstimate}
        />
        {
          editMode &&
          <>
            <AppButton
              label="Delete Estimate"
              onClick={deleteEstimate}
              buttonType="invertedRedBtn"
            />
            <AppButton
              label="Cancel"
              onClick={() => navigate(-1)}
              buttonType="invertedBtn"
            />
          </>
        }
      </div>
    </div>
  )
}
