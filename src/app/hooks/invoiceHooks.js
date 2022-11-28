import { getInvoiceByID, getInvoicesByContactEmail, 
  getInvoicesByUserID, getYearAndMonthInvoicesByUserID, getYearInvoicesByUserID } from "app/services/invoiceServices"
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

export const useYearMonthOrAllInvoices = (userID, year, month, limit) => {

  const [invoices, setInvoices] = useState([])

  useEffect(() => {
    if (userID) {
      if(year !== 'all' && month === 'all') {
        getYearInvoicesByUserID(userID, year, setInvoices, limit)
      }
      else if(year !== 'all' && month !== 'all') {
        getYearAndMonthInvoicesByUserID(userID, year, month, setInvoices, limit)
      }
      else {
        getInvoicesByUserID(userID, setInvoices, limit)
      }
    }
  }, [userID, year, month, limit])

  return invoices
}

export const useContactInvoices = (userID, contactEmail) => {

  const [invoices, setInvoices] = useState([])

  useEffect(() => {
    if (userID && contactEmail)
    getInvoicesByContactEmail(userID, contactEmail, setInvoices)
  }, [userID, contactEmail])
  
  return invoices
}