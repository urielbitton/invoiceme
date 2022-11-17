import PageLoader from "app/components/ui/PageLoader"
import { StoreContext } from "app/store/store"
import React, { useContext } from 'react'
import AppContainer from "./app/containers/AppContainer"

export default function AppSwitcher() {

  const { myUser } = useContext(StoreContext)

  return (
    myUser !== null ?
    <AppContainer /> :
    <PageLoader loading />
  )
}
