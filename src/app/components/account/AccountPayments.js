import { updateDB } from "app/services/CrudDB"
import { createStripeAccountService } from "app/services/userServices"
import { StoreContext } from "app/store/store"
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from "react-router-dom"
import AppButton from "../ui/AppButton"
import './styles/AccountPayments.css'

export default function AccountPayments() {

  const { myUser, myUserID, setPageLoading } = useContext(StoreContext)
  const [accountLink, setAccountLink] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const isDetailsSubmitted = searchParams.get('details_submitted') === 'true'
  const navigate = useNavigate()

  const connectStripe = () => {
    if(myUser?.stripe?.stripeAccountID) return
    const confirm = window.confirm('Are you sure you want to create an account a Stripe account? This will allow you to send & receive payments on Invoice Me.')
    if(!confirm) return
    setPageLoading(true)
    createStripeAccountService(myUserID, {
      country: myUser?.countryCode,
      email: myUser?.email || '',
      firstName: myUser?.firstName || '',
      lastName: myUser?.lastName || '',
      phone: myUser?.phone || '',
      address: myUser?.address || '',
      city: myUser?.city || '',
      state: myUser?.regionCode || '',
      postcode: myUser?.postcode || '',
    })
    .then((accountLink) => {
      if(accountLink) {
        alert("Stripe account created successfully.")
        setAccountLink(accountLink.url)
      }
      else {
        alert("There was an error creating your Stripe account. Please make sure your personal account information is valid (email, phone, postal code, etc.)")
        navigate('/my-account')
      }
      setPageLoading(false)
    })
    .catch(err => {
      console.log(err)
      setPageLoading(false)
    })
  }

  const redirectToAccount = () => {
    alert('Please update your country in your profile before connecting your Stripe account.')
    navigate('/my-account')
  }

  useEffect(() => {
    if (isDetailsSubmitted && myUser?.stripe?.stripeAccountID) {
      updateDB('users', myUserID, { 
        "stripe.stripeDetailsSubmitted": true 
      })
      .then(() => {
        setSearchParams({})
        alert("Your Stripe account has been successfully connected.")
      })
      .catch(err => console.log(err))
    }
  },[searchParams])

  return (
    <div className="account-payments">
      {
        (!myUser?.stripe?.stripeAccountID || !myUser?.stripe?.stripeDetailsSubmitted) && !accountLink ?
        <AppButton
          label="Connect Stripe"
          buttonType="outlineBlueBtn"
          leftIcon="fab fa-stripe-s"
          onClick={() => {
            myUser?.countryCode?.length < 1 ?
            redirectToAccount() :
            connectStripe() 
          }}
          className="connect-stripe-btn"
        /> :
        (!myUser?.stripe?.stripeDetailsSubmitted && myUser?.stripe?.stripeAccountID) && accountLink &&
        <AppButton
          label="Complete Stripe Setup"
          rightIcon="fab fa-stripe-s"
          useATag
          url={accountLink}
          className="connect-stripe-btn"
        />
      }
      <div className="payments-section">
        <h4>My Payments</h4>
        <AppButton
          label="View My Payments"
          url="/payments"
          buttonType="outlineBlueBtn"
        />
      </div>
      <div className="payments-section">
        <h4>Send a Payment</h4>
        <AppButton
          label="New Payment"
          url="/payments/new"
          buttonType="outlineBlueBtn"
        />
      </div>
    </div>
  )
}
