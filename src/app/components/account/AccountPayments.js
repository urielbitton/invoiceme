import { retrieveStripeAccountService } from "app/services/userServices"
import { StoreContext } from "app/store/store"
import React, { useContext } from 'react'
import AppButton from "../ui/AppButton"
import './styles/AccountPayments.css'

export default function AccountPayments() {

  const { myUser, myUserName } = useContext(StoreContext)
  
  const getMyStripeCustomerInfo = () => {
    retrieveStripeAccountService(myUser?.stripeCustomerID)
    .then((res) => {
      console.log(res)
    })
  }

  return (
    <div className="account-payments">
      <div className="payments-section">
        <h4>My Payments</h4>
      </div>
      <div className="payments-section">
        <h4>My Cards</h4>
      </div>
      <div className="payments-section">
        <h4>Connected Payments</h4>
        {
          myUser?.stripeCustomerID &&
          <div className="account-box">
            <i className="fab fa-stripe-s" />
            <div className="account-box-info">
              <h5>Stripe</h5>
              <h6>
                Customer ID:
                <span>{myUser?.stripeCustomerID}</span>
              </h6>
              <h6>
                Name:
                <span>{myUserName}</span>
              </h6>
              <h6>
                Email: 
                <span>{myUser?.email}</span>
              </h6>
              <AppButton
                label="View Account Info"
                buttonType="tabBlueBtn"
                onClick={getMyStripeCustomerInfo}
              />
            </div>
          </div>
        }
      </div>
    </div>
  )
}
