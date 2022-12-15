import React, { useContext, useState } from 'react'
import verifyEmailImg from 'app/assets/images/verify-email.png'
import AuthHandlerPage from "app/components/ui/AuthHandlerPage"
import { auth } from "app/firebase/fire"
import { errorToast, successToast } from "app/data/toastsTemplates"
import { StoreContext } from "app/store/store"

export default function UnverifiedEmailPage() {

  const { setToasts } = useContext(StoreContext)
  const user = auth.currentUser
  const [loading, setLoading] = useState(false)

  const sendVerificationEmail = () => {
    setLoading(true)
    const ActionCodeSettings = {
      url: `https://invoiceme.pro?userID=${user.uid}&firstName=${user.displayName.split(' ')[0]}&lastName=${user.displayName.split(' ')[1]}`,
    }
    user.sendEmailVerification(ActionCodeSettings)
    .then(() => {
      setToasts(successToast('Verification email sent!'))
      setLoading(false)
    })
    .catch((error) => {
      setToasts(errorToast('Error sending verification email. Please try again.'))
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
