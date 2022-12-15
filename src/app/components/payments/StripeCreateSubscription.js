import React, { useContext, useState } from 'react'
import { StoreContext } from "app/store/store"
import { attachPaymentMethodsService, createCustomerService, createPaymentMethodService, 
  createSubscriptionService } from "app/services/paymentsServices"
import { updateDB } from "app/services/CrudDB"
import { useNavigate } from "react-router-dom"
import StripeCheckoutForm from "./StripeCheckoutForm"
import { successToast } from "app/data/toastsTemplates"

export default function StripeCreateSubscription(props) {

  const { myUserID, myUser, myUserName, setPageLoading,
    businessMemberPlanID, setToasts } = useContext(StoreContext)
  const { payBtnLabel } = props
  const [cardNumber, setCardNumber] = useState('')
  const [expiryMonth, setExpiryMonth] = useState('')
  const [expiryYear, setExpiryYear] = useState('')
  const [cvc, setCvc] = useState('')
  const navigate = useNavigate()

  const catchCode = (err) => {
    setPageLoading(false)
    console.log(err)
  }

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
      return createCustomerService(
        myUser, 
        myUserID, 
        {
          name: myUserName,
          email: myUser?.email,
          city: myUser?.city,
          state: myUser?.region,
          country: myUser?.country,
          address: myUser?.address,
          postcode: myUser?.postcode,
          phone: myUser?.phone,
          shipping: null,
        }, 
        setPageLoading
      )
      .then(customerID => {
        setPageLoading(true)
        return attachPaymentMethodsService(
          myUserID, 
          {
            paymentMethodID,
            customerID
          }, 
          setPageLoading
        )
        .then(() => {
          setPageLoading(true)
          return createSubscriptionService(
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
            setToasts(successToast('Subscription created.'))
            return updateDB('users', myUserID, {
              memberType: 'business'
            })
            .then(() => {
              navigate('/my-account/payments')
              setPageLoading(false)
              console.log('Member type updated')
            })
            .catch((err) => catchCode(err))
          })
          .catch((err) => catchCode(err))
        })
        .catch((err) => catchCode(err))
      })
      .catch((err) => catchCode(err))
    })
    .catch((err) => catchCode(err))
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
