import { db } from "app/firebase/fire"
import { getRandomDocID, setDB } from "./CrudDB"

export const createNotification = (userID, title, text, icon, url) => {
  const notifPath = `users/${userID}/notifications`
  const docID = getRandomDocID(notifPath)
  setDB(notifPath, docID, {
    notificationID: docID,
    dateCreated: new Date(),
    isRead: false,
    title: title,
    text: text,
    icon: icon,
    url: url,
  })
}

export const getUnreadNotifications = (userID, setNotifs) => {
  db.collection('users')
  .doc(userID)
  .collection('notifications')
  .where('isRead', '==', false)
  .onSnapshot(snapshot => {
    setNotifs(snapshot.docs.map(doc => doc.data()))
  })
}

export const getAllNotifications = (userID, setNotifs, limit) => {
  db.collection('users')
  .doc(userID)
  .collection('notifications')
  .orderBy('dateCreated', 'desc')
  .limit(limit)
  .onSnapshot(snapshot => {
    setNotifs(snapshot.docs.map(doc => doc.data()))
  })
}