import { StoreContext } from "app/store/store"
import React, { useContext } from 'react'
import AppButton from "../ui/AppButton"
import SettingsSection from "./SettingsSection"
import SettingsTitles from "./SettingsTitles"

export default function PaymentsSettings() {

  const { myUser } = useContext(StoreContext)
  const hasStripe = myUser?.stripe?.stripeAccountID

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
          label={!hasStripe ? "Connect Stripe" : "Manage Account"}
          url={hasStripe ? "https://connect.stripe.com/express_login" : "/my-account/payments"}
          useATag={hasStripe}
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
