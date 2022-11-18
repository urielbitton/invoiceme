import React, { useContext, useState } from 'react'
import './styles/Auth.css'
import { StoreContext } from 'app/store/store'
import { AppInput } from 'app/components/ui/AppInputs'
import { Link } from 'react-router-dom'
import googleIcon from 'app/assets/images/google-icon.png'
import facebookIcon from 'app/assets/images/facebook-icon.png'
import { auth } from 'app/firebase/fire'
import firebase from "firebase"
import { clearAuthState } from "app/services/CrudDB"

export default function Login() {

  const { setMyUser, user } = useContext(StoreContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passError, setPassError] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
 
  const handleLogin = () => {
    setLoading(true)
    clearErrors()
    auth.signInWithEmailAndPassword(email.replaceAll(' ', ''), password.replaceAll(' ', ''))
      .then(() => {
        setLoading(false)
      })
      .catch(err => {
        setLoading(false)
        switch (err.code) {
          case "auth/invalid-email":
            return setEmailError('Make sure to enter a valid email.')
          case "auth/user/disabled":
            return setEmailError('This user is disabled.')
          case "auth/user-not-found":
            return setEmailError('This user does not exist.')
          case "auth/wrong-password":
            setPassError('Password is incorrect')
            break
          default:
        }
      })
  }

  const googleLogin = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    provider.addScope('email')
    firebase.auth().signInWithPopup(provider)
      .then((res) => {
        if (!res.additionalUserInfo.isNewUser) {
          setMyUser(res.user)
        }
        else {
          setMyUser(null)
          window.alert('This info is not associated with a google account.')
        }
      })
      .catch((error) => {
        console.log(error)
        window.alert('An errror occurred with the google login. Please try again.')
      })
  }

  const facebookLogin = () => {
    const provider = new firebase.auth.FacebookAuthProvider()
    firebase.auth().signInWithPopup(provider)
      .then((res) => {
        const credential = res.credential
        const user = res.user
        // @ts-ignore
        const accessToken = credential.accessToken
        console.log(accessToken, user)
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

  const clearErrors = () => {
    setEmailError('')
    setPassError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleLogin()
  }

  return (
    <div className="login-page">
      <div className="login-info">
        <div className="container">
          <div className="social-logins">
            <div
              className="google-btn btn"
              onClick={() => googleLogin()}
            >
              <img src={googleIcon} className="img-icon" alt="google-icon" />
              <span>Sign In with Google</span>
            </div>
            <div
              className="facebook-btn btn"
              onClick={() => facebookLogin()}
            >
              <img src={facebookIcon} className="img-icon" alt="facebook-icon" />
              <span>Sign In with Facebook</span>
            </div>
          </div>
          <small className="sep-alt"><hr /><span>Or sign in with email</span><hr /></small>
          <form onSubmit={(e) => handleSubmit(e)}>
            <AppInput
              label="Email"
              placeholder="james@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
            />
            <h6 className="email-error">{emailError}</h6>
            <AppInput
              label="Password"
              placeholder="5 characters or more"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <h6 className="email-error">{passError}</h6>
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
            </div>
            <button
              className="submit-btn"
              onClick={(e) => handleSubmit(e)}
            >
              Login
              {!loading ? <i className="fal fa-arrow-right" /> : <i className="fas fa-spinner fa-spin" />}
            </button>
            <Link
              to="/register"
              className="no-account-text"
            >
              <h6>Create An Account</h6>
            </Link>
          </form>
        </div>
      </div>
    </div>
  )
}
