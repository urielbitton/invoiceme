import AuthHandlerPage from "app/components/ui/AuthHandlerPage"
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { createUserDocService, doGetUserByID } from "app/services/userServices"
import { StoreContext } from "app/store/store"
import firebase from 'firebase'
import verifyAccountImg from 'app/assets/images/verify-account.png'

export default function VerifyEmailHandler({oobCode, continueUrl}) {

  const { setPageLoading } = useContext(StoreContext)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const auth = firebase.auth()

  const handleVerifyEmail = (auth, oobCode) => {
    if(!oobCode) return alert('Invalid action code. Please make sure your email link is valid.')
    setLoading(true)
    auth.applyActionCode(oobCode)
    .then(() => {
      alert('Email verified! You will now be redirected to the home page.')
      const userID = continueUrl.split('userID%')[1]
      doGetUserByID(userID)
      .then((user) => {
        createUserDocService(
          user,
          null,
          'plain',
          setPageLoading
        )
        .then(() => {
          setLoading(false)
          navigate('/')
        })
        .catch((error) => {
          console.log(error)
          setLoading(false)
          alert('Error creating user document. Please try again.')
        })
      })
      .catch((error) => {
        console.log(error)
        setLoading(false)
        alert('Error getting user credentials. Please try again.')
      })
    })
    .catch((error) => {
      console.log(error)
      alert('The link is invalid or has expired. Please verify your email again.')
    })
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      handleVerifyEmail(auth, oobCode)
    }, 3000)
    return () => clearTimeout(timer)
  },[])

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
