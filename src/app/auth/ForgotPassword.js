import React, { useState } from 'react'
import { AppInput } from 'app/components/ui/AppInputs'
import { Link } from "react-router-dom"
import { auth } from 'app/firebase/fire'
import './styles/ForgotPassword.css'
import resetPassword from 'app/assets/images/reset-password.png'
import AppButton from "app/components/ui/AppButton"

export default function ForgotPassword() {

  const [email, setEmail] = useState('')
  const [feedback, setFeedback] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSendEmail = () => {
    if(email.length) {
      setLoading(true)
      auth.sendPasswordResetEmail(email)
        .then(() => {
          setLoading(false)
          setSuccess(true)
          setShowFeedback(true)
          setFeedback('A password reset link was sent to your email. Follow the instructions in your email.')
        })
        .catch(error => {
          setLoading(false)
          console.log(error)
          setSuccess(false)
          setShowFeedback(true)
          setFeedback('There was an error sending the password reset link. Please make sure you have the correct email.')
        })
    }
  }

  return <div className="forgot-password-page">
    <div className="content">
      <section>
        <img src={resetPassword} alt="forgot password" />
        <h3>Forgot Password</h3>
        <small className="description">Enter your email and we'll send you a link to reset your password.</small>
        <AppInput
          placeholder="jane@invoiceme.pro"
          onChange={(e) => setEmail(e.target.value)}
        />
        <AppButton
          label="Submit"
          onClick={() => handleSendEmail()}
        />
        <Link
          to="/"
          className="back-to-login linkable"
        >
          Back to login
        </Link>
        <span
          style={{
            color: success ? 'var(--primary)' : 'var(--red)',
            display: showFeedback ? 'block' : 'none'
          }}
          className="feedback"
        >
          {feedback}
        </span>
      </section>
    </div>
  </div>
}
