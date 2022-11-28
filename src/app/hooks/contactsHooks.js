import { getContactByID, getContactsByUserID, 
  getFavoriteContactsByUserID } from "app/services/contactsServices"
import { useEffect, useState } from "react"

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

export const useFavoriteContacts = (userID) => {

  const [contacts, setContacts] = useState([])

  useEffect(() => {
    if(userID)
      getFavoriteContactsByUserID(userID, setContacts)
  }, [userID])

  return contacts
}