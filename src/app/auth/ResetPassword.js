import React, { useContext, useState } from 'react'
import { AppInput } from 'app/components/ui/AppInputs'
import { Link } from "react-router-dom"
import './styles/ForgotPassword.css'
import { StoreContext } from "app/store/store"
import { useNavigate } from "react-router-dom"

export default function ResetPassword() {

  const { user, setPageLoading } = useContext(StoreContext)
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
 
  const handleReset = () => {
    if(password.length > 5) {
      setPageLoading(true)
      user.updatePassword(password)
      .then(() => {
        setPageLoading(false)
        navigate('/')
      })
      .catch(error => {
        console.log(error)
        window.alert('An error occured while changing your password. Please try again later.')
        setPageLoading(false)
      })
    }
  }

  return <div className="forgot-password-page">
    <div className="content">
      <header>
        <img src="" alt="" />
        <h4>App</h4>
      </header>
      <section>
        <h3>Reset Password</h3>
        <small className="description">Once you reset a password you can go back and login again with your new password.</small>
        <AppInput 
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
        />
        <button 
          onClick={() => handleReset()}
          className="shadow-hover"
        >Reset Password</button>
        <Link 
          to="/" 
          className="back-to-login linkable"
        >Back to login</Link>
      </section>
    </div>
  </div>
}
