import { convertAlgoliaDate, convertClassicDate } from "app/utils/dateUtils"
import React from 'react'
import AppItemRow from "../ui/AppItemRow"
import IconContainer from "../ui/IconContainer"

export default function InvoiceRow(props) {

  const { title, invoiceNumber, total, items, invoiceTo, dateCreated, isPaid } = props.invoice

  return (
    <AppItemRow
      item1={`#${invoiceNumber < 100 ? '0' + invoiceNumber : invoiceNumber}`}
      item2={title}
      item3={invoiceTo.name}
      item4={items.length}
      item5={total}
      item6={convertClassicDate(convertAlgoliaDate(dateCreated))}
      item7={isPaid}
      actions={
        <>
          <IconContainer
            icon="fas fa-eye"
            tooltip="View"
            dimensions="23px"
            inverted
            iconSize="13px"
            onClick={() => alert('view invoice')}
          />
          <IconContainer
            icon="fas fa-pen"
            tooltip="Edit Invoice"
            dimensions="23px"
            inverted
            iconSize="13px"
            onClick={() => alert('edit invoice')}
          />
          <IconContainer
            icon="fas fa-trash"
            tooltip="Delete"
            dimensions="23px"
            inverted
            iconSize="13px"
            onClick={() => alert('delete invoice')}
          />
        </>
      }
    />
  )
}
