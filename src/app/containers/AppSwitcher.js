import AuthSwitch from "app/auth/AuthSwitch"
import AppLoadingPage from "app/components/ui/AppLoadingPage"
import UnverifiedEmailPage from "app/pages/UnverifiedEmailPage"
import { StoreContext } from "app/store/store"
import React, { useContext } from 'react'
import AppContainer from "./AppContainer"

export default function AppSwitcher() {

  const { user, myUser } = useContext(StoreContext)

  return (
    user ?
    user?.emailVerified ?
    <AppContainer /> :
    <UnverifiedEmailPage /> :
    myUser === null ?
    <AppLoadingPage /> :
    <AuthSwitch />
  )
}
