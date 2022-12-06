// @ts-nocheck
import { formatCardNumber, formatCvcNum, 
  formatExpiryNum, isExpiryInFuture} from "app/utils/generalUtils"
import React, {  useRef } from 'react'
import AppButton from "../ui/AppButton"
import './styles/StripeCheckoutForm.css'

export default function StripeCheckoutForm(props) {

  const { onSubmit, payBtnLabel, number, setNumber,
    expiryMonth, setExpiryMonth, expiryYear, setExpiryYear,
    cvc, setCvc } = props
  const monthRef = useRef(null)
  const yearRef = useRef(null)
  const cvcRef = useRef(null)
  console.log(isExpiryInFuture(expiryMonth, expiryYear))

  const allowPay = number?.length > 18 && 
    expiryMonth?.length === 2 && 
    expiryYear?.length === 2  && 
    isExpiryInFuture(expiryMonth, expiryYear) &&
    cvc?.length === 3 

  return (
    <form 
      onSubmit={onSubmit}
      className="stripe-checkout-form"
    >
      <label className="card-label full">
        <i className={`fas fa-credit-card ${number?.length > 18 ? 'active' : ''}`} />
        <input
          placeholder="Card Number"
          autoComplete="cc-number"
          value={formatCardNumber(number)}
          onChange={e => setNumber(e.target.value)}
          onKeyUp={e => e.target.value.length === 19 && monthRef.current.focus()}
          tabIndex="1"
          inputMode="numeric"
        />
      </label>
      <label className="appInput expiry-input">
        <input 
          placeholder="MM"
          autoComplete="cc-exp-month"
          value={formatExpiryNum(expiryMonth)}
          onChange={e => e.target.value.length < 3 && setExpiryMonth(e.target.value)}
          onBlur={e => e.target.value.length === 1 && setExpiryMonth(`0${e.target.value}`)}
          tabIndex="2"
          inputMode="numeric"
          ref={monthRef}
        />
        <span>/</span>
        <input 
          placeholder="YY"
          autoComplete="cc-exp-year"
          value={formatExpiryNum(expiryYear)}
          onChange={e => e.target.value.length < 3 && setExpiryYear(e.target.value)}
          onBlur={e => e.target.value.length === 1 && setExpiryYear(`0${e.target.value}`)}
          tabIndex="3"
          inputMode="numeric"
          ref={yearRef}
        />
      </label>
      <input
        placeholder="CVC"
        autoComplete="cc-csc"
        value={formatCvcNum(cvc)}
        onChange={e => e.target.value.length < 4 && setCvc(e.target.value)}
        tabIndex="4"
        inputMode="numeric"
        ref={cvcRef}
      />
      <AppButton 
        label={payBtnLabel}
        onClick={onSubmit}
        disabled={!allowPay}
        tabIndex="5"
      />
    </form>
  )
}
