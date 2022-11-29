import HelmetTitle from "app/components/ui/HelmetTitle"
import React from 'react'

export default function MyAccountPage() {
  return (
    <div>
      <HelmetTitle title="My Account" />
      MyAccount<br/>
      Show brief stats of total all time revenue(homepage shows yearly only), all time invocies, estimates, contacts, etc.<br/>
      tabs: Account Info (delete account), stats, upgrade account
    </div>
  )
}
