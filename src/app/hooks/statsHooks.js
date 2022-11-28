import { geCurrentYearContacts, geCurrentYearEstimates, 
  geCurrentYearInvoices, getCurrentMonthContacts, 
  getCurrentMonthEstimates, getCurrentMonthInvoices 
} from "app/services/statsServices"
import { StoreContext } from "app/store/store"
import { useContext, useEffect, useState } from "react"

export const useCurrentMonthInvoices = (date) => {

  const { myUserID } = useContext(StoreContext)
  const [invoices, setInvoices] = useState([])

  useEffect(() => {
    if(myUserID)
      getCurrentMonthInvoices(myUserID, date, setInvoices)
  }, [myUserID])

  return invoices
}

export const useCurrentYearInvoices = (year) => {

  const { myUserID } = useContext(StoreContext)
  const [invoices, setInvoices] = useState([])

  useEffect(() => {
    if(myUserID)
      geCurrentYearInvoices(myUserID, year, setInvoices)
  }, [myUserID, year])

  return invoices
}

export const useCurrentMonthEstimates = (date) => {

  const { myUserID } = useContext(StoreContext)
  const [estimates, setEstimates] = useState([])

  useEffect(() => {
    if(myUserID)
      getCurrentMonthEstimates(myUserID, date, setEstimates)
  }, [myUserID])

  return estimates
}

export const useCurrentYearEstimates = (year) => {

  const { myUserID } = useContext(StoreContext)
  const [estimates, setEstimates] = useState([])

  useEffect(() => {
    if(myUserID)
      geCurrentYearEstimates(myUserID, year, setEstimates)
  }, [myUserID, year])

  return estimates
}

export const useCurrentMonthContacts = (date) => {

  const { myUserID } = useContext(StoreContext)
  const [contacts, setContacts] = useState([])

  useEffect(() => {
    if(myUserID)
      getCurrentMonthContacts(myUserID, date, setContacts)
  }, [myUserID])

  return contacts
}

export const useCurrentYearContacts = (year) => {

  const { myUserID } = useContext(StoreContext)
  const [contacts, setContacts] = useState([])

  useEffect(() => {
    if(myUserID)
      geCurrentYearContacts(myUserID, year, setContacts)
  }, [myUserID, year])

  return contacts
}