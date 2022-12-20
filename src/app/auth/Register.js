import React, { useContext, useEffect, useState } from 'react'
import './styles/Auth.css'
import { StoreContext } from 'app/store/store'
import { AppInput } from 'app/components/ui/AppInputs'
import { Link, useNavigate } from 'react-router-dom'
import { clearAuthState } from 'app/services/CrudDB'
import googleIcon from 'app/assets/images/google-icon.png'
import facebookIcon from 'app/assets/images/facebook-icon.png'
import { facebookAuthService, googleAuthService, plainAuthService } from "app/services/authServices"
import { validateEmail } from "app/utils/generalUtils"
import registerCover from 'app/assets/images/register-cover.png'
import logo from 'app/assets/images/logo.png'
import AppButton from "app/components/ui/AppButton"
import { infoToast } from "app/data/toastsTemplates"

export default function Register() {

  const { setMyUser, setToasts } = useContext(StoreContext)
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
  const navigate = useNavigate()

  const clearErrors = () => {
    setEmailError('')
    setPassError('')
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

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!firstName || !lastName) return setToasts(infoToast('Please enter your first and last name.'))
    if (!validateEmail(email)) return setToasts(infoToast('Please enter your email and password.'))
    if (password !== confirmPassword) return setToasts(infoToast('Passwords do not match.'))
    plainAuthService(
      firstName,
      lastName,
      email,
      password,
      setLoading,
      setEmailError,
      setPassError
    )
    clearErrors()
  }

  useEffect(() => {
    clearErrors()
  }, [])

  return (
    <div className="login-page register-page">
      <div className="login-info">
        <div className="container">
        <div className="auth-titles">
            <h4>Sign Up</h4>
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
              <span>Sign Up with Google</span>
            </div>
            <div
              className="facebook-btn btn"
              onClick={() => facebookAuth()}
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
            { emailError && <h6 className="email-error">{emailError}</h6>}
            <div className="double-row">
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
              <AppInput
                label="Confirm Password"
                placeholder="5 characters or more"
                type={showPassword ? 'text' : 'password'}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="password-input"
                iconright={
                  <i
                    className={`fas fa-eye${showPassword ? '-slash' : ''}`}
                    onClick={() => setShowPassword(prev => !prev)}
                  />
                }
              />
            </div>
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
              label="Register"
              onClick={(e) => handleSubmit(e)}
              rightIcon={!loading ? "fal fa-arrow-right" : "fas fa-spinner fa-spin"}
              className="submit-btn"
            />
          </form>
          <h6 className="no-account-text">
            Already have an account?&nbsp;
            <Link to="/login">Login here</Link>
          </h6>
        </div>
      </div>
      <div className="login-cover register-cover">
        <img src={registerCover} alt="register-cover" />
        <h5>Boost your business' invoicing efficiency.</h5>
        <p>Try Invoice Me now and take advantage of exclusive features like scheduled invoices, one-click sending and in-app payouts.</p>
      </div>
    </div>
  )
}
