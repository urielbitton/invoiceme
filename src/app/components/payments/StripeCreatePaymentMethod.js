import React, { useContext, useState } from 'react'
import { StoreContext } from "app/store/store"
import { createPaymentMethodService } from "app/services/paymentsServices"
import StripeCheckoutForm from "./StripeCheckoutForm"
import { useUserNotifSettings } from "app/hooks/userHooks"

export default function StripeCreatePaymentMethod(props) {

  const { myUserID, setPageLoading } = useContext(StoreContext)
  const { payBtnLabel='Save Card' } = props
  const [cardNumber, setCardNumber] = useState('')
  const [expiryMonth, setExpiryMonth] = useState('')
  const [expiryYear, setExpiryYear] = useState('')
  const [cvc, setCvc] = useState('')
  const notifSettings = useUserNotifSettings(myUserID)

  const createPaymentMethod = (e) => {
    e.preventDefault()
    const paymentData = {
      type: 'card',
      cardNumber,
      expiryMonth,
      expiryYear,
      cvc
    }
    setPageLoading(true)
    createPaymentMethodService(paymentData, myUserID, setPageLoading, notifSettings.showPaymentNotifs)
    .catch(err => console.log(err))
  }

  return (
    <StripeCheckoutForm
      onSubmit={createPaymentMethod}
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
