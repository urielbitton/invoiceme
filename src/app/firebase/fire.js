import firebase from "firebase"
 
const config = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
}
const firebaseApp = firebase.initializeApp(config)

firebase.firestore().settings({
  ignoreUndefinedProperties: true,
})

const db = firebaseApp.firestore()
const auth = firebaseApp.auth()
const storage = firebaseApp.storage()
const functions = firebaseApp.functions()

export { db, auth, storage, functions } 
