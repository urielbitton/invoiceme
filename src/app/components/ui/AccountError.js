import { signOut } from "app/services/CrudDB"
import { StoreContext } from "app/store/store"
import React, { useContext } from 'react'
import AppButton from "./AppButton"

export default function AccountError() {

  const { setPageLoading } = useContext(StoreContext)

  return (
    <>
      There is an error with your account.<br />
      <AppButton
        label="Sign Out"
        onClick={() => signOut(setPageLoading)}
      />
    </>
  )
}
