import React, { useContext, useState } from 'react'
import { StoreContext } from "app/store/store"
import { createPaymentMethodService } from "app/services/paymentsServices"
import StripeCheckoutForm from "./StripeCheckoutForm"

export default function StripeCreatePaymentMethod(props) {

  const { myUserID, setPageLoading } = useContext(StoreContext)
  const { payBtnLabel='Save Card' } = props
  const [cardNumber, setCardNumber] = useState('')
  const [expiryMonth, setExpiryMonth] = useState('')
  const [expiryYear, setExpiryYear] = useState('')
  const [cvc, setCvc] = useState('')

  const createPaymentMethod = (e) => {
    e.preventDefault()
    setPageLoading(true)
    createPaymentMethodService(myUserID, setPageLoading)
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
