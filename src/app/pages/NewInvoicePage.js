import AppButton from "app/components/ui/AppButton"
import { AppInput, AppSelect, AppSwitch, AppTextarea } from "app/components/ui/AppInputs"
import AppTable from "app/components/ui/AppTable"
import IconContainer from "app/components/ui/IconContainer"
import PageTitleBar from "app/components/ui/PageTitleBar"
import { currencies } from "app/data/general"
import { getRandomDocID } from "app/services/CrudDB"
import { StoreContext } from "app/store/store"
import { convertDateToInputFormat } from "app/utils/dateUtils"
import { calculatePriceTotal, formatCurrency } from "app/utils/generalUtils"
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import './styles/NewInvoicePage.css'

export default function NewInvoicePage() {

  const { myUserID, setNavItemInfo } = useContext(StoreContext)
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
  const [itemQuantity, setItemQuantity] = useState(0)
  const [itemTaxRate, setItemTaxRate] = useState(0)
  const [editItemID, setEditItemID] = useState(null)
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [numOfPages, setNumOfPages] = useState(1)
  const [pageNum, setPageNum] = useState(0)
  const [numOfHits, setNumOfHits] = useState(0)
  const [hitsPerPage, setHitsPerPage] = useState(10)
  const filters = `ownerID: ${myUserID}`
  const navigate = useNavigate()
  const calculatedSubtotal = invoiceItems.reduce((acc, item) => (acc + (item.price * item.quantity)), 0)
  const calculatedTotal = invoiceItems.reduce((acc, item) => (acc + ((item.price + (item.price * item.taxRate/100)) * item.quantity)), 0)
  const calculatedItemTotal = calculatePriceTotal(itemPrice, itemTaxRate / 100, itemQuantity)

  const statusOptions = [
    { value: 'unpaid', label: 'Unpaid' },
    { value: 'paid', label: 'Paid' },
    { value: 'partially-paid', label: 'Partially Paid' },
    { value: 'overdue', label: 'Overdue' },
  ]

  const invoiceItemInputs = <>
    <input
      value={itemName}
      onChange={(e) => setItemName(e.target.value)}
      className="invoice-item-row-element"
    />
    <input
      value={itemPrice}
      type="number"
      onChange={(e) => setItemPrice(+e.target.value)}
      className="invoice-item-row-element"
    />
    <input
      value={itemQuantity}
      type="number"
      onChange={(e) => setItemQuantity(+e.target.value)}
      className="invoice-item-row-element"
    />
    <input
      value={itemTaxRate}
      type="number"
      onChange={(e) => setItemTaxRate(+e.target.value)}
      className="invoice-item-row-element"
    />
    <input
      value={`${invoiceCurrency.symbol}${formatCurrency(calculatedItemTotal?.toFixed(2))}`}
      className="invoice-item-row-element"
      disabled
    />
  </>

  const invoiceItemsRender = invoiceItems?.map((item, index) => {
    return <div
      key={index}
      className="invoice-item-row with-values"
    >
      {
        editItemID !== item.itemID ?
          <>
            <h6>{item.name}</h6>
            <h6>{invoiceCurrency?.symbol}{item.price}</h6>
            <h6>{item.quantity}</h6>
            <h6>{item.taxRate}%</h6>
            <h6>{invoiceCurrency?.symbol}{formatCurrency(item.total?.toFixed(2))}</h6>
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
    setItemQuantity(0)
    setItemTaxRate(0)
    setEditItemID(null)
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
  
  const addContact = () => {

  }

  const createInvoice = () => {

  }

  useEffect(() => {
    setNavItemInfo(navItemInfoRender)
    return () => setNavItemInfo(null)
  }, [taxRate1, taxRate2, invoiceItems, invoiceContact, invoiceCurrency])

  useEffect(() => {
    setItemTaxRate(taxRate1 + taxRate2)
  }, [taxRate1, taxRate2])

  return (
    <div className="new-invoice-page">
      <PageTitleBar
        title="Create an Invoice"
        hasBorder
      />
      <div className="page-content">
        <form onSubmit={(e) => e.preventDefault()}>
          <AppInput
            label="Invoice Name"
            value={invoiceName}
            onChange={(e) => setInvoiceName(e.target.value)}
          />
          <AppInput
            label="Invoice Number"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            iconleft={
              <div className="icon-container">
                <span>INV#</span>
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
                  <div className="invoice-item-row-element">
                    <div
                      className={`plus-container ${itemName.length < 1 ? 'disabled' : ''}`}
                      onClick={addInvoiceItem}
                    >
                      <i className="far fa-plus" />
                    </div>
                  </div>
                  <button style={{ display: 'none' }} />
                </form>
              </>
            }
          />
        </div>
        <div className="invoice-contact">
          <h4>Invoice Contact</h4>
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
              <i className="fal fa-search"/>
            }
          />
          <div className="contacts-search-results">
            
          </div>
          <AppTable
            headers={[
              'Name',
              'Email',
              'Phone',
              'Address',
              'Add Contact',
              'Edit'
            ]}
            rows={invoiceContact ? [invoiceContact] : []}
          />
        </div>
      </div>
      <div className="btn-group">
        <AppButton
          label="Create Invoice"
          onClick={createInvoice}
        />
      </div>
    </div>
  )
}
