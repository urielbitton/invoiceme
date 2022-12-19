import InvoiceContact from "app/components/invoices/InvoiceContact"
import InvoiceItems from "app/components/invoices/InvoiceItems"
import AppButton from "app/components/ui/AppButton"
import { AppInput, AppSelect, AppTextarea } from "app/components/ui/AppInputs"
import HelmetTitle from "app/components/ui/HelmetTitle"
import PageTitleBar from "app/components/ui/PageTitleBar"
import { currencies } from "app/data/general"
import { errorToast, infoToast, successToast } from "app/data/toastsTemplates"
import { useInvoice } from "app/hooks/invoiceHooks"
import { useUserNotifSettings } from "app/hooks/userHooks"
import { createInvoiceService, deleteInvoiceService,
  updateInvoiceService
} from "app/services/invoiceServices"
import { StoreContext } from "app/store/store"
import { convertDateToInputFormat, convertInputDateToDateAndTimeFormat, 
  dateToMonthName } from "app/utils/dateUtils"
import { formatCurrency } from "app/utils/generalUtils"
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from "react-router-dom"
import './styles/NewInvoicePage.css'

export default function NewInvoicePage() {

  const { myUserID, myUser, setNavItemInfo, setPageLoading,
    setToasts } = useContext(StoreContext)
  const [invoiceName, setInvoiceName] = useState("")
  const [invoiceNumber, setInvoiceNumber] = useState("")
  const [invoiceDate, setInvoiceDate] = useState(convertDateToInputFormat(new Date()))
  const [invoiceDueDate, setInvoiceDueDate] = useState(convertDateToInputFormat(new Date()))
  const [invoiceCurrency, setInvoiceCurrency] = useState(currencies[0])
  const [taxRate1, setTaxRate1] = useState(null)
  const [taxRate2, setTaxRate2] = useState(null)
  const [status, setStatus] = useState('unpaid')
  const [invoiceItems, setInvoiceItems] = useState([])
  const [invoiceContact, setInvoiceContact] = useState(null)
  const [invoiceNotes, setInvoiceNotes] = useState("")
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
  const editInvoiceID = searchParams.get('invoiceID')
  const editInvoice = useInvoice(myUserID, editInvoiceID)
  const navigate = useNavigate()
  const calculatedSubtotal = invoiceItems?.reduce((acc, item) => (acc + (item.price * item.quantity)), 0)
  const calculatedTotal = invoiceItems?.reduce((acc, item) => (acc + ((item.price + (item.price * item.taxRate / 100)) * item.quantity)), 0)
  const notifSettings = useUserNotifSettings(myUserID)

  const allowCreateInvoice = invoiceName &&
    invoiceNumber &&
    invoiceDueDate &&
    invoiceCurrency &&
    invoiceItems &&
    invoiceContact

  const statusOptions = [
    { value: 'unpaid', label: 'Unpaid' },
    { value: 'paid', label: 'Paid' },
    { value: 'partially-paid', label: 'Partially Paid' },
    { value: 'overdue', label: 'Overdue' },
  ]

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
        <span>{invoiceCurrency?.symbol}{formatCurrency(calculatedSubtotal?.toFixed(2))}</span>
      </h6>
      <h6>
        <span>Total</span>
        <strong>
          <span>{invoiceCurrency?.symbol}{formatCurrency(calculatedTotal?.toFixed(2))} {invoiceCurrency?.value}</span>
        </strong>
      </h6>
      <h6>
        <span>Items</span>
        <span>{invoiceItems?.length}</span>
      </h6>
      <h6>
        <span>Bill To</span>
        <span>{invoiceContact?.name}</span>
      </h6>
    </div>
  }

  const createInvoice = () => {
    if (!!!allowCreateInvoice) return setToasts(infoToast("Please fill out all required fields."))
    setPageLoading(true)
    createInvoiceService(
      myUserID, myUser?.myBusiness, myUser?.taxNumbers, invoiceCurrency, invoiceDate, invoiceDueDate, invoiceNumber, invoiceContact,
      invoiceItems, invoiceNotes, taxRate1, taxRate2, calculatedSubtotal,
      calculatedTotal, invoiceName, status, setToasts, notifSettings.showOutgoingInvoicesNotifs
    )
      .then(() => {
        setPageLoading(false)
        navigate('/invoices')
        setToasts(successToast('Invoice created successfully.'))
      })
      .catch(err => {
        setPageLoading(false)
        console.log(err)
        setToasts(errorToast('An error occured while creating invoice.'))
      })
  }

  const updateInvoice = () => {
    if (!!!allowCreateInvoice) return setToasts(infoToast("Please fill out all required fields."))
    const newTotalRevenue = status === 'paid' ?
      !editInvoice?.partOfTotal ?
        myUser?.totalRevenue + calculatedTotal :
        myUser?.totalRevenue :
      editInvoice?.partOfTotal ?
        myUser?.totalRevenue - editInvoice?.total :
        myUser?.totalRevenue
    const updatedProps = {
      title: invoiceName,
      invoiceNumber,
      dateCreated: convertInputDateToDateAndTimeFormat(invoiceDate),
      dateDue: convertInputDateToDateAndTimeFormat(invoiceDueDate),
      currency: invoiceCurrency,
      invoiceTo: invoiceContact,
      items: invoiceItems,
      monthLabel: dateToMonthName(new Date(invoiceDate)),
      notes: invoiceNotes,
      taxRate1,
      taxRate2,
      subtotal: calculatedSubtotal,
      total: calculatedTotal,
      status,
      isPaid: status === 'paid',
      partOfTotal: status === 'paid',
    }
    updateInvoiceService(
      myUserID,
      editInvoiceID,
      updatedProps,
      newTotalRevenue,
      setPageLoading,
      setToasts,
      notifSettings.showOutgoingInvoicesNotifs
    )
    .then(() => {
      navigate(`/invoices/${editInvoiceID}`)
    })
  }

  const deleteInvoice = () => {
    deleteInvoiceService(myUserID, editInvoiceID, setPageLoading, setToasts, notifSettings.showOutgoingInvoicesNotifs)
    .then(() => {
      navigate('/invoices')
    })
  }

  useEffect(() => {
    setNavItemInfo(navItemInfoRender)
    return () => setNavItemInfo(null)
  }, [taxRate1, taxRate2, invoiceItems, invoiceContact, invoiceCurrency])

  useEffect(() => {
    setItemTaxRate(taxRate1 + taxRate2)
  }, [taxRate1, taxRate2])

  useEffect(() => {
    if (editMode) {
      setInvoiceName(editInvoice?.title)
      setInvoiceCurrency(editInvoice?.currency)
      setInvoiceDate(convertDateToInputFormat(editInvoice?.dateCreated?.toDate()))
      setInvoiceDueDate(convertDateToInputFormat(editInvoice?.dateDue?.toDate()))
      setInvoiceNumber(editInvoice?.invoiceNumber)
      setStatus(editInvoice?.status)
      setInvoiceContact(editInvoice?.invoiceTo)
      setInvoiceItems(editInvoice?.items)
      setInvoiceNotes(editInvoice?.notes)
      setTaxRate1(editInvoice?.taxRate1)
      setTaxRate2(editInvoice?.taxRate2)
    }
  }, [editMode, editInvoice])

  return (
    <div className="new-invoice-page">
      <HelmetTitle title={!editMode ? 'Create New Invoice' : 'Edit Invoice'} />
      <PageTitleBar
        title={!editMode ? 'Create An Invoice' : 'Edit Invoice'}
        hasBorder
      />
      <div className="page-content">
        <form onSubmit={(e) => e.preventDefault()}>
          <AppInput
            label="Invoice Name"
            placeholder="Monthly consulting services"
            value={invoiceName}
            onChange={(e) => setInvoiceName(e.target.value)}
          />
          <AppInput
            label="Invoice Number"
            placeholder="91288349"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            iconleft={
              <div className="icon-container">
                <span>INV-</span>
              </div>
            }
            className="icon-input"
          />
          <div className="split-row">
            <AppInput
              label="Invoice Date"
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="date-input"
            />
            <AppInput
              label="Due Date"
              type="date"
              value={invoiceDueDate}
              onChange={(e) => setInvoiceDueDate(e.target.value)}
              className="date-input"
            />
          </div>
          <AppSelect
            label="Currency"
            options={currencies}
            value={invoiceCurrency}
            onChange={(e) => setInvoiceCurrency(currencies.find(currency => currency.value === e.target.value))}
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
          <AppSelect
            label="Status"
            options={statusOptions}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
          <AppTextarea
            label="Notes"
            placeholder="Enter any notes you want to include on the invoice"
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
          invoiceContact={invoiceContact}
          setInvoiceContact={setInvoiceContact}
        />
      </div>
      <div className="btn-group">
        <AppButton
          label={!editMode ? 'Create Invoice' : 'Update Invoice'}
          onClick={!editMode ? createInvoice : updateInvoice}
        />
        {
          editMode &&
          <>
            <AppButton
              label="Delete Invoice"
              onClick={deleteInvoice}
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
