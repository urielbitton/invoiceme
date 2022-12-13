import React, { useState } from 'react'
import firebase from 'firebase'
import AuthHandlerPage from "app/components/ui/AuthHandlerPage"
import resetPasswordImg from 'app/assets/images/reset-password.png'
import AppButton from "app/components/ui/AppButton"
import { useNavigate } from "react-router-dom"

export default function ResetPasswordHandler({oobCode}) {

  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const auth = firebase.auth()
  const navigate = useNavigate()

  const handleResetPassword = (oobCode) => {
    if(newPassword.length < 5) return alert('Password must be at least 5 characters long.')
    setLoading(true)
    auth.verifyPasswordResetCode(oobCode)
    .then((email) => {
      return auth.confirmPasswordReset(oobCode, newPassword)
      .then((res) => {
        alert('Password reset successful. Signing you in...')
        return auth.signInWithEmailAndPassword(email, newPassword)
        .then(() => {
          navigate('/')
          setLoading(false)
        })
        .catch((err) => {
          alert('There was an error signing you in. Please try again.')
          console.log(err)
          setLoading(false)
        })
      })
      .catch((err) => {
        alert('An error occured, make sure the password is valid and the reset code has not expired.')
        console.log(err)
        setLoading(false)
      })
    }).catch((err) => {
      setLoading(false)
      alert('The reset code has expired or is invalid. Please try again.')
      console.log(err)
    })
  }

  return (
    <AuthHandlerPage
      contentImg={resetPasswordImg}
      title="Reset your password"
      description="Create a new password for your account."
      loading={loading}
      customComponent={
        <div className="password-section">
          <input 
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
          <AppButton
            label="Reset password"
            onClick={() => handleResetPassword(oobCode)}
            disabled={loading || !newPassword.length}
          />
        </div>
      }
    />
  )
}
