import React, { useContext, useState } from 'react'
import { StoreContext } from "app/store/store"
import { attachPaymentMethodsService, createCustomerService, createPaymentMethodService, 
  createSubscriptionService } from "app/services/paymentsServices"
import { updateDB } from "app/services/CrudDB"
import { useNavigate } from "react-router-dom"
import StripeCheckoutForm from "./StripeCheckoutForm"

export default function StripeCreateSubscription(props) {

  const { myUserID, myUser, myUserName, setPageLoading } = useContext(StoreContext)
  const { payBtnLabel } = props
  const [cardNumber, setCardNumber] = useState('')
  const [expiryMonth, setExpiryMonth] = useState('')
  const [expiryYear, setExpiryYear] = useState('')
  const [cvc, setCvc] = useState('')
  const businessMemberPlanID = 'price_1MBgssAp3OtccpN9TKmXnu5t'
  const navigate = useNavigate()

  const startSubscription = (e) => {
    e.preventDefault()
    setPageLoading(true)
    createPaymentMethodService(
      {
        cardNumber,
        expiryMonth,
        expiryYear,
        cvc,
        type: 'card'
      }, 
      setPageLoading
    )
    .then((paymentMethodID) => {
      setPageLoading(true)
      createCustomerService(
        myUser, 
        myUserID, 
        {
          name: myUserName,
          city: myUser?.city,
          state: myUser?.region,
          country: myUser?.country,
          address: myUser?.address,
          postcode: myUser?.postcode,
          shipping: null,
        }, 
        setPageLoading
      )
      .then(customerID => {
        setPageLoading(true)
        attachPaymentMethodsService(
          myUserID, 
          {
            paymentMethodID,
            customerID
          }, 
          setPageLoading
        )
        .then(() => {
          setPageLoading(true)
          createSubscriptionService(
            myUser,
            myUserID, 
            {
              customerID,
              priceID: businessMemberPlanID,
              quantity: 1,
              paymentMethodID
            }, 
            setPageLoading
          )
          .then((subscriptionID) => {
            setPageLoading(true)
            alert('Subscription created.')
            return updateDB('users', myUserID, {
              memberType: 'business',
              "stripe.subscriptionID": subscriptionID
            })
            .then(() => {
              navigate('/my-account/payments')
              setPageLoading(false)
              console.log('Member type updated')
            })
            .catch((error) => {
              setPageLoading(false)
              console.log('Error updating member type', error)
            })
          })
        })
      })
    })
  }

  return (
    <StripeCheckoutForm
      onSubmit={startSubscription}
      number={cardNumber}
      setNumber={setCardNumber}
      expiryMonth={expiryMonth}
      setExpiryMonth={setExpiryMonth}
      expiryYear={expiryYear}
      setExpiryYear={setExpiryYear}
      cvc={cvc}
      setCvc={setCvc}
      payBtnLabel={payBtnLabel}
    />
  )
}
