import React from 'react'
import { useSearchParams } from "react-router-dom"
import ResetPasswordHandler from "app/auth/handlers/ResetPasswordHandler"
import RecoverEmailHandler from "app/auth/handlers/RecoverEmailHandler"
import VerifyEmailHandler from "app/auth/handlers/VerifyEmailHandler"

export default function UserManagement() {

  const [searchParams, setSearchParams] = useSearchParams()
  const mode = searchParams.get('mode')
  const oobCode = searchParams.get('oobCode')
  const continueUrl = searchParams.get('continueUrl')

  return (
    mode === 'resetPassword' ?
      <ResetPasswordHandler
        oobCode={oobCode} 
      /> :
      mode === 'recoverEmail' ?
      <RecoverEmailHandler 
        oobCode={oobCode} 
      /> :
      mode === 'verifyEmail' ? 
      <VerifyEmailHandler 
        oobCode={oobCode} 
        continueUrl={continueUrl}
      /> :
      <>Mode is invalid. Please make sure your email link is valid.</>
  )
}
