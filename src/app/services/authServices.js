import { auth, db } from "app/firebase/fire"
import { createUserDocService, doGetUserByID } from "./userServices"
import firebase from "firebase"
import { successToast, infoToast, errorToast } from "app/data/toastsTemplates"
import { deleteDB } from "./CrudDB"

export const completeRegistrationService = (user, authMode, res, userName, setLoading) => {
  const photoURLPlaceholder = 'https://firebasestorage.googleapis.com/v0/b/your-app.appspot.com/o/placeholder.png?alt=media&token=your-token'
  user.updateProfile({
    displayName: authMode === 'plain' ? `${userName.firstName} ${userName.lastName}` : authMode === 'google' ? res.additionalUserInfo.profile.name : res.name,
    photoURL: authMode === 'facebook' ? res.picture.data.url : photoURLPlaceholder
  })
  if (authMode !== 'plain') {
    return createUserDocService(user, res, authMode, setLoading)
      .then(() => {
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }
  else {
    const ActionCodeSettings = {
      url: `https://invoiceme.pro?userID=${user.uid}&firstName=${userName.firstName}&lastName=${userName.lastName}`,
    }
    user.sendEmailVerification(ActionCodeSettings)
      .then(() => {
        console.log('Email verification sent!')
        setLoading(false)
      })
      .catch((error) => {
        console.log(error)
        setLoading(false)
      })
  }
}


export const plainAuthService = (firstName, lastName, email, password, setLoading, setEmailError, setPassError) => {
  const userName = { firstName, lastName }
  setLoading(true)
  return auth.createUserWithEmailAndPassword(email.replaceAll(' ', ''), password.replaceAll(' ', ''))
    .then(() => {
      return auth.onAuthStateChanged(user => {
        if (user) {
          return completeRegistrationService(user, 'plain', null, userName, setLoading)
        }
        else {
          setLoading(false)
        }
      })
    })
    .catch(err => {
      setLoading(false)
      switch (err.code) {
        case "auth/email-already-in-use":
          setEmailError('This email address is already in use.'); break;
        case "auth/invalid-email":
          setEmailError('Please enter a valid email address.'); break;
        case "auth/weak-password":
          setPassError('The password is not long enough or too easy to guess.'); break
        default: setEmailError('An error occurred. Please try again.')
      }
    })
}

export const googleAuthService = (setMyUser, setLoading, setToasts) => {
  setLoading(true)
  const provider = new firebase.auth.GoogleAuthProvider()
  provider.addScope('email')
  return auth.signInWithPopup(provider)
    .then((res) => {
      if (res.additionalUserInfo.isNewUser) {
        return completeRegistrationService(res.user, 'google', res, null, setLoading)
      }
      else {
        setMyUser(res.user)
      }
      setLoading(false)
    })
    .catch((error) => {
      setLoading(false)
      console.log(error)
      if (error.code === 'auth/account-exists-with-different-credential')
        setToasts(infoToast('You have already signed up with a different provider for that email. Please sign in with that provider.'))
      else
        setToasts(errorToast('An errror occurred with the google login. Please try again.'))
    })
}

export const facebookAuthService = (setLoading, setToasts) => {
  setLoading(true)
  const provider = new firebase.auth.FacebookAuthProvider()
  return firebase.auth().signInWithPopup(provider)
    .then((res) => {
      const credential = res.credential
      const user = res.user
      // @ts-ignore
      const accessToken = credential.accessToken
      return fetch(`https://graph.facebook.com/me?access_token=${accessToken}&fields=name,first_name,last_name,email,picture.width(720).height(720)`)
        .then(fbRes => fbRes.json())
        .then(fbRes => {
          console.log(fbRes)
          return completeRegistrationService(user, 'facebook', fbRes, null, setLoading)
        })
        .catch(err => {
          console.log(err)
          setLoading(false)
        })
    })
    .catch((err) => {
      console.log(err)
      if (err.code === 'auth/account-exists-with-different-credential')
        setToasts(infoToast('You have already signed up with a different provider. Please sign in with that provider.'))
      else if (err.code === 'auth/popup-blocked')
        setToasts(infoToast('Popup blocked. Please allow popups for this site.'))
      else
        setToasts(errorToast('An error with facebook has occured. Please try again later.'))
    })
}

export const createAccountOnLoginService = (loggedInUser, setLoading, setToasts) => {
  return doGetUserByID(loggedInUser.uid)
    .then((user) => {
      if (!user) {
        return createUserDocService(loggedInUser, null, 'plain', setLoading)
      }
      else return setToasts(infoToast('User already exists.'))
    })
}

export const deleteAccountService = (setToasts, setLoading) => {
  setLoading(true)
  const settingsArr = ['general', 'invoices', 'estimates', 'contacts', 'payments', 'notifications', 'emails']
  const batch = db.batch()
  settingsArr.forEach(setting => {
    const docRef = db.collection('users').doc(auth.currentUser.uid).collection('settings').doc(setting)
    batch.delete(docRef)
  })
  return batch.commit()
    .then(() => {
      return deleteDB('users', auth.currentUser.uid)
        .then(() => {
          firebase.auth().currentUser.delete()
            .then(() => {
              setToasts(successToast('Account deleted.'))
              setLoading(false)
            })
            .catch(err => {
              setToasts(infoToast('There was an error deleting your account. Please try again.'))
              console.log(err)
              setLoading(false)
            })
        })
        .catch(err => {
          setLoading(false)
          setToasts(infoToast('There was an error deleting your account. Please try again.'))
          console.log(err)
        })
    })
    .catch(err => {
      setLoading(false)
      setToasts(infoToast('There was an error deleting your account. Please try again.'))
      console.log(err)
    })
}