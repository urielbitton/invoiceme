import { useStripeCustomer } from "app/hooks/paymentHooks"
import { updateDB } from "app/services/CrudDB"
import { createAccountLinkService, createStripeAccountService, deleteStripeAccountService } from "app/services/userServices"
import { StoreContext } from "app/store/store"
import { convertClassicUnixDate } from "app/utils/dateUtils"
import { formatCurrency } from "app/utils/generalUtils"
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from "react-router-dom"
import AppButton from "../ui/AppButton"
import './styles/AccountPayments.css'

export default function AccountPayments() {

  const { myUser, myUserID, setPageLoading, myMemberType,
    myUserName, stripeCustomerPortalLink } = useContext(StoreContext)
  const [accountLink, setAccountLink] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const customer = useStripeCustomer(myUser?.stripe?.stripeCustomerID)
  const navigate = useNavigate()
  const isBusiness = myMemberType === 'business'

  const connectStripe = () => {
    if (myUser?.stripe?.stripeAccountID) return
    const confirm = window.confirm('Are you sure you want to create a Stripe account? This will allow you to send & receive payments on Invoice Me.')
    if (!confirm) return
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
        if (accountLink) {
          alert("Stripe account created successfully. You will now be redirected to your Stripe dashboard to complete your account setup.")
          window.location.href = accountLink.url
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
    alert('Please update your personal information in your profile before connecting your Stripe account.')
    navigate('/my-account')
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

  const completeStripeSetup = () => {
    if(accountLink) {
      window.location.href = accountLink
    }
    else {
      setPageLoading(true)
      createAccountLinkService({accountID: myUser?.stripe?.stripeAccountID})
      .then((accountLink) => {
        if (accountLink) {
          setAccountLink(accountLink.url)
          window.location.href = accountLink.url
        }
        else {
          alert("There was an error creating your Stripe account. Please make sure your personal account information is valid (email, phone, postal code, etc.)")
          navigate('/my-account')
        }
        setPageLoading(false)
      })
    }
  }

  useEffect(() => {
    if (myUser?.stripe?.stripeDetailsSubmitted) {
      alert(`Your Stripe account has been successfully connected`)
    }
  }, [myUser])

  return (
    <div className="account-payments">
      <h5>Connect a Stripe account to setup payments</h5>
      {
        !myUser?.stripe?.stripeAccountID && !accountLink ?
          <AppButton
            label="Create Account"
            buttonType="outlineBlueBtn"
            leftIcon="fab fa-stripe-s"
            onClick={() => {
              myUser?.countryCode?.length < 1 ?
                redirectToAccount() :
                connectStripe()
            }}
            className="connect-stripe-btn"
          /> :
          myUser?.stripe?.stripeAccountID && !myUser?.stripe?.stripeDetailsSubmitted &&
          <AppButton
            label="Complete Stripe Setup"
            leftIcon="fab fa-stripe-s"
            onClick={() => completeStripeSetup()}
            className="connect-stripe-btn"
          />
      }
      {
        isBusiness &&
        <>
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
        </>
      }
      <div className="payments-content account-content">
        <div className="section">
          <h5>Stripe Account Info</h5>
          {
            myUser?.stripe?.stripeAccountID &&
            <div className="account-box">
              <i className="fab fa-stripe-s" />
              <div className="account-box-info">
                <h5>Stripe</h5>
                <h6>Setup Complete: {myUser?.stripe?.stripeDetailsSubmitted ? 'Yes' : 'No'}</h6>
                <h6>Name: <span>{myUserName}</span></h6>
                <h6>Account ID: <span>{myUser?.stripe?.stripeAccountID}</span></h6>
                <h6>Email: <span>{myUser?.email}</span></h6>
                <div className="btn-group">
                  <AppButton
                    label="My Account"
                    buttonType="tabBlueBtn"
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
        {
          customer ?
            <div className="section">
              <h5>Customer Info</h5>
              <div className="customer-info">
                <div className="info-card">
                  <h6>
                    Customer ID:
                    <span>{myUser?.stripe?.stripeCustomerID}</span>
                  </h6>
                  <h6>
                    Name
                    <span>{customer.name}</span>
                  </h6>
                  <h6>
                    Email
                    <span>{customer.email}</span>
                  </h6>
                  <h6>
                    Phone
                    <span>{customer.phone}</span>
                  </h6>
                  <h6>
                    Address
                    <span>{customer.address.line1} {customer.address.postal_code} {customer.address.city}&nbsp;
                      {customer.address.state} {customer.address.country}</span>
                  </h6>
                  <h6>
                    Balance
                    <span>${formatCurrency((customer.balance / 100).toFixed(2))} {customer.currency?.toUpperCase()}</span>
                  </h6>
                  <h6>
                    Date Created
                    <span>{convertClassicUnixDate(customer.created)}</span>
                  </h6>
                  <AppButton
                    label="View My Account"
                    buttonType="tabActiveBtn"
                    useATag
                    externalLink
                    url={stripeCustomerPortalLink}
                  />
                </div>
              </div>
            </div> :
            null
        }
      </div>
    </div>
  )
}
