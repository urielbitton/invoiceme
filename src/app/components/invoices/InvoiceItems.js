import { getRandomDocID } from "app/services/CrudDB"
import { calculatePriceTotal, formatCurrency } from "app/utils/generalUtils"
import React, { useRef } from 'react'
import AppTable from "../ui/AppTable"
import IconContainer from "../ui/IconContainer"
import './styles/InvoiceItems.css'

export default function InvoiceItems(props) {

  const { itemName, setItemName, itemPrice, setItemPrice, itemTaxRate, 
    setItemTaxRate, itemQuantity, setItemQuantity, invoiceCurrency, 
    editItemID, setEditItemID, invoiceItems, setInvoiceItems, title } = props
  const firstItemInputRef = useRef(null)
  const calculatedItemTotal = calculatePriceTotal(itemPrice, itemTaxRate / 100, itemQuantity)

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
        value={`${invoiceCurrency?.symbol}${formatCurrency(calculatedItemTotal?.toFixed(2))}`}
        className="invoice-item-row-element"
        disabled
      />
    </div>
  </>

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

  const invoiceItemsRender = invoiceItems?.map((item, index) => {
    return <div
      key={index}
      className={`invoice-item-row with-values ${editItemID === item.itemID ? 'editing' : ''}`}
    >
      {
        editItemID !== item.itemID ?
          <>
            <div><h6>{item.name}</h6></div>
            <div><h6>{invoiceCurrency?.symbol}{formatCurrency(item.price)}</h6></div>
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

  return (
    <div className="invoice-items">
      <h4>{title || 'Invoice'} Items</h4>
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
                <button onClick={addInvoiceItem} hidden />
              </div>
            </form>
          </>
        }
      />
      <div className="invoice-table-actions">
        <small
          onClick={addInvoiceItem}
          className={`add-invoice-item ${(!itemName.length || editItemID !== null) ? 'inactive' : ''}`}
        >
          Add Item<i className="far fa-plus" />
        </small>
      </div>
    </div>
  )
}
