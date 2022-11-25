import { contactsIndex } from "app/algolia"
import AddContactModal from "app/components/contacts/AddContactModal"
import AppButton from "app/components/ui/AppButton"
import { AppInput, AppSelect, AppTextarea } from "app/components/ui/AppInputs"
import AppPagination from "app/components/ui/AppPagination"
import AppTable from "app/components/ui/AppTable"
import ContactRow from "app/components/ui/ContactRow"
import HelmetTitle from "app/components/ui/HelmetTitle"
import IconContainer from "app/components/ui/IconContainer"
import PageTitleBar from "app/components/ui/PageTitleBar"
import { currencies } from "app/data/general"
import { useFavoriteContacts } from "app/hooks/contactsHooks"
import { useEstimate } from "app/hooks/estimateHooks"
import { useInstantSearch } from "app/hooks/searchHooks"
import { addContactService } from "app/services/contactsServices"
import { getRandomDocID } from "app/services/CrudDB"
import { createEstimateService, deleteEstimateService, updateEstimateService } from "app/services/estimatesServices"
import { StoreContext } from "app/store/store"
import { convertDateToInputFormat, dateToMonthName } from "app/utils/dateUtils"
import { calculatePriceTotal, formatCurrency, validateEmail,
  validatePhone
} from "app/utils/generalUtils"
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from "react-router-dom"
import './styles/NewInvoicePage.css'

