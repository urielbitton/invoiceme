import { db, functions } from "app/firebase/fire"
import { getYearsBetween } from "app/utils/dateUtils"
import {
  deleteDB, firebaseIncrement, getRandomDocID,
  setDB, updateDB
} from "./CrudDB"
import { deleteMultipleStorageFiles } from "./storageServices"

const catchError = (err, setLoading) => {
  setLoading(false)
  console.log(err)
}

export const getContactByID = (userID, contactID, setContact) => {
  db.collection('users')
    .doc(userID)
    .collection('contacts')
    .doc(contactID)
    .onSnapshot(snapshot => {
      setContact(snapshot.data())
    })
}

export const getContactsByUserID = (userID, setContacts, limit) => {
  db.collection('users')
    .doc(userID)
    .collection('contacts')
    .orderBy('dateCreated', 'desc')
    .limit(limit)
    .onSnapshot(snapshot => {
      setContacts(snapshot.docs.map(doc => doc.data()))
    })
}

export const getYearContactsByUserID = (userID, year, setContacts, limit) => {
  db.collection('users')
    .doc(userID)
    .collection('contacts')
    .where('dateCreated', '>=', new Date(year, 0, 1))
    .where('dateCreated', '<=', new Date(year, 11, 31))
    .orderBy('dateCreated', 'desc')
    .limit(limit)
    .onSnapshot(snapshot => {
      setContacts(snapshot.docs.map(doc => doc.data()))
    })
}

export const getYearAndMonthContactsByUserID = (userID, year, month, setContacts, limit) => {
  db.collection('users')
    .doc(userID)
    .collection('contacts')
    .where('dateCreated', '>=', new Date(year, month, 0))
    .where('dateCreated', '<=', new Date(year, month, 31))
    .orderBy('dateCreated', 'desc')
    .limit(limit)
    .onSnapshot(snapshot => {
      setContacts(snapshot.docs.map(doc => doc.data()))
    })
}

export const getFavoriteContactsByUserID = (userID, setContacts) => {
  db.collection('users')
    .doc(userID)
    .collection('contacts')
    .where('isFavorite', '==', true)
    .orderBy('dateCreated', 'desc')
    .onSnapshot((snapshot) => {
      setContacts(snapshot.docs.map((doc) => doc.data()))
    })
}

export const getEarliestYearContact = (userID) => {
  return db.collection('users')
    .doc(userID)
    .collection('contacts')
    .orderBy('dateCreated', 'asc')
    .limit(1)
    .get()
    .then(snap => {
      return snap.docs[0]?.data()?.dateCreated?.toDate()?.getFullYear()
    })
}

export const getContactYearOptions = (userID, setOptions) => {
  return getEarliestYearContact(userID)
    .then((year) => {
      setOptions(getYearsBetween(year, new Date().getFullYear()))
    })
}

export const createContactService = (userID, name, email, phone, address, city,
  region, country, postcode, companyName, isFavorite, notes, photoURL, setLoading) => {
  setLoading(true)
  const contactsPath = `users/${userID}/contacts`
  const docID = getRandomDocID(contactsPath)
  const contactData = {
    name,
    email,
    phone,
    address,
    city,
    region: region.split(',')[0],
    regionCode: region.split(',')[1],
    country: country.split(',')[0],
    countryCode: country.split(',')[1],
    companyName,
    postcode,
    isFavorite,
    notes,
    contactID: docID,
    dateCreated: new Date(),
    ownerID: userID,
    photoURL: photoURL ?? 'https://i.imgur.com/D4fLSKa.png'
  }
  return setDB(contactsPath, docID, contactData)
    .then(() => setLoading(false))
    .catch(err => catchError(err, setLoading))
}

export const addContactService = (userID, name, email, phone, address,
  city, region, country, postcode, companyName, isFavorite, setInvoiceContact) => {
  const contactsPath = `users/${userID}/contacts`
  const docID = getRandomDocID(contactsPath)
  const contactData = {
    name,
    email,
    phone,
    address,
    city,
    region: region.split(',')[0],
    regionCode: region.split(',')[1],
    country: country.split(',')[0],
    countryCode: country.split(',')[1],
    companyName,
    postcode,
    isFavorite,
    contactID: docID,
    dateCreated: new Date(),
    ownerID: userID,
    photoURL: 'https://i.imgur.com/D4fLSKa.png'
  }
  setInvoiceContact(contactData)
}

export const updateContactService = (userID, contactID, updatedProps, setLoading) => {
  setLoading(true)
  return updateDB(`users/${userID}/contacts`, contactID, updatedProps)
    .then(() => setLoading(false))
    .catch(err => catchError(err, setLoading))
}

export const deleteContactService = (userID, contactID, storagePath, filenames, setLoading) => {
  const confirm = window.confirm("Are you sure you want to delete this contact?")
  if (confirm) {
    setLoading(true)
    return deleteDB(`users/${userID}/contacts`, contactID)
      .then(() => {
        return deleteMultipleStorageFiles(storagePath, filenames)
          .then(() => setLoading(false))
          .catch(err => catchError(err, setLoading))
      })
      .catch(err => catchError(err, setLoading))
  }
}

export const callPhoneService = (phone) => {
  return functions.httpsCallable('callPhone')({ phone })
    .then(result => {
      console.log(result)
    })
    .catch(err => console.log(err))
}

export const sendSMSService = (phone, message, mediaUrl, setLoading) => {
  setLoading(true)
  return functions.httpsCallable('sendSMS')({
    phone,
    message,
    ...(mediaUrl ? { mediaUrl } : null)
  })
    .then(result => {
      alert('Message sent successfully.')
      setLoading(false)
      console.log(result)
    })
    .catch(err => {
      alert('Message failed to send.')
      setLoading(false)
      catchError(err, setLoading)
    })
}

export const getContactStripeCustomerIDByEmail = (email) => {
  return db.collection('users')
  .where('email', '==', email)
  .orderBy('stripe.stripeCustomerID')
  .limit(1)
  .get()
  .then(snap => {
    return snap.docs[0]?.data()
  })
}