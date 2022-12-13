import AuthSwitch from "app/auth/AuthSwitch"
import AppLoadingPage from "app/components/ui/AppLoadingPage"
import { auth } from "app/firebase/fire"
import { StoreContext } from "app/store/store"
import React, { useContext } from 'react'
import AppContainer from "./AppContainer"
import VerifySwitcher from "./VerifySwitcher"

export default function AppSwitcher() {

  const { user, myUser } = useContext(StoreContext)
  const authUser = auth.currentUser
  console.log('email verified', authUser?.emailVerified)

  return (
    user ?
    user?.emailVerified ?
    <AppContainer /> :
    <VerifySwitcher /> :
    myUser === null ?
    <AppLoadingPage /> :
    <AuthSwitch />
  )
}
