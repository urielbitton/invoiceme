import { useStripeCustomer } from "app/hooks/paymentHooks"
import { deleteStripeAccountService } from "app/services/userServices"
import { StoreContext } from "app/store/store"
import { convertClassicUnixDate } from "app/utils/dateUtils"
import { formatCurrency } from "app/utils/generalUtils"
import React, { useContext } from 'react'
import AppButton from "../ui/AppButton"

export default function PaymentsAccount() {

  const { myUser, myUserID, stripeCustomerPortalLink, myUserName,
    setPageLoading } = useContext(StoreContext)
  const customer = useStripeCustomer(myUser?.stripe?.stripeCustomerID)

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

  return (
    <div className="payments-content account-content">
      <div className="section">
        <h5>Stripe Account Info</h5>
        {
          myUser?.stripe?.stripeAccountID ?
            <div className="account-box">
              <i className="fab fa-stripe-s" />
              <div className="account-box-info">
                <h5>Stripe</h5>
                <h6>Connected: <i className={myUser?.stripe?.stripeDetailsSubmitted ? 'fas fa-check-circle' : 'fas fa-times-circle'} /></h6>
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
            </div> :
            <>
              <h5>To create a stripe account, visit your account payments</h5>
              <AppButton
                label="Account Payments"
                url="/my-account/payments"
                buttonType="tabActiveBtn"
              />
            </>
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
  )
}
