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
import { useInvoice } from "app/hooks/invoiceHooks"
import { useInstantSearch } from "app/hooks/searchHooks"
import { addContactService } from "app/services/contactsServices"
import { getRandomDocID } from "app/services/CrudDB"
import { createInvoiceService, deleteInvoiceService, 
  updateInvoiceService } from "app/services/invoiceServices"
import { StoreContext } from "app/store/store"
import { convertDateToInputFormat } from "app/utils/dateUtils"
import { calculatePriceTotal, formatCurrency, validateEmail,
  validatePhone
} from "app/utils/generalUtils"
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from "react-router-dom"
import './styles/NewInvoicePage.css'

export default function NewInvoicePage() {

  const { myUserID, myUser, setNavItemInfo, setPageLoading } = useContext(StoreContext)
  const [invoiceName, setInvoiceName] = useState("")
  const [invoiceNumber, setInvoiceNumber] = useState("")
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
  const editInvoiceID = searchParams.get('invoiceID')
  const editInvoice = useInvoice(myUserID, editInvoiceID)
  const favoriteContacts = useFavoriteContacts(myUserID)
  const filters = `ownerID: ${myUserID}`
  const navigate = useNavigate()
  const firstItemInputRef = useRef(null)
  const calculatedSubtotal = invoiceItems?.reduce((acc, item) => (acc + (item.price * item.quantity)), 0)
  const calculatedTotal = invoiceItems?.reduce((acc, item) => (acc + ((item.price + (item.price * item.taxRate / 100)) * item.quantity)), 0)
  const calculatedItemTotal = calculatePriceTotal(itemPrice, itemTaxRate / 100, itemQuantity)

  const allowAddContact = contactName?.length > 0 &&
    validateEmail(contactEmail) &&
    validatePhone(contactPhone) &&
    contactAddress?.length > 0 &&
    contactCity?.length > 0 &&
    contactRegion?.length > 0 &&
    contactCountry?.length > 0 &&
    contactPostcode?.length > 0

  const allowCreateInvoice = invoiceName?.length > 0 &&
    invoiceNumber?.length > 0 &&
    invoiceDueDate?.length > 0 &&
    invoiceCurrency &&
    invoiceItems?.length > 0 &&
    invoiceContact

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

  const statusOptions = [
    { value: 'unpaid', label: 'Unpaid' },
    { value: 'paid', label: 'Paid' },
    { value: 'partially-paid', label: 'Partially Paid' },
    { value: 'overdue', label: 'Overdue' },
  ]

  const invoiceItemInputs = <>
    <div>
      <input
        value={itemName}
        placeholder="Web Consulting"
        onChange={(e) => setItemName(e.target.value)}
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
        value={`${invoiceCurrency?.symbol}${formatCurrency(calculatedItemTotal?.toFixed(2))}`}
        className="invoice-item-row-element"
        disabled
      />
    </div>
  </>

  const invoiceItemsRender = invoiceItems?.map((item, index) => {
    return <div
      key={index}
      className={`invoice-item-row with-values ${editItemID === item.itemID ? 'editing' : ''}`}
    >
      {
        editItemID !== item.itemID ?
          <>
            <div><h6>{item.name}</h6></div>
            <div><h6>{invoiceCurrency?.symbol}{item.price}</h6></div>
            <div><h6>{item.quantity}</h6></div>
            <div><h6>{item.taxRate}%</h6></div>
            <div><h6>{invoiceCurrency?.symbol}{formatCurrency(item.total?.toFixed(2))}</h6></div>
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
            setInvoiceContact({
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
            setInvoiceContact({
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
      setInvoiceItems([...invoiceItems, {
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
    setInvoiceItems(invoiceItems.map(invoiceItem => {
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
      setInvoiceItems(invoiceItems.filter(item => item.itemID !== itemID))
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
      addToContacts, allowAddContact, setLoading, setInvoiceContact, clearContactInfo
    )
  }

  const createInvoice = () => {
    if (!allowCreateInvoice) return alert("Please fill out all required fields.")
    setPageLoading(false)
    createInvoiceService(
      myUserID, invoiceCurrency, invoiceDueDate, invoiceNumber, invoiceContact,
      invoiceItems, invoiceNotes, taxRate1, taxRate2, calculatedSubtotal,
      calculatedTotal, invoiceName, status
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

  const updateInvoice = () => {
    if (!allowCreateInvoice) return alert("Please fill out all required fields.")
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
      dateDue: new Date(invoiceDueDate),
      currency: invoiceCurrency,
      invoiceTo: invoiceContact,
      items: invoiceItems,
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
      setPageLoading
    )
    .then(() => {
      navigate(`/invoices/${editInvoiceID}`)
    })
  }

  const deleteInvoice = () => {
    deleteInvoiceService(myUserID, editInvoiceID, editInvoice?.isPaid, editInvoice?.total, setLoading)
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
          <AppInput
            label="Due Date"
            type="date"
            value={invoiceDueDate}
            onChange={(e) => setInvoiceDueDate(e.target.value)}
            className="date-input"
          />
          <AppSelect
            label="Currency"
            options={currencies}
            value={invoiceCurrency}
            onChange={(e) => setInvoiceCurrency(currencies.find(currency => currency.value === e.target.value))}
          />
          <div className="tax-rates">
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
        <div className="invoice-items">
          <h4>Invoice Items</h4>
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
                {invoiceItemsRender}
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
            iconleft={query.length ?
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
            invoiceContact &&
            <>
              <h5>Selected Contact</h5>
              <ContactRow
                contact={{
                  name: invoiceContact.name,
                  email: invoiceContact.email,
                  phone: invoiceContact.phone,
                  address: invoiceContact.address,
                  city: invoiceContact.city,
                  region: invoiceContact.region,
                  country: invoiceContact.country,
                }}
                className="selected"
                actions={
                  <IconContainer
                    icon="fal fa-times"
                    onClick={() => setInvoiceContact(null)}
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
              label="Create Invoice"
              onClick={createInvoice}
              disabled={!allowCreateInvoice}
            /> :
            <>
            <AppButton
              label="Save Changes"
              onClick={updateInvoice}
              disabled={!allowCreateInvoice}
            />
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
