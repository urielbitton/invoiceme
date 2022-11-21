import { deleteDB, firebaseIncrement, updateDB } from "app/services/CrudDB"
import { StoreContext } from "app/store/store"
import { convertAlgoliaDate, convertClassicDate } from "app/utils/dateUtils"
import { formatCurrency } from "app/utils/generalUtils"
import React, { useContext } from 'react'
import { useNavigate } from "react-router-dom"
import AppItemRow from "../ui/AppItemRow"
import IconContainer from "../ui/IconContainer"

export default function InvoiceRow(props) {

  const { myUserID } = useContext(StoreContext)
  const { invoiceID, title, invoiceNumber, total, items, invoiceTo, 
    dateCreated, isPaid, currency } = props.invoice
  const navigate = useNavigate()

  const deleteInvoice = () => {
    const confirm = window.confirm("Are you sure you want to delete this invoice?")
    if (confirm) {
      deleteDB(`users/${myUserID}/invoices`, invoiceID)
      .then(() => {
        updateDB('users', myUserID, {
          invoicesNum: firebaseIncrement(-1) 
        })
        window.alert("Invoice deleted.")
      })
      .catch(err => console.log(err))
    }
  }

  return (
    <AppItemRow
      item1={`#${invoiceNumber < 100 ? '0' + invoiceNumber : invoiceNumber}`}
      item2={title}
      item3={invoiceTo.name}
      item4={items.length}
      item5={`${currency?.symbol}${formatCurrency(total)}`}
      item6={convertClassicDate(convertAlgoliaDate(dateCreated))}
      item7={isPaid}
      actions={
        <>
          <IconContainer
            icon="fas fa-eye"
            tooltip="View Invoice"
            dimensions="23px"
            inverted
            iconSize="13px"
            onClick={() => navigate(`/invoices/${invoiceID}`)}
          />
          <IconContainer
            icon="fas fa-pen"
            tooltip="Edit Invoice"
            dimensions="23px"
            inverted
            iconSize="13px"
            onClick={() => navigate(`/invoices/${invoiceID}?edit=true`)}
          />
          <IconContainer
            icon="fas fa-trash"
            tooltip="Delete"
            dimensions="23px"
            inverted
            iconSize="13px"
            onClick={() => deleteInvoice()}
          />
        </>
      }
      onDoubleClick={() => navigate(`/invoices/${invoiceID}`)}
    />
  )
}
