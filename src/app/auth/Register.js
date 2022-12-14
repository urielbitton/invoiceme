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

export default function Register() {

  const { setMyUser, photoURLPlaceholder } = useContext(StoreContext)
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
    googleAuthService(setMyUser, setLoading)
      .then(() => {
        navigate('/')
      })
  }

  const facebookAuth = () => {
    facebookAuthService(setLoading)
      .then(() => {
        navigate('/')
      })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!firstName || !lastName) return window.alert('Please enter your first and last name.')
    if (!validateEmail(email)) return window.alert('Please enter your email and password.')
    if (password !== confirmPassword) return window.alert('Passwords do not match.')
    plainAuthService(
      firstName, 
      lastName,
      email,
      password,
      setLoading,
      setEmailError,
      setPassError
    )
    .then(() => {
      navigate('/')
    })
    clearErrors()
  }

  useEffect(() => {
    clearErrors()
  }, [])

  return (
    <div className="login-page register-page">
      <div className="login-info">
        <div className="container">
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
              Create Account
              {!loading ? <i className="fal fa-arrow-right" /> : <i className="fas fa-spinner fa-spin" />}
            </button>
            <Link
              to="/login"
              className="no-account-text"
            >
              <h6>Login</h6>
            </Link>
          </form>
        </div>
      </div>
      <div className="login-cover register-cover">

      </div>
    </div>
  )
}
