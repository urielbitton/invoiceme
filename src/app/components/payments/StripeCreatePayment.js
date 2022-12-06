import React, { useContext } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { StoreContext } from "app/store/store"
import AppButton from "../ui/AppButton"
import { createPaymentMethodService } from "app/services/paymentsServices"

export default function StripeCreatePayment(props) {

  const { myUserID, setPageLoading } = useContext(StoreContext)
  const { payBtnLabel } = props
  const stripe = useStripe()
  const elements = useElements()

  const createPaymentMethod = (e) => {
    e.preventDefault()
    setPageLoading(true)
    createPaymentMethodService(myUserID, setPageLoading)
  }

  return (
    <form onSubmit={createPaymentMethod}>
      <CardElement />
      <AppButton 
        label={payBtnLabel}
        disabled={!stripe || !elements} 
      />
    </form>
  )
}
