import { getInvoiceByID, getInvoicesByUserID } from "app/services/invoiceServices"
import { useEffect, useState } from "react"

export const useInvoices = (userID, limit) => {

  const [invoices, setInvoices] = useState([])

  useEffect(() => {
    if (userID)
      getInvoicesByUserID(userID, setInvoices, limit)
  }, [userID, limit])
  return invoices
}

export const useInvoice = (userID, invoiceID) => {

  const [invoice, setInvoice] = useState(null)

  useEffect(() => {
    if (userID && invoiceID)
      getInvoiceByID(userID, invoiceID, setInvoice)
  }, [userID, invoiceID])
  return invoice
} 
