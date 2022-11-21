import { db } from "app/firebase/fire"
import { getRandomDocID, setDB } from "./CrudDB"

export const getFavoriteContactsByUserID = (userID, setContacts) => {
  db.collection('users')
  .doc(userID)
  .collection('contacts')
  .where('isFavorite', '==', true)
  .onSnapshot((snapshot) => {
    setContacts(snapshot.docs.map((doc) => doc.data()))
  })
}

export const addContactService = (userID, contactName, contactEmail, contactPhone, contactAddress,
  contactCity, contactRegion, contactCountry, contactPostcode, contactAddFavorite,
  addToContacts, allowAddContact, setLoading, setInvoiceContact, clearContactInfo ) => {
  if (!allowAddContact) return alert("Please fill in all fields")
    setLoading(true)
    const contactsPath = `users/${userID}/contacts`
    const docID = getRandomDocID(contactsPath)
    const contactData = {
      name: contactName,
      email: contactEmail,
      phone: contactPhone,
      address: contactAddress,
      city: contactCity,
      region: contactRegion.split(',')[0],
      regionCode: contactRegion.split(',')[1],
      country: contactCountry.split(',')[0],
      countryCode: contactCountry.split(',')[1],
      postcode: contactPostcode,
      isFavorite: contactAddFavorite,
      contactID: docID,
      dateAdded: new Date(),
      ownerID: userID
    }
    if(addToContacts) {
      setDB(contactsPath, docID, contactData)
        .then(() => {
          setInvoiceContact(contactData)
          clearContactInfo()
          setLoading(false)
        })
        .catch(err => {
          setLoading(false)
          console.log(err)
        })
    }
    else {
      setInvoiceContact(contactData)
      clearContactInfo()
      setLoading(false)
    }
}