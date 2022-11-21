import { db } from "app/firebase/fire"

export const getFavoriteContactsByUserID = (userID, setContacts) => {
  db.collection('users')
  .doc(userID)
  .collection('contacts')
  .where('isFavorite', '==', true)
  .onSnapshot((snapshot) => {
    setContacts(snapshot.docs.map((doc) => doc.data()))
  })
}