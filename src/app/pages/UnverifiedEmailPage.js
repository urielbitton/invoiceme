import React, { useState } from 'react'
import verifyEmailImg from 'app/assets/images/verify-email.png'
import AuthHandlerPage from "app/components/ui/AuthHandlerPage"
import { auth } from "app/firebase/fire"

export default function UnverifiedEmailPage() {

  const user = auth.currentUser
  const [loading, setLoading] = useState(false)

  const sendVerificationEmail = () => {
    setLoading(true)
    const ActionCodeSettings = {
      url: `https://invoiceme.pro/user-management?userID=${user.uid}`,
    }
    user.sendEmailVerification(ActionCodeSettings)
    .then(() => {
      alert('Verification email sent!')
      setLoading(false)
    })
    .catch((error) => {
      alert('Error sending verification email. Please try again.')
      console.log(error)
      setLoading(false)
    })
  }

  return (
    <AuthHandlerPage
      contentImg={verifyEmailImg}
      title="Verify your email"
      description="We've created an account for you, all you need to do now is verify it by clicking on the link we sent to your email."
      btnLabel="Resend Verification"
      btnOnClick={sendVerificationEmail}
      loading={loading}
    />
  )
}
