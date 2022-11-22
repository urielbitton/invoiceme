import AppButton from "app/components/ui/AppButton"
import HelmetTitle from "app/components/ui/HelmetTitle"
import { StoreContext } from "app/store/store"
import React, { useContext } from 'react'
import { Link } from "react-router-dom"

export default function UpgradePage() {

  const { myMemberType } = useContext(StoreContext)

  return (
    myMemberType !== 'business' ?
    <div>
      <HelmetTitle title="Upgrade To Business" />
      UpgradePage
    </div> :
    <div>
      <h4>You are already a business member</h4>
      <br/>
      <AppButton
        label="My Account"
        url="/my-account"
      />
    </div>
  )
}