export default function NewEstimatePage() {

  const { myUserID, myUser, setNavItemInfo, setPageLoading } = useContext(StoreContext)
  const [estimateName, setInvoiceName] = useState("")
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
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [numOfPages, setNumOfPages] = useState(1)
  const [pageNum, setPageNum] = useState(0)
  const [numOfHits, setNumOfHits] = useState(0)
  const [hitsPerPage, setHitsPerPage] = useState(10)
  const [showContactModal, setShowContactModal] = useState(false)
  const [contactName, setContactName] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [contactAddress, setContactAddress] = useState("")
  const [contactCity, setContactCity] = useState("")
  const [contactRegion, setContactRegion] = useState("")
  const [contactCountry, setContactCountry] = useState("")
  const [contactPostcode, setContactPostcode] = useState("")
  const [contactAddFavorite, setContactAddFavorite] = useState(false)
  const [addToContacts, setAddToContacts] = useState(true)
  const [loading, setLoading] = useState(false)
  const [contactsLoading, setContactsLoading] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const editMode = searchParams.get('edit') === 'true'
  const editEstimateID = searchParams.get('estimateID')
  const editEstimate = useEstimate(myUserID, editEstimateID)
  const favoriteContacts = useFavoriteContacts(myUserID)
  const filters = `ownerID: ${myUserID}`
  const navigate = useNavigate()
  const firstItemInputRef = useRef(null)
  const calculatedSubtotal = estimateItems?.reduce((acc, item) => (acc + (item.price * item.quantity)), 0)
  const calculatedTotal = estimateItems?.reduce((acc, item) => (acc + ((item.price + (item.price * item.taxRate / 100)) * item.quantity)), 0)
  const calculatedItemTotal = calculatePriceTotal(itemPrice, itemTaxRate / 100, itemQuantity)

  const allowAddContact = contactName?.length > 0 &&
    validateEmail(contactEmail) &&
    validatePhone(contactPhone) &&
    contactAddress?.length > 0 &&
    contactCity?.length > 0 &&
    contactRegion?.length > 0 &&
    contactCountry?.length > 0 &&
    contactPostcode?.length > 0

  const allowCreateInvoice = estimateName?.length > 0 &&
    estimateNumber?.length > 0 &&
    estimateDueDate?.length > 0 &&
    estimateCurrency &&
    estimateItems?.length > 0 &&
    estimateContact

  const contacts = useInstantSearch(
    query,
    searchResults,
    setSearchResults,
    contactsIndex,
    filters,
    setNumOfHits,
    setNumOfPages,
    pageNum,
    hitsPerPage,
    setContactsLoading,
    false
  )

  const invoiceItemInputs = <>
    <div>
      <input
        type="text"
        placeholder="Web Consulting"
        onChange={(e) => setItemName(e.target.value)}
        value={itemName}
        className="invoice-item-row-element"
        ref={firstItemInputRef}
      />
    </div>
    <div>
      <input
        value={itemPrice}
        type="number"
        onChange={(e) => setItemPrice(+e.target.value)}
        className="invoice-item-row-element"
      />
    </div>
    <div>
      <input
        value={itemQuantity}
        type="number"
        onChange={(e) => setItemQuantity(+e.target.value)}
        className="invoice-item-row-element"
      />
    </div>
    <div>
      <input
        value={itemTaxRate}
        type="number"
        onChange={(e) => setItemTaxRate(+e.target.value)}
        className="invoice-item-row-element"
      />
    </div>
    <div>
      <input
        value={`${estimateCurrency?.symbol}${formatCurrency(calculatedItemTotal?.toFixed(2))}`}
        className="invoice-item-row-element"
        disabled
      />
    </div>
  </>

  const estimateItemsRender = estimateItems?.map((item, index) => {
    return <div
      key={index}
      className={`invoice-item-row with-values ${editItemID === item.itemID ? 'editing' : ''}`}
    >
      {
        editItemID !== item.itemID ?
          <>
            <div><h6>{item.name}</h6></div>
            <div><h6>{estimateCurrency?.symbol}{item.price}</h6></div>
            <div><h6>{item.quantity}</h6></div>
            <div><h6>{item.taxRate}%</h6></div>
            <div><h6>{estimateCurrency?.symbol}{formatCurrency(item.total?.toFixed(2))}</h6></div>
          </> :
          invoiceItemInputs
      }
      <div className="item-actions">
        {
          editItemID === item.itemID &&
          <>
            <IconContainer
              dimensions="24px"
              onClick={() => saveItem(item.itemID)}
              icon="fas fa-check"
              iconColor="var(--primary)"
              iconSize="13px"
              tooltip="Save Item"
            />
            <IconContainer
              dimensions="24px"
              onClick={() => cancelItem()}
              icon="far fa-times"
              iconColor="var(--primary)"
              iconSize="15px"
              tooltip="Cancel"
            />
          </>
        }
        {
          editItemID === null &&
          <>
            <IconContainer
              dimensions="24px"
              onClick={() => initEditItem(item)}
              icon="fas fa-pen"
              iconColor="var(--primary)"
              iconSize="13px"
              tooltip="Edit Item"
            />
            <IconContainer
              dimensions="24px"
              onClick={() => deleteItem(item.itemID)}
              icon="fas fa-trash"
              iconColor="var(--primary)"
              iconSize="13px"
              tooltip="Delete Item"
            />
          </>
        }
      </div>
    </div>
  })

  const contactsList = contacts?.map((contact, index) => {
    return <ContactRow
      key={index}
      contact={contact}
      actions={
        <AppButton
          label="Select"
          onClick={() => {
            setEstimateContact({
              name: contact.name,
              email: contact.email,
              phone: contact.phone,
              address: contact.address,
              city: contact.city,
              region: contact.region,
              country: contact.country,
              postcode: contact.postcode,
              dateAdded: new Date()
            })
            setQuery("")
            setSearchResults([])
          }}
        />
      }
    />
  })

  const favoritesList = favoriteContacts?.map((contact, index) => {
    return <ContactRow
      key={index}
      contact={contact}
      actions={
        <AppButton
          label="Select"
          onClick={() => {
            setEstimateContact({
              name: contact.name,
              email: contact.email,
              phone: contact.phone,
              address: contact.address,
              city: contact.city,
              region: contact.region,
              country: contact.country,
              postcode: contact.postcode,
              dateAdded: new Date()
            })
            setQuery("")
            setSearchResults([])
          }}
        />
      }
    />
  })

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

  const clearInvoiceItemInputs = () => {
    setItemName("")
    setItemPrice(0)
    setItemQuantity(1)
    setItemTaxRate(0)
    setEditItemID(null)
    firstItemInputRef.current.focus()
  }

  const addInvoiceItem = () => {
    if (itemName.length) {
      setEstimateItems([...estimateItems, {
        name: itemName,
        price: itemPrice,
        quantity: itemQuantity,
        taxRate: itemTaxRate,
        total: calculatedItemTotal,
        itemID: getRandomDocID('invoices/items/invoiceItems')
      }])
      clearInvoiceItemInputs()
    }
  }

  const initEditItem = (item) => {
    setEditItemID(item.itemID)
    setItemName(item.name)
    setItemPrice(item.price)
    setItemQuantity(item.quantity)
    setItemTaxRate(item.taxRate)
  }

  const saveItem = (itemID) => {
    setEstimateItems(estimateItems.map(invoiceItem => {
      if (invoiceItem.itemID === itemID) {
        return {
          name: itemName,
          price: itemPrice,
          quantity: itemQuantity,
          taxRate: itemTaxRate,
          total: calculatedItemTotal,
          itemID
        }
      }
      return invoiceItem
    }))
    clearInvoiceItemInputs()
  }

  const cancelItem = () => {
    setEditItemID(null)
    clearInvoiceItemInputs()
  }

  const deleteItem = (itemID) => {
    const confirm = window.confirm("Are you sure you want to delete this item?")
    if (confirm) {
      setEstimateItems(estimateItems.filter(item => item.itemID !== itemID))
    }
    clearInvoiceItemInputs()
  }

  const clearContactInfo = () => {
    setContactName("")
    setContactEmail("")
    setContactPhone("")
    setContactAddress("")
    setContactCity("")
    setContactRegion("")
    setContactCountry("")
    setContactPostcode("")
    setContactAddFavorite(false)
    setShowContactModal(false)
    setLoading(false)
  }

  const addContact = () => {
    addContactService(
      myUserID, contactName, contactEmail, contactPhone, contactAddress,
      contactCity, contactRegion, contactCountry, contactPostcode, contactAddFavorite,
      addToContacts, allowAddContact, setLoading, setEstimateContact, clearContactInfo
    )
  }

  const createEstimate = () => {
    if (!allowCreateInvoice) return alert("Please fill out all required fields.")
    setPageLoading(false)
    createEstimateService(
      myUserID, estimateCurrency, estimateDate, estimateDueDate, estimateNumber, estimateContact,
      estimateItems, estimateNotes, taxRate1, taxRate2, calculatedSubtotal,
      calculatedTotal, estimateName
    )
      .then(() => {
        setPageLoading(false)
        navigate('/invoices')
      })
      .catch(err => {
        setPageLoading(false)
        console.log(err)
      })
  }

  const updateEstimate = () => {
    if (!allowCreateInvoice) return alert("Please fill out all required fields.")
    const updatedProps = {
      title: estimateName,
      estimateNumber,
      dateCreated: new Date(estimateDate),
      dateDue: new Date(estimateDueDate),
      currency: estimateCurrency,
      invoiceTo: estimateContact,
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
      setPageLoading
    )
      .then(() => {
        navigate(`/invoices/${editEstimateID}`)
      })
  }

  const deleteEstimate = () => {
    deleteEstimateService(myUserID, editEstimateID, setLoading)
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
      setInvoiceName(editEstimate?.title)
      setEstimateCurrency(editEstimate?.currency)
      setEstimateDate(convertDateToInputFormat(editEstimate?.dateCreated?.toDate()))
      setEstimateDueDate(convertDateToInputFormat(editEstimate?.dateDue?.toDate()))
      setEstimateNumber(editEstimate?.invoiceNumber)
      setStatus(editEstimate?.status)
      setEstimateContact(editEstimate?.invoiceTo)
      setEstimateItems(editEstimate?.items)
      setEstimateNotes(editEstimate?.notes)
      setTaxRate1(editEstimate?.taxRate1)
      setTaxRate2(editEstimate?.taxRate2)
    }
  }, [editMode, editEstimate])

  return (
    <div className="new-invoice-page">
      <HelmetTitle title="Create New Invoice" />
      <PageTitleBar
        title="Create an Invoice"
        hasBorder
      />
      <div className="page-content">
        <form onSubmit={(e) => e.preventDefault()}>
          <AppInput
            label="Invoice Name"
            placeholder="Montly consulting services"
            value={estimateName}
            onChange={(e) => setInvoiceName(e.target.value)}
          />
          <AppInput
            label="Invoice Number"
            placeholder="91288349"
            value={estimateNumber}
            onChange={(e) => setEstimateNumber(e.target.value)}
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
            placeholder="Enter any notes you want to include on the invoice"
            value={estimateNotes}
            onChange={(e) => setEstimateNotes(e.target.value)}
          />
        </form>
        <div className="invoice-items">
          <h4>Estimate Items</h4>
          <AppTable
            flexBasis="20%"
            headers={[
              'Item',
              'Unit Price',
              'Quantity',
              'Tax %',
              'Total',
              'Edit'
            ]}
            rows={
              <>
                {estimateItemsRender}
                <form
                  className="invoice-item-row"
                  onSubmit={(e) => {
                    e.preventDefault()
                    addInvoiceItem()
                  }}
                  style={{ display: !editItemID ? 'flex' : 'none' }}
                >
                  {invoiceItemInputs}
                  <div className="action-item">
                    <input />
                    <button onClick={addInvoiceItem} />
                  </div>
                </form>
              </>
            }
          />
          <div className="invoice-table-actions">
            <small
              onClick={addInvoiceItem}
              className={`add-invoice-item ${!itemName.length ? 'inactive' : ''}`}
            >
              Add Item<i className="far fa-plus" />
            </small>
          </div>
        </div>
        <div className="invoice-contact">
          <h4>Bill To Contact</h4>
          <AppInput
            placeholder="Search Contact"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            iconleft={contactsLoading ? <i className="fal fa-spinner fa-spin" /> : 
            query.length ?
              <i
                className="fal fa-times"
                onClick={() => {
                  setQuery('')
                  setSearchResults([])
                }}
              /> :
              <i className="fal fa-search" />
            }
          />
          {
            estimateContact &&
            <>
              <h5>Selected Contact</h5>
              <ContactRow
                contact={{
                  name: estimateContact.name,
                  email: estimateContact.email,
                  phone: estimateContact.phone,
                  address: estimateContact.address,
                  city: estimateContact.city,
                  region: estimateContact.region,
                  country: estimateContact.country,
                }}
                className="selected"
                actions={
                  <IconContainer
                    icon="fal fa-times"
                    onClick={() => setEstimateContact(null)}
                    iconColor="var(--darkGrayText)"
                    iconSize="17px"
                  />
                }
              />
            </>
          }
          {
            query.length > 0 && searchResults.length > 0 ?
              <>
                <h5>My Contacts</h5>
                <div className="contacts-search-results">
                  {contactsList}
                </div>
                <AppPagination
                  pageNum={pageNum}
                  setPageNum={setPageNum}
                  numOfPages={numOfPages}
                  dimensions="25px"
                />
              </> :
              <>
                <h5>Favorite Contacts</h5>
                <div className="contacts-search-results favorite-contacts">
                  {favoritesList}
                </div>
              </>
          }
          <AppButton
            label="New Contact"
            onClick={() => setShowContactModal(true)}
            rightIcon="fal fa-plus"
          />
        </div>
      </div>
      <div className="btn-group">
        {
          !editMode ?
            <AppButton
              label="Create Estimate"
              onClick={createEstimate}
              disabled={!allowCreateInvoice}
            /> :
            <>
              <AppButton
                label="Save Changes"
                onClick={updateEstimate}
                disabled={!allowCreateInvoice}
              />
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
      <AddContactModal
        showModal={showContactModal}
        setShowModal={setShowContactModal}
        name={contactName}
        setName={setContactName}
        email={contactEmail}
        setEmail={setContactEmail}
        phone={contactPhone}
        setPhone={setContactPhone}
        address={contactAddress}
        setAddress={setContactAddress}
        city={contactCity}
        setCity={setContactCity}
        region={contactRegion}
        setRegion={setContactRegion}
        postcode={contactPostcode}
        setPostcode={setContactPostcode}
        country={contactCountry}
        setCountry={setContactCountry}
        addToFavorites={contactAddFavorite}
        setAddToFavorites={setContactAddFavorite}
        addToContacts={addToContacts}
        setAddToContacts={setAddToContacts}
        createContact={addContact}
        loading={loading}
      />
    </div>
  )
}
