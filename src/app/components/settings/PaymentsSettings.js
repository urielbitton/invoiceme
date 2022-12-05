import { createStripeAccountService } from "app/services/userServices"
import { StoreContext } from "app/store/store"
import React, { useContext } from 'react'
import AppButton from "../ui/AppButton"
import SettingsSection from "./SettingsSection"
import SettingsTitles from "./SettingsTitles"

export default function PaymentsSettings() {

  const { myMemberType, myUser, myUserName, myUserID,
    setPageLoading } = useContext(StoreContext)
  const isBusiness = myMemberType === "business"

  const connectStripe = () => {
    setPageLoading(true)
    const userData = {
      name: myUserName,
      email: myUser.email,
      phone: myUser.phone,
      metadata: {
        userID: myUserID,
        address: myUser.address,
      }
    }
    createStripeAccountService(userData)
    .then((res) => {
      alert("Stripe account connected successfully.")
      console.log(res)
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
        badge="Business"
      />
      <SettingsSection
        label="Stripe Payments"
        sublabel="Connect your Stripe account to accept and send payments."
        flexStart
      >
        <AppButton
          label={myUser?.stripeCustomerID  ? "Stripe connected" : "Connect Stripe"}
          buttonType={!myUser?.stripeCustomerID ? "outlineBlueBtn" : 'primary'}
          leftIcon="fab fa-stripe-s"
          onClick={() => {
            isBusiness ? 
            myUser?.stripeCustomerID ?
            alert('Stripe account already connected.') :
            connectStripe() :
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
          label={myUser?.paypalEmail ? "PayPal connected" : "Connect PayPal"}
          buttonType={!myUser?.paypalEmail ? "outlineBlueBtn" : 'primary'}
          leftIcon="fab fa-paypal"
          onClick={() => {
            isBusiness ? 
            myUser?.paypalEmail ?
            alert('PayPal account already connected.') :
            window.open('https://paypal.com', '_blank') :
            alert("You must be a business member to access this feature.")
          }}
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
