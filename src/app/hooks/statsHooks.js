import { geCurrentYearContacts, geCurrentYearEstimates, 
  geCurrentYearInvoices, getActiveMonthInvoices, getCurrentMonthContacts, 
  getCurrentMonthEstimates, getCurrentMonthInvoices, getActiveYearInvoices, 
  getActiveYearEstimates, getActiveYearContacts
} from "app/services/statsServices"
import { StoreContext } from "app/store/store"
import { useContext, useEffect, useState } from "react"

export const useCurrentMonthInvoices = (monthStart, monthEnd, date) => {

  const { myUserID } = useContext(StoreContext)
  const [invoices, setInvoices] = useState([])

  useEffect(() => {
    if(myUserID)
    !date ? getCurrentMonthInvoices(myUserID, monthStart, monthEnd, setInvoices) :
    getActiveMonthInvoices(myUserID, date, setInvoices) 
  }, [myUserID, monthStart, date])

  return invoices
}

export const useCurrentYearInvoices = (yearStart, yearEnd, date) => {

  const { myUserID } = useContext(StoreContext)
  const [invoices, setInvoices] = useState([])

  useEffect(() => {
    if(myUserID)
      !date ? geCurrentYearInvoices(myUserID, yearStart, yearEnd, setInvoices) :
      getActiveYearInvoices(myUserID, date, setInvoices)
  }, [myUserID, yearStart, date])

  return invoices
}

export const useCurrentMonthEstimates = (monthStart, monthEnd) => {

  const { myUserID } = useContext(StoreContext)
  const [estimates, setEstimates] = useState([])

  useEffect(() => {
    if(myUserID)
      getCurrentMonthEstimates(myUserID, monthStart, monthEnd, setEstimates)
  }, [myUserID, monthStart])

  return estimates
}

export const useCurrentYearEstimates = (yearStart, yearEnd, date) => {

  const { myUserID } = useContext(StoreContext)
  const [estimates, setEstimates] = useState([])

  useEffect(() => {
    if(myUserID)
      !date ? geCurrentYearEstimates(myUserID, yearStart, yearEnd, setEstimates) :
      getActiveYearEstimates(myUserID, date, setEstimates)
  }, [myUserID, yearStart, date])

  return estimates
}

export const useCurrentMonthContacts = (monthStart, monthEnd) => {

  const { myUserID } = useContext(StoreContext)
  const [contacts, setContacts] = useState([])

  useEffect(() => {
    if(myUserID)
      getCurrentMonthContacts(myUserID, monthStart, monthEnd, setContacts)
  }, [myUserID, monthStart])

  return contacts
}

export const useCurrentYearContacts = (yearStart, yearEnd, date) => {

  const { myUserID } = useContext(StoreContext)
  const [contacts, setContacts] = useState([])

  useEffect(() => {
    if(myUserID)
      !date ? geCurrentYearContacts(myUserID, yearStart, yearEnd, setContacts) :
      getActiveYearContacts(myUserID, date, setContacts)
  }, [myUserID, yearStart, date])

  return contacts
}

