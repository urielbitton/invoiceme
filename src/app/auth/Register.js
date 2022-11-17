import React, { useContext, useEffect, useState } from 'react'
import './styles/Auth.css'
import { StoreContext } from 'app/store/store'
import { auth } from 'app/firebase/fire'
import { AppInput } from 'app/components/ui/AppInputs'
import { Link } from 'react-router-dom'
import { clearAuthState, setDB } from 'app/services/CrudDB'
import googleIcon from 'app/assets/images/google-icon.png'
import facebookIcon from 'app/assets/images/facebook-icon.png'
import firebase from "firebase"

export default function Register({ standalone }) {

  const { loggingAuth, setLoggingAuth, setMyUser,
    photoURLPlaceholder } = useContext(StoreContext)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passError, setPassError] = useState('')
  const [loading, setLoading] = useState(false)

  const clearErrors = () => {
    setEmailError('')
    setPassError('')
  }

  const completeRegistration = (user, authMode, res) => {
    user.updateProfile({
      displayName: authMode === 'plain' ? `${firstName} ${lastName}` : authMode === 'google' ? res.additionalUserInfo.profile.name : res.name,
      photoURL: authMode === 'facebook' ? res.picture.data.url : photoURLPlaceholder
    })
    setDB('users', user.uid, {
      firstName: authMode === 'plain' ? firstName : authMode === 'google' ? res.additionalUserInfo.profile.given_name : res.first_name,
      lastName: authMode === 'plain' ? lastName : authMode === 'google' ? res.additionalUserInfo.profile.family_name : res.last_name,
      email: authMode === 'plain' ? email : authMode === 'google' ? res.additionalUserInfo.profile.email : res.email,
      photoURL: authMode === 'facebook' ? res.picture.data.url : photoURLPlaceholder,
      address: '',
      location: null,
      phone: '',
      password,
      city: '',
      region: '',
      country: '',
      aboutMe: '',
      userID: user.uid,
      dateJoined: new Date(),
      userTypes: ['renter'],
      activeUserType: 'renter'
    })
      .then(() => {
        setDB(`users/${user.uid}/notifications`, 'welcome', {
          notificationID: 'wellcome',
          dateCreated: new Date(),
          icon: 'fas fa-house-user',
          isRead: false,
          text: `Welcome to Invoice Me! We're glad you're here.`,
          url: '/',
          img: '',
        })
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }

  const handleSignup = (authMode) => {
    if (authMode === 'google') {
      const provider = new firebase.auth.GoogleAuthProvider()
      provider.addScope('email')
      auth.signInWithPopup(provider)
        .then((res) => {
          if (res.additionalUserInfo.isNewUser) {
            completeRegistration(res.user, authMode, res)
          }
          else {
            setMyUser(res.user)
          }
        })
        .catch((error) => {
          console.log(error)
          if (error.code === 'auth/account-exists-with-different-credential')
            window.alert('You have already signed up with a different provider for that email. Please sign in with that provider.')
          else
            window.alert('An errror occurred with the google login. Please try again.')
        })
    }
    else if (authMode === 'facebook') {
      const provider = new firebase.auth.FacebookAuthProvider()
      firebase.auth().signInWithPopup(provider)
        .then((res) => {
          const credential = res.credential
          const user = res.user
          // @ts-ignore
          const accessToken = credential.accessToken
          fetch(`https://graph.facebook.com/me?access_token=${accessToken}&fields=name,first_name,last_name,email,picture.width(720).height(720)`)
            .then(fbRes => fbRes.json())
            .then(fbRes => {
              console.log(fbRes)
              completeRegistration(user, authMode, fbRes)
            })
            .catch(err => {
              console.log(err)
              setLoading(false)
            })
        })
        .catch((err) => {
          console.log(err)
          if (err.code === 'auth/account-exists-with-different-credential')
            window.alert('You have already signed up with a different provider. Please sign in with that provider.')
          else if (err.code === 'auth/popup-blocked')
            window.alert('Popup blocked. Please allow popups for this site.')
          else
            window.alert('An error with facebook has occured. Please try again later.')
        })
    }
    else if (firstName.length && lastName.length && password === confirmPassword && authMode === 'plain') {
      setLoading(true)
      auth.createUserWithEmailAndPassword(email.replaceAll(' ', ''), password.replaceAll(' ', ''))
        .then(() => {
          auth.onAuthStateChanged(user => {
            if (user && loggingAuth === 'signup') {
              completeRegistration(user, authMode)
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
              setEmailError('Please enter a valid email address.'); break;
            case "auth/invalid-email":
              setEmailError('Please enter a valid email address.'); break;
            case "auth/weak-password":
              setPassError('The password is not long enough or too easy to guess.')
              break
            default:
          }
        })
    }
    else {
      window.alert('Please fill in all fields.')
      setLoading(false)
    }
    clearErrors()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleSignup('plain')
  }

  useEffect(() => {
    clearErrors()
  }, [])

  useEffect(() => {
    setLoggingAuth('signup')
  },[])

  return (
    <div className="login-page register-page">
      <div className="login-info">
        <div className="container">
          <div className="social-logins">
            <div
              className="google-btn btn"
              onClick={() => handleSignup('google')}
            >
              <img src={googleIcon} className="img-icon" alt="google-icon" />
              <span>Sign Up with Google</span>
            </div>
            <div
              className="facebook-btn btn"
              onClick={() => handleSignup('facebook')}
            >
              <img src={facebookIcon} className="img-icon" alt="facebook-icon" />
              <span>Sign Up with Facebook</span>
            </div>
          </div>
          <small className="sep-alt"><hr /><span>Or register with email</span><hr /></small>
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="double-row">
              <AppInput
                label="First Name"
                placeholder="Jane"
                onChange={(e) => setFirstName(e.target.value)}
              />
              <AppInput
                label="Last Name"
                placeholder="Anderson"
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <AppInput
              label="Email"
              placeholder="james@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
            />
            <h6 className="email-error">{emailError}</h6>
            <div className="double-row">
              <AppInput
                label="Password"
                placeholder="5 characters or more"
                type={showPassword ? 'text' : 'password'}
                onChange={(e) => setPassword(e.target.value)}
                iconright={
                  <i
                    className={`fas fa-eye${showPassword ? '-slash' : ''}`}
                    onClick={() => setShowPassword(prev => !prev)}
                  />
                }
                className="password-input"
              />
              <AppInput
                label="Confirm Password"
                placeholder="5 characters or more"
                type={showPassword ? 'text' : 'password'}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="password-input"
              />
            </div>
            <h6 className="email-error">{passError}</h6>
            {loggingAuth === 'signin' ?
              <div className="login-options">
                <label>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => {
                      setRememberMe(e.target.checked)
                      clearAuthState(e.target.checked)
                    }}
                  />
                  <span>Remember Me</span>
                </label>
                <Link to="/forgot-password" className="linkable">Forgot password?</Link>
              </div> :
              <div style={{ height: 20 }} />
            }
            <button
              className="submit-btn"
              onClick={(e) => handleSubmit(e)}
            >
              Create Account
              {!loading ? <i className="fal fa-arrow-right" /> : <i className="fas fa-spinner fa-spin" />}
            </button>
            {
              !standalone ?
                <small className="no-account-text">
                  Already have an account?
                  <h6 onClick={() => setLoggingAuth('signin')}>Login</h6>
                </small> :
                <Link
                  to="/login"
                  className="no-account-text"
                >
                  <h6>Login</h6>
                </Link>
            }
          </form>
        </div>
      </div>
      <div className="login-cover register-cover">

      </div>
    </div>
  )
}
