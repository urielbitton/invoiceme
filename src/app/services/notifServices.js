import { auth } from "app/firebase/fire"
import { getRandomDocID, setDB } from "./CrudDB"
const userID = auth?.currentUser?.uid

export const createNotification = (title, text, icon, url) => {
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
