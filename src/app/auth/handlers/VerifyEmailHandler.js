import AuthHandlerPage from "app/components/ui/AuthHandlerPage"
import React, { useContext } from 'react'
import verifyEmailImg from 'app/assets/images/verify-email.png'
import { useNavigate } from "react-router-dom"
import { createUserDocService } from "app/services/userServices"
import { StoreContext } from "app/store/store"

export default function VerifyEmailHandler({mode, oobCode, auth}) {

  const { user, photoURLPlaceholder, setPageLoading } = useContext(StoreContext)
  const navigate = useNavigate()

  const handleVerifyEmail = (auth, actionCode) => {
    auth.applyActionCode(actionCode)
    .then((res) => {
      alert('Email verified!')
      createUserDocService(
        user,
        null,
        'plain',
        photoURLPlaceholder,
        user?.firstName,
        user?.lastName,
        user?.email,
        setPageLoading
      )
      .then(() => {
        navigate('/')
      })
      .catch((error) => console.log(error))
    })
    .catch((error) => {
      alert('The link is invalid or has expired. Please verify your email again.')
    })
  }

  return (
    <AuthHandlerPage
      contentImg={verifyEmailImg}
      title="Verify your account"
      description="To get started, please verify your email address by clicking the button below."
      btnLabel="Verify Account"
      btnOnClick={() => handleVerifyEmail(auth, oobCode)}
    />
  )
}
