import { useCustomerSubscriptions } from "app/hooks/paymentHooks"
import { cancelSubscriptionService, reactivateStripeSubscriptionService, 
  retrievePaymentMethodService } from "app/services/paymentsServices"
import { StoreContext } from "app/store/store"
import { convertClassicUnixDate } from "app/utils/dateUtils"
import { formatCurrency } from "app/utils/generalUtils"
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import AppButton from "../ui/AppButton"
import AppItemRow from "../ui/AppItemRow"
import AppModal from "../ui/AppModal"
import AppTable from "../ui/AppTable"
import IconContainer from "../ui/IconContainer"

export default function PaymentSubscriptions() {

  const { myUser, stripeCustomerPortalLink, setPageLoading } = useContext(StoreContext)
  const [showSubModal, setShowSubModal] = useState(false)
  const [subscriptionObject, setSubscriptionObject] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState(null)
  const subscriptions = useCustomerSubscriptions(myUser?.stripe?.stripeCustomerID)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const navigate = useNavigate()

  const subscriptionsList = subscriptions?.data?.map((subscription) => {
    return <AppItemRow
      key={subscription.id}
      item1={(convertClassicUnixDate(subscription.start_date))}
      item2={`${subscription.items.data[0].price.recurring.interval}ly`}
      item3={<><span className="status">{subscription.status}</span> {subscription.cancel_at_period_end && '(cancelled)'}</>}
      item4={<>
        ${formatCurrency((subscription.items.data[0].price.unit_amount / 100).toFixed(2))}&nbsp;
        <span className="uppercase">{subscription.currency}</span>
      </>}
      item5={convertClassicUnixDate(subscription.current_period_end)}
      item6={subscription.payment_settings.payment_method_types[0]}
      item7={convertClassicUnixDate(subscription.created)}
      actions={
        <>
          <IconContainer
            icon="fas fa-eye"
            iconSize={14}
            onClick={() => viewSubscription(subscription)}
            dimensions={27}
          />
          <IconContainer
            icon="fas fa-link"
            iconSize={14}
            onClick={() => window.open(stripeCustomerPortalLink, '_blank')}
            dimensions={27}
          />
        </>
      }
    />
  })

  const viewSubscription = (subscription) => {
    setPaymentLoading(true)
    setShowSubModal(true)
    setSubscriptionObject(subscription)
    retrievePaymentMethodService({ paymentMethodID: subscription.default_payment_method })
      .then((res) => {
        setPaymentMethod(res.card)
        setPaymentLoading(false)
      })
      .catch((error) => {
        setPaymentLoading(false)
        console.log('Error retrieving payment method', error)
      })
  }

  const cancelSubscription = (subscriptionID) => {
    const confirm = window.confirm('Are you sure you want to cancel this subscription?')
    if (!confirm) return
    setPageLoading(true)
    cancelSubscriptionService({ subscriptionID })
    .then(() => {
      setPageLoading(false)
      alert('Subscription will be cancelled at the end of your current billing cycle.')
      navigate(0)
    })
    .catch((error) => {
      console.log(error)
      setPageLoading(false)
    })
  }

  const reactivateSubscription = (subscriptionID) => {
    const confirm = window.confirm('Are you sure you want to reactivate this subscription?')
    if (!confirm) return
    setPageLoading(true)
    reactivateStripeSubscriptionService({subscriptionID})
    .then(() => {
      setPageLoading(false)
      alert('Subscription has been reactivated successfully.')
      navigate(0)
    })
    .catch((error) => console.log(error))
  }

  useEffect(() => {
    if (!showSubModal) {
      setSubscriptionObject(null)
      setPaymentMethod(null)
    }
  }, [showSubModal])

  return (
    <div className="payments-content">
      <AppTable
        headers={[
          'Started On',
          'Cycle',
          'Status',
          'Amount',
          'Next Payment',
          'Payment Method',
          'Date Created',
          'Actions'
        ]}
        rows={subscriptionsList}
      />
      <AppModal
        showModal={showSubModal}
        setShowModal={setShowSubModal}
        label="Subscription Details"
        portalClassName="subscription-modal"
        actions={
          <>
            <AppButton
              label="Done"
              onClick={() => setShowSubModal(false)}
            />
            {
              !subscriptionObject?.cancel_at_period_end ?
              <AppButton
                label="Cancel Subscription"
                onClick={() => cancelSubscription(subscriptionObject.id)}
                buttonType="invertedBtn"
              /> :
              <AppButton
                label="Reactivate Subscription"
                onClick={() => reactivateSubscription(subscriptionObject.id)}
                buttonType="invertedBtn"
              />
            }
          </>
        }
      >
        {
          subscriptionObject &&
          <div className="subscription-modal-content">
            <div className="section">
              <h5>Subscription</h5>
              <h6>
                Subscription ID
                <span>{subscriptionObject.id}</span>
              </h6>
              <h6>
                Started On
                <span>{convertClassicUnixDate(subscriptionObject.start_date)}</span>
              </h6>
              <h6>
                Cycle
                <span className="capitalize">{subscriptionObject.items.data[0].price.recurring.interval}ly</span>
              </h6>
              <h6>
                Status
                <span className="capitalize">{subscriptionObject.status} {subscriptionObject.cancel_at_period_end && '(cancelled)'}</span>
              </h6>
              {
                subscriptionObject.cancel_at &&
                <h6>
                  Cancels On
                  <span>{convertClassicUnixDate(subscriptionObject.cancel_at)}</span>
                </h6>
              }
              <h6>
                Amount
                <span>${formatCurrency((subscriptionObject.items.data[0].price.unit_amount / 100).toFixed(2))}&nbsp;
                  <span className="uppercase">{subscriptionObject.currency}</span>
                </span>
              </h6>
              <h6>
                Current billing period
                <span>
                  {convertClassicUnixDate(subscriptionObject.current_period_start)} -&nbsp;
                  {convertClassicUnixDate(subscriptionObject.current_period_end)}
                </span>
              </h6>
              <h6>
                Collection Method
                <span className="capitalize">{subscriptionObject.collection_method?.replace('_', ' ')}</span>
              </h6>
              <h6>
                Days until due
                <span>{subscriptionObject.days_until_due}</span>
              </h6>
            </div>
            <div className="section">
              <h5>Payment Method</h5>
              {
                paymentLoading ?
                  <small>Loading...</small> :
                  <>
                    <h6>
                      Card Type
                      <span className="capitalize">{paymentMethod?.brand}</span>
                    </h6>
                    <h6>
                      Last 4 Digits
                      <span>{paymentMethod?.last4}</span>
                    </h6>
                    <h6>
                      Expiration Date
                      <span>{paymentMethod?.exp_month}/{paymentMethod?.exp_year}</span>
                    </h6>
                  </>
              }
            </div>
          </div>
        }
      </AppModal>
    </div>
  )
}