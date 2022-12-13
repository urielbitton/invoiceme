import React, { useState } from 'react'
import firebase from 'firebase'
import AuthHandlerPage from "app/components/ui/AuthHandlerPage"
import resetPasswordImg from 'app/assets/images/reset-password.png'
import AppButton from "app/components/ui/AppButton"
import { useNavigate } from "react-router-dom"

export default function ResetPasswordHandler({oobCode}) {

  const [newPassword, setNewPassword] = useState('')
  const auth = firebase.auth()
  const navigate = useNavigate()

  const handleResetPassword = (oobCode) => {
    auth.verifyPasswordResetCode(oobCode)
    .then((email) => {
      auth.confirmPasswordReset(oobCode, newPassword)
      .then((res) => {
        alert('Password reset successful')
        auth.signInWithEmailAndPassword(email, newPassword)
        .then(() => {
          navigate('/')
        })
        .catch((err) => {
          alert('There was an error signing you in. Please try again.')
          console.log(err)
        })
      })
      .catch((err) => {
        alert('An error occured, make sure the password is valid and the reset code has not expired.')
        console.log(err)
      })
    }).catch((err) => {
      alert('The reset code has expired or is invalid. Please try again.')
      console.log(err)
    })
  }

  return (
    <AuthHandlerPage
      contentImg={resetPasswordImg}
      title="Reset your password"
      description="Create a new password for your account."
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
          />
        </div>
      }
    />
  )
}
