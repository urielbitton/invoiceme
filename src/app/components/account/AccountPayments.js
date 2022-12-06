import { updateDB } from "app/services/CrudDB"
import { createStripeAccountService, 
  deleteStripeAccountService } from "app/services/userServices"
import { StoreContext } from "app/store/store"
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from "react-router-dom"
import AppBadge from "../ui/AppBadge"
import AppButton from "../ui/AppButton"
import './styles/AccountPayments.css'

export default function AccountPayments() {

  const { myUser, myUserID, myUserName, setPageLoading } = useContext(StoreContext)
  const [loading, setLoading] = useState(false)
  const [accountLink, setAccountLink] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const isDetailsSubmitted = searchParams.get('details_submitted') === 'true'
  const navigate = useNavigate()

  const connectStripe = () => {
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
        alert("There was an error creating your Stripe account. Please try again later.")
      }
      setPageLoading(false)
    })
    .catch(err => {
      console.log(err)
      setPageLoading(false)
    })
  }

  const deleteStripeContact = () => {
    const confirm = window.confirm('Are you sure you want to delete your stripe account?')
    if (confirm) {
      setPageLoading(true)
      deleteStripeAccountService(myUserID, myUser?.stripe?.stripeAccountID)
        .then((res) => {
          console.log(res)
          setPageLoading(false)
        })
        .catch(err => {
          console.log(err)
          setPageLoading(false)
        })
    }
  }

  const redirectToAccount = () => {
    alert('Please update your basic info in your profile before connecting your Stripe account.')
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
        <h4>My Cards</h4>
      </div>
      <div className="payments-section">
        <h4>Connected Payments</h4>
        {
          myUser?.stripe?.stripeAccountID &&
          <div className="account-box">
            <i className="fab fa-stripe-s" />
            <div className="account-box-info">
              <h5>Stripe</h5>
              <h6>Connected: <i className={myUser?.stripe?.stripeDetailsSubmitted ? 'fas fa-check-circle' : 'fas fa-times-circle'}/></h6>
              <h6>Name: <span>{myUserName}</span></h6>
              <h6>Customer ID: <span>{myUser?.stripe?.stripeAccountID}</span></h6>
              <h6>Email: <span>{myUser?.email}</span></h6> 
              <div className="btn-group">
                <AppButton
                  label="My Account"
                  buttonType="tabBlueBtn"
                  rightIcon={loading ? 'fas fa-spinner fa-spin' : null}
                  externalLink
                  useATag
                  url="https://connect.stripe.com/express_login"
                />
                <AppButton
                  label="Delete"
                  buttonType="tabRedBtn"
                  className="delete-btn"
                  onClick={() => deleteStripeContact()}
                />
              </div>
            </div>
          </div>
        }
      </div>
      <div className="payments-section">
        <h4>Account Type</h4>
        <AppBadge
          label={myUser?.memberType}
          noIcon
        />
      </div>
    </div>
  )
}
