import { db, functions } from "app/firebase/fire"
import { updateDB } from "./CrudDB"
import { createNotification } from "./notifServices"
import { uploadMultipleFilesToFireStorage } from "./storageServices"

export const getUserByID = (userID, setUser) => {
  db.collection('users')
  .doc(userID)
  .onSnapshot(snap => {
    setUser(snap.data())
  })
}

export const doGetUserByID = (userID) => {
  return db.collection('users')
  .doc(userID)
  .get()
  .then(snap => {
    return snap.data()
  })
}

export const getNotificationsByUserID = (userID, setNotifs, limit) => {
  db.collection('users')
  .doc(userID)
  .collection('notifications')
  .orderBy('dateCreated', 'desc')
  .limit(limit)
  .onSnapshot(snap => {
    setNotifs(snap.docs.map(doc => doc.data()))
  })
}

export const getUnreadNotificationsByUserID = (userID, setNotifs) => {
  db.collection('users')
  .doc(userID)
  .collection('notifications')
  .where('isRead', '==', false)
  .onSnapshot(snap => {
    setNotifs(snap.docs.map(doc => doc.data()))
  })
}

export const getUserInvoiceSettingsByID = (userID, setSettings) => {
  db.collection('users')
  .doc(userID)
  .collection('settings')
  .doc('invoices')
  .onSnapshot(snap => {
    setSettings(snap.data())
  })
}

export const getUserEstimateSettingsByID = (userID, setSettings) => {
  db.collection('users')
  .doc(userID)
  .collection('settings')
  .doc('estimates')
  .onSnapshot(snap => {
    setSettings(snap.data())
  })
}

export const getUserContactSettingsByID = (userID, setSettings) => {
  db.collection('users')
  .doc(userID)
  .collection('settings')
  .doc('contacts')
  .onSnapshot(snap => {
    setSettings(snap.data())
  })
}

export const saveAccountInfoService = (userID, data, uploadedImg, contactStoragePath) => {
  return uploadMultipleFilesToFireStorage(uploadedImg ? [uploadedImg.file] : null, contactStoragePath, ['photo-url'])
  .then(imgURL => {
    return updateDB('users', userID, {
      ...data,
      ...(uploadedImg && { photoURL: imgURL[0].downloadURL })
    })
    .catch(err => console.log(err))
  })
}

export const saveMyBusinessInfoService = (userID, myUser, data, uploadedImg, contactStoragePath) => {
  return uploadMultipleFilesToFireStorage(uploadedImg ? [uploadedImg.file] : null, contactStoragePath, ['photo-url'])
  .then(imgURL => {
    return updateDB('users', userID, {
      myBusiness: {
        ...myUser.myBusiness,
        ...data,
        ...(uploadedImg && { logo: imgURL[0].downloadURL })
      }
    })
    .catch(err => console.log(err))
  })
}

//Stripe onboarding
export const createStripeAccountService = (userID, data) => {
  return functions.httpsCallable('createStripeAccount')(data)
  .then(result => {
    return updateDB('users', userID, {
      "stripe.stripeAccountID": result.data.account.id,
      "stripe.stripeDetailsSubmitted": result.data.account.details_submitted,
    })
    .then(() => {
      createNotification(
        userID,
        'Stripe Account Created',
        `Your Stripe account has been created successfully.`,
        'fab fa-stripe-s',
        `/my-account/payments`
      )
      return result.data.accountLink
    })
    .catch(err => console.log(err))
  })
  .catch(err => console.log(err))
}

export const retrieveStripeAccountService = (accountID) => {
  return functions.httpsCallable('retrieveStripeAccount')({accountID})
  .then(result => {
    return result.data
  })
  .catch(err => console.log(err))
}

export const deleteStripeAccountService = (userID, customerID) => {
  return functions.httpsCallable('deleteStripeAccount')({customerID})
  .then(result => {
    createNotification(
      userID,
      'Stripe Account Deleted',
      `Your Stripe account has been deleted successfully.`,
      'fab fa-stripe-s',
      `/settings/payments`
    )
    updateDB('users', userID, {
      "stripe.stripeAccountID": null 
    })
    return result
  })
  .catch(err => console.log(err))
}

