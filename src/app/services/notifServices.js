import { db } from "app/firebase/fire"
import { deleteDB, getRandomDocID } from "./CrudDB"

export const sendNotifToAllMembers = (members, notifData) => {
  const batch = db.batch()
  members.forEach(member => {
    const notifPath = `users/${member?.userID}/notifications`
    const docID = getRandomDocID(notifPath)
    const docRef = db.collection(notifPath).doc(docID)
    batch.set(docRef, {
      type: "general",
      notificationID: docID,
      dateCreated: new Date(),
      isRead: false,
      text: notifData.text,
      notifImg: notifData.notifImg,
      icon: 'fas fa-calendar-alt',
      url: notifData.notifURL,
    }) 
  })
  return batch.commit()
  .then(() => {})
  .catch(err => console.log(err))
}

export const removeNotificationFromMember = (member, notificationID) => {
  const notifPath = `users/${member?.userID}/notifications`
  return deleteDB(notifPath, notificationID)
}

