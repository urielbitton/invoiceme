import { auth, db } from 'app/firebase/fire'
import firebase from 'firebase'

export function setDB(path, doc, value, merge = true) {
  return db.collection(path).doc(doc).set(value, { merge })
}

export function updateDB(path, doc, value) {
  return db.collection(path).doc(doc).update(value)
}

export function deleteDB(path, doc) {
  return db.collection(path).doc(doc).delete()
}

export const addDB = (path, value) => {
  return db.collection(path).add(value)
}

export const getRandomDocID = (path) => {
  return db.collection(path).doc().id
}

export const getFireTimeStampFromDate = (date) => {
  return firebase.firestore.Timestamp.fromDate(date)
}

export const firebaseIncrement = (num) => {
  return firebase.firestore.FieldValue.increment(num)
}

export const firebaseArrayAdd = (value) => {
  return firebase.firestore.FieldValue.arrayUnion(value)
}

export const firebaseArrayRemove = (value) => {
  return firebase.firestore.FieldValue.arrayRemove(value)
}

export const clearAuthState = (checked) => {
  return auth.setPersistence(checked ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION)
}

export const signOut = (setLoading) => {
  setLoading(true)
  auth.signOut()
  .then(() => {
    setLoading(false)
    window.location.reload()
  })
  .catch(err => {
    console.log(err)
    setLoading(false)
  })
}