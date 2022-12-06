import { getContactByID, getContactsByUserID, 
  getContactYearOptions, 
  getFavoriteContactsByUserID, 
  getYearAndMonthContactsByUserID, 
  getYearContactsByUserID} from "app/services/contactsServices"
import { StoreContext } from "app/store/store"
import { useContext, useEffect, useState } from "react"

export const useContacts = (userID, limit) => {
  
  const [contacts, setContacts] = useState([])

  useEffect(() => {
    if(userID)
      getContactsByUserID(userID, setContacts, limit)
  }, [userID, limit])

  return contacts
}

export const useContact = (userID, contactID) => {

  const [contact, setContact] = useState(null)

  useEffect(() => {
    if(contactID && userID) 
      getContactByID(userID, contactID, setContact)
  }, [userID, contactID])

  return contact
}

export const useYearMonthOrAllContacts = (userID, year, month, limit) => {

  const [contacts, setContacts] = useState([])

  useEffect(() => {
    if (userID) {
      if(year !== 'all' && month === 'all') {
        getYearContactsByUserID(userID, year, setContacts, limit)
      }
      else if(year !== 'all' && month !== 'all') {
        getYearAndMonthContactsByUserID(userID, year, month, setContacts, limit)
      }
      else {
        getContactsByUserID(userID, setContacts, limit)
      }
    }
  }, [userID, year, month, limit])

  return contacts
}

export const useFavoriteContacts = (userID) => {

  const [contacts, setContacts] = useState([])

  useEffect(() => {
    if(userID)
      getFavoriteContactsByUserID(userID, setContacts)
  }, [userID])

  return contacts
}

export const useContactYearOptions = () => {

  const { myUserID } = useContext(StoreContext)
  const [options, setOptions] = useState([])

  useEffect(() => {
    getContactYearOptions(myUserID, setOptions)
  }, [myUserID])

  return options?.length ? options :  [{label: new Date().getFullYear(), value: new Date().getFullYear()}]
}