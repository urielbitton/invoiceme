import AuthHandlerPage from "app/components/ui/AuthHandlerPage"
import React, { useContext } from 'react'
import { useNavigate } from "react-router-dom"
import { createUserDocService } from "app/services/userServices"
import { StoreContext } from "app/store/store"
import firebase from 'firebase'
import verifyAccountImg from 'app/assets/images/verify-account.png'

export default function VerifyEmailHandler({oobCode}) {

  const { user, photoURLPlaceholder, setPageLoading } = useContext(StoreContext)
  const navigate = useNavigate()
  const auth = firebase.auth()

  const handleVerifyEmail = (auth, oobCode) => {
    if(!oobCode) return alert('Invalid action code. Please make sure your email link is valid.')
    auth.applyActionCode(oobCode)
    .then(() => {
      alert('Email verified!')
      createUserDocService(
        user,
        null,
        'plain',
        photoURLPlaceholder,
        user?.displayName?.split(' ')[0],
        user?.displayName?.split(' ')[1],
        user?.email,
        setPageLoading
      )
      .then(() => {
        navigate('/')
        window.location.reload()
      })
      .catch((error) => console.log(error))
    })
    .catch((error) => {
      console.log(error)
      alert('The link is invalid or has expired. Please verify your email again.')
    })
  }

  return (
    <AuthHandlerPage
      contentImg={verifyAccountImg}
      title="Verify your account"
      description="To get started, please verify your email address by clicking the button below."
      btnLabel="Verify Account"
      btnOnClick={() => handleVerifyEmail(auth, oobCode)}
    />
  )
}
