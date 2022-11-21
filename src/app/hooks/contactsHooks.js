import { getFavoriteContactsByUserID } from "app/services/contactsServices"
import { useEffect, useState } from "react"

export const useFavoriteContacts = (userID) => {

  const [contacts, setContacts] = useState([])

  useEffect(() => {
    getFavoriteContactsByUserID(userID, setContacts)
  }, [userID])

  return contacts
}