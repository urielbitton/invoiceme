import { StoreContext } from "app/store/store"
import React, { useContext } from 'react'
import AppButton from "../ui/AppButton"
import SettingsSection from "./SettingsSection"
import SettingsTitles from "./SettingsTitles"

export default function PaymentsSettings() {

  const { myMemberType } = useContext(StoreContext)
  const isBusiness = myMemberType === "business"

  return (
    <div className="settings-sub-page">
      <SettingsTitles
        label="Payments"
        sublabel="Manage and choose your payment options."
        icon="fas fa-credit-card"
        badge="Business"
      />
      <SettingsSection
        label="Stripe Payments"
        sublabel="Connect your Stripe account to accept and send payments."
        flexStart
      >
        <AppButton
          label="Connect Stripe"
          buttonType="outlineBlueBtn"
          leftIcon="fab fa-stripe-s"
          onClick={() => {
            isBusiness ? window.open('https://stripe.com', '_blank') :
            alert("You must be a business member to access this feature.")
          }}
        />
      </SettingsSection>
      <SettingsSection
        label="PayPal Payments"
        sublabel="Connect your PayPal account to accept and send payments."
        flexStart
      >
        <AppButton
          label="Connect PayPal"
          buttonType="outlineBlueBtn"
          leftIcon="fab fa-paypal"
          onClick={() => {
            isBusiness ? window.open('https://paypal.com', '_blank') :
            alert("You must be a business member to access this feature.")
          }}
        />
      </SettingsSection>
    </div>
  )
}
