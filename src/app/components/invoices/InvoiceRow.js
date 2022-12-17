import { deleteInvoiceService, updateInvoiceService } from "app/services/invoiceServices"
import { StoreContext } from "app/store/store"
import { convertAlgoliaDate, convertClassicDate, convertClassicDateAndTime } from "app/utils/dateUtils"
import { formatCurrency, truncateText } from "app/utils/generalUtils"
import React, { useContext } from 'react'
import { useNavigate } from "react-router-dom"
import AppItemRow from "../ui/AppItemRow"
import IconContainer from "../ui/IconContainer"

export default function InvoiceRow(props) {

  const { myUserID, setPageLoading, myUser, setToasts } = useContext(StoreContext)
  const { invoiceID, title, invoiceNumber, total, items, invoiceTo,
    dateCreated, isPaid, currency } = props.invoice
  const { notifSettings } = props
  const navigate = useNavigate()

  const deleteInvoice = () => {
    deleteInvoiceService(myUserID, invoiceID, setPageLoading, setToasts, notifSettings.showInvoicesNotifs)
  }

  const togglePaid = () => {
    const confirm = window.confirm(`Are you sure you want to mark this invoice as ${isPaid ? 'unpaid' : 'paid'}?`)
    if (confirm) {
      const newTotalRevenue = myUser?.totalRevenue + (isPaid ? -total : total)
      updateInvoiceService(
        myUserID,
        invoiceID,
        {
          isPaid: !isPaid,
          status: !isPaid ? 'paid' : 'unpaid',
          partOfTotal: !isPaid,
        },
        newTotalRevenue,
        setPageLoading,
        setToasts,
        notifSettings.showInvoicesNotifs
      )
    }
  }

  return (
    <AppItemRow
      item1={`#${truncateText(invoiceNumber, 14)}`}
      item2={truncateText(title, 16)}
      item3={truncateText(invoiceTo.name, 16)}
      item4={items.length}
      item5={`${currency?.symbol}${formatCurrency(total?.toFixed(2))}`}
      item6={<span title={convertClassicDateAndTime(convertAlgoliaDate(dateCreated))}>{convertClassicDate(convertAlgoliaDate(dateCreated))}</span>}
      item7={isPaid}
      handleCheckChange={() => togglePaid()}
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
            onClick={() => navigate(`/invoices/new?invoiceID=${invoiceID}&edit=true`)}
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
