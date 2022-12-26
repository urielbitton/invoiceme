import AuthSwitch from "app/auth/AuthSwitch"
import AppLoadingPage from "app/components/ui/AppLoadingPage"
import { StoreContext } from "app/store/store"
import React, { useContext } from 'react'
import AppContainer from "./AppContainer"
import ToastsColumn from "./ToastsColumn"
import VerifySwitcher from "./VerifySwitcher"

export default function AppSwitcher() {

  const { user, myUser } = useContext(StoreContext)

  return (
    <>
      {
        user ?
          (user?.emailVerified && myUser?.userID) ?
            <AppContainer /> :
          <VerifySwitcher /> :
          myUser === null ?
            <AppLoadingPage /> :
        <AuthSwitch />
      }
      <ToastsColumn />
    </>
  )
}
