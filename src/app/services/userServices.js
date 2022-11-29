import { db } from "app/firebase/fire"

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

export const getUserSettingsByID = (userID, setUserSettings) => {
  db.collection('users')
  .doc(userID)
  .collection('settings')
  .doc('settings')
  .onSnapshot(snap => {
    setUserSettings(snap.data())
  })
}