import React, { useContext, useState } from 'react'
import './styles/Auth.css'
import { StoreContext } from 'app/store/store'
import { AppInput } from 'app/components/ui/AppInputs'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import googleIcon from 'app/assets/images/google-icon.png'
import facebookIcon from 'app/assets/images/facebook-icon.png'
import { auth } from 'app/firebase/fire'
import { clearAuthState } from "app/services/CrudDB"
import loginCover from 'app/assets/images/login-cover.png'
import logo from 'app/assets/images/logo.png'
import AppButton from "app/components/ui/AppButton"
import { createAccountOnLoginService, facebookAuthService, googleAuthService } from "app/services/authServices"
import { infoToast } from "app/data/toastsTemplates"

export default function Login() {

  const { setMyUser, setToasts } = useContext(StoreContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passError, setPassError] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const createAccount = searchParams.get('createAccount') === 'true'
  const userID = searchParams.get('userID')

  const handleLogin = () => {
    setLoading(true)
    clearErrors()
    auth.signInWithEmailAndPassword(email.replaceAll(' ', ''), password.replaceAll(' ', ''))
      .then((userCredential) => {
        if (!createAccount || !userID) {
          setLoading(false)
          navigate('/')
        }
        else {
          const user = userCredential.user
          if (user.uid !== userID) return setToasts(infoToast('Unauthorized login. Please try again'))
          createAccountOnLoginService(user, setLoading, setToasts)
            .then(() => {
              setLoading(false)
              navigate('/')
            })
            .catch((error) => console.log(error))
        }
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

  const googleAuth = () => {
    googleAuthService(setMyUser, setLoading, setToasts)
      .then(() => {
        navigate('/')
      })
  }

  const facebookAuth = () => {
    facebookAuthService(setLoading, setToasts)
      .then(() => {
        navigate('/')
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
          <div className="auth-titles">
            <h4>Sign In</h4>
            <div className="logo-container">
              <img src={logo} className="logo" alt="logo" />
            </div>
          </div>
          <div className="social-logins">
            <div
              className="google-btn btn"
              onClick={() => googleAuth()}
            >
              <img src={googleIcon} className="img-icon" alt="google-icon" />
              <span>Sign In with Google</span>
            </div>
            <div
              className="facebook-btn btn"
              onClick={() => facebookAuth()}
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
            { emailError && <h6 className="email-error">{emailError}</h6> }
            <AppInput
              label="Password"
              placeholder="5 characters or more"
              type={showPassword ? 'text' : 'password'}
              onChange={(e) => setPassword(e.target.value)}
              className="password-input"
              iconright={
                <i
                  className={`fas fa-eye${showPassword ? '-slash' : ''}`}
                  onClick={() => setShowPassword(prev => !prev)}
                />
              }
            />
            { passError && <h6 className="email-error">{passError}</h6>}
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
            <AppButton
              label="Login"
              onClick={(e) => handleSubmit(e)}
              rightIcon={!loading ? "fal fa-arrow-right" : "fas fa-spinner fa-spin"}
              className="submit-btn"
            />
          </form>
          <h6 className="no-account-text">
            Don't have an account yet?&nbsp;
            <Link to="/register">Join Invoice Me</Link>
          </h6>
        </div>
      </div>
      <div className="login-cover">
        <img src={loginCover} alt="login-cover" />
        <h5>Boost your business' invoicing efficiency.</h5>
        <p>Try Invoice Me now and take advantage of exclusive features like scheduled invoices, one-click sending and in-app payouts.</p>
      </div>
    </div>
  )
}
