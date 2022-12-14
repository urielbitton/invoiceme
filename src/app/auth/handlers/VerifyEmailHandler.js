import AuthHandlerPage from "app/components/ui/AuthHandlerPage"
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { createUserDocService } from "app/services/userServices"
import { StoreContext } from "app/store/store"
import firebase from 'firebase'
import verifyAccountImg from 'app/assets/images/verify-account.png'
import { errorToast, successToast } from "app/data/toastsTemplates"

export default function VerifyEmailHandler({ oobCode, continueUrl }) {

  const { setPageLoading, setToasts } = useContext(StoreContext)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const auth = firebase.auth()
  const user = auth.currentUser
  const userID = continueUrl.split('userID=')[1]

  const handleVerifyEmail = (auth, oobCode) => {
    if (!oobCode) return setToasts(errorToast('Invalid action code. Please make sure your email link is valid.'))
    setLoading(true)
    auth.applyActionCode(oobCode)
      .then(() => {
        if (user) {
          setToasts(successToast('Your email has been verified. Redirecting to homepage...'))
          createUserDocService(
            user,
            null,
            'plain',
            setPageLoading
          )
            .then(() => {
              setLoading(false)
              navigate('/')
              window.location.reload()
            })
            .catch((error) => {
              console.log(error)
              setLoading(false)
              setToasts(errorToast('Error creating user document. Please try again.'))
            })
        }
        else {
          setToasts(successToast('Your email has been verified. You can now log in to your account.'))
          navigate(`/login?createAccount=true&userID=${userID}`)
          setLoading(false)
        }
      })
      .catch((error) => {
        console.log(error)
        setToasts(errorToast('The link is invalid or has expired. Please verify your email again.'))
      })
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      handleVerifyEmail(auth, oobCode)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AuthHandlerPage
      contentImg={verifyAccountImg}
      title="Account Verified!"
      description="Congratulations! Your account has been verified. You will be redirected to the homepage right away.
       Click the button below if you are not redirected automatically."
      btnLabel="Home"
      onClick={() => navigate('/')}
      loading={loading}
    />
  )
}
