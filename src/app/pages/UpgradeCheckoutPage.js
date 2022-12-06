import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import StripeCreateSubscription from "app/components/payments/StripeCreateSubscription"
import { StoreContext } from "app/store/store"
import React, { useContext, useEffect } from 'react'
import './styles/UpgradePage.css'

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_TEST_KEY)

export default function UpgradeCheckoutPage() {

  const { setCompactNav } = useContext(StoreContext)

  useEffect(() => {
    setCompactNav(true)
    return () => setCompactNav(false)
  }, [])

  return (
    <div className="upgrade-checkout-page">
      <div className="page-content">
        <div className="text-info">
          <h4>Why should you upgrade to business?</h4>
          <p>Here are the 3 main reasons our clients upgrade to business.</p>
          <div className="reasons-list">
            <div className="reason">
              <i className="fas fa-calendar-alt" />
              <div className="texts">
                <h5>Scheduled Invoices</h5>
                <p>Create powerful automated invoices that automatically email on a schedule you choose.</p>
              </div>
            </div>
            <div className="reason">
              <i className="fas fa-credit-card" />
              <div className="texts">
                <h5>App Payouts</h5>
                <p>Pay your invoices and accept payments from your clients with our in-app payment system.</p>
              </div>
            </div>
            <div className="reason">
              <i className="fas fa-sms" />
              <div className="texts">
                <h5>Phone Companion</h5>
                <p>Send invoices by SMS and get notified by SMS when you receive a new invoice.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="payment-container">
          <h4>Upgrade to Business</h4>
          <div className="plan-details">
            <span>Business Membership</span>
            <h5>$5CAD<small>/mo</small></h5>
            <small>Cancel anytime, at no charge</small>
          </div>
          <hr />
          <div className="billing-details">
            <h5>Billing Details</h5>
            <Elements stripe={stripePromise}>
              <StripeCreateSubscription
                payBtnLabel="Upgrade Now"
              />
            </Elements>
            <small>
              <i className="fas fa-lock" />
              Card information is securely processed by Stripe.
            </small>
          </div>
        </div>
      </div>
    </div>
  )
}
