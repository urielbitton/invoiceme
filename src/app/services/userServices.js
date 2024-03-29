import { settingsDocsArr, settingsDocsNamesArr } from "app/data/settingsData"
import { db, functions } from "app/firebase/fire"
import { setDB, updateDB } from "./CrudDB"
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

export const getUserNotifSettingsByID = (userID, setSettings) => {
  db.collection('users')
    .doc(userID)
    .collection('settings')
    .doc('notifications')
    .onSnapshot(snap => {
      setSettings(snap.data())
    })
}

export const getUserGeneralSettingsByID = (userID, setSettings) => {
  db.collection('users')
    .doc(userID)
    .collection('settings')
    .doc('general')
    .onSnapshot(snap => {
      setSettings(snap.data())
    })
}

export const getUserEmailSettingsByID = (userID, setSettings) => {
  db.collection('users')
    .doc(userID)
    .collection('settings')
    .doc('emails')
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

export const createAccountLinkService = (data) => {
  return functions.httpsCallable('createAccountLink')(data)
    .then(result => {
      return result.data
    })
    .catch(err => console.log(err))
}

export const retrieveStripeAccountService = (accountID) => {
  return functions.httpsCallable('retrieveStripeAccount')({ accountID })
    .then(result => {
      return result.data
    })
    .catch(err => console.log(err))
}

export const deleteStripeAccountService = (userID, customerID) => {
  return functions.httpsCallable('deleteStripeAccount')({ customerID })
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

export const getScheduledEventsByUserID = (userID, setEvents, limit) => {
  db.collectionGroup('scheduledEvents')
    .where('ownerID', '==', userID)
    .orderBy('dateRan', 'desc')
    .limit(limit)
    .onSnapshot(snap => {
      setEvents(snap.docs.map(doc => doc.data()))
    })
}

export const createUserDocService = (user, res, authMode, setLoading) => {
  const firstName = user?.displayName?.split(' ')[0] || ''
  const lastName = user?.displayName?.split(' ')[1] || ''
  const photoURLPlaceholder = 'https://firebasestorage.googleapis.com/v0/b/familia-app-1f5a8.appspot.com/o/admin%2Fprofile-placeholder.png?alt=media'
  return setDB('users', user.uid, {
    firstName: authMode === 'plain' ? firstName : authMode === 'google' ? res.additionalUserInfo.profile.given_name : res.first_name,
    lastName: authMode === 'plain' ? lastName : authMode === 'google' ? res.additionalUserInfo.profile.family_name : res.last_name,
    email: authMode === 'plain' ? user.email : authMode === 'google' ? res.additionalUserInfo.profile.email : res.email,
    photoURL: authMode === 'facebook' ? res.picture.data.url : photoURLPlaceholder,
    address: '',
    phone: '',
    city: '',
    region: '',
    regionCode: '',
    country: '',
    countryCode: '',
    invoicesNum: 0,
    estimatesNum: 0,
    contactsNum: 0,
    paymentsNum: 0,
    userID: user.uid,
    dateJoined: new Date(),
    memberType: 'basic',
    myBusiness: null,
    taxNumbers: [],
    totalRevenue: 0,
    currency: {
      name: 'Canadian Dollar',
      symbol: '$',
      value: 'CAD'
    }
  })
    .then(() => {
      return createNotification(
        user.uid, 
        'Welcome to Invoice Me!', 
        "Welcome to Invoice Me! We're glad you're here. Click here to create your first invoice.", 
        'fas fa-house-user', 
        '/invoices/new'
      )
        .then(() => {
          const batch = db.batch()
          settingsDocsNamesArr.forEach((setting, index) => {
            const docRef = db.collection(`users/${user.uid}/settings`).doc(setting)
            batch.set(docRef, settingsDocsArr[index])
          })
          return batch.commit()
          .then(() => setLoading(false))
          .catch(err => {
            console.log(err)
            setLoading(false)
          })
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

