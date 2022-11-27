import { db, functions } from "app/firebase/fire"
import { deleteDB, firebaseIncrement, getRandomDocID, 
  setDB, updateDB } from "./CrudDB"

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

export const createContactService = (userID, name, email, phone, address,
  city, region, country, postcode, companyName, isFavorite,
  addToContacts, allowAddContact, setLoading, setInvoiceContact, clearContactInfo ) => {
  if (!allowAddContact) return alert("Please fill in all fields")
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
      contactID: docID,
      dateCreated: new Date(),
      ownerID: userID,
      photoURL: 'https://i.imgur.com/D4fLSKa.png'
    }
    if(addToContacts) {
      setDB(contactsPath, docID, contactData)
        .then(() => {
          updateDB('users', userID, {
            contactsNum: firebaseIncrement(1)
          })
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

export const deleteContactService = (userID, contactID, setLoading) => {
  const confirm = window.confirm("Are you sure you want to delete this contact?")
    if (confirm) {
      setLoading(true)
      return deleteDB(`users/${userID}/contacts`, contactID)
      .then(() => {
        return updateDB('users', userID, {
          contactsNum: firebaseIncrement(-1),
        })
        .then(() => {
          setLoading(false)
        })
        .catch(err => {
          console.log(err)
          setLoading(false)
        })
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
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
    console.log(err)
    setLoading(false)
  })
}