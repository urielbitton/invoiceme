import { successToast } from "app/data/toastsTemplates"
import { createStripeAccountService } from "app/services/userServices"
import { StoreContext } from "app/store/store"
import React, { useContext, useState } from 'react'
import AppButton from "../ui/AppButton"
import SettingsSection from "./SettingsSection"
import SettingsTitles from "./SettingsTitles"

export default function PaymentsSettings() {

  const { myMemberType, myUser, myUserID, setPageLoading,
    setToasts } = useContext(StoreContext)
  const isBusiness = myMemberType === "business"
  const [accountLink, setAccountLink] = useState(null)

  const connectStripe = () => {
    setPageLoading(true)
    createStripeAccountService(myUserID, {
      country: myUser?.countryCode,
    })
    .then((accountLink) => {
      setToasts(successToast("Stripe account connected successfully."))
      setAccountLink(accountLink.url)
      setPageLoading(false)
    })
    .catch(err => {
      console.log(err)
      setPageLoading(false)
    })
  }

  return (
    <div className="settings-sub-page">
      <SettingsTitles
        label="Payments"
        sublabel="Manage and choose your payment options."
        icon="fas fa-credit-card"
      />
      <SettingsSection
        label="Stripe Payments"
        sublabel="Connect your Stripe account to accept and send payments."
        flexStart
      >
        <AppButton
          label="Connect Stripe"
          url="/my-account/payments"
        />
      </SettingsSection>
      <SettingsSection
        label="Account Payments"
        sublabel="View and manage your account payments."
        flexStart
      >
        <AppButton
          label="Account Payments"
          leftIcon="fas fa-credit-card"
          url="/my-account/payments"
        />
      </SettingsSection>
    </div>
  )
}
