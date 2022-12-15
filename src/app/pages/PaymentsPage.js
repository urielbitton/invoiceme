import PaymentInvoices from "app/components/payments/PaymentInvoices"
import PaymentsGeneral from "app/components/payments/PaymentsGeneral"
import PaymentsMethods from "app/components/payments/PaymentsMethods"
import PaymentsSent from "app/components/payments/PaymentsSent"
import PaymentSubscriptions from "app/components/payments/PaymentSubscriptions"
import AppButton from "app/components/ui/AppButton"
import AppTabsBar from "app/components/ui/AppTabsBar"
import HelmetTitle from "app/components/ui/HelmetTitle"
import PageTitleBar from "app/components/ui/PageTitleBar"
import ProContent from "app/components/ui/ProContent"
import { createNotification } from "app/services/notifServices"
import { createCustomerService } from "app/services/paymentsServices"
import { StoreContext } from "app/store/store"
import React, { useContext, useEffect } from 'react'
import { NavLink, Route, Routes } from "react-router-dom"
import './styles/PaymentsPage.css'

export default function PaymentsPage() {

  const { myUser, myUserID, myUserName, myMemberType, setPageLoading,
    setCompactNav } = useContext(StoreContext)
  const customerID = myUser?.stripe?.stripeCustomerID
  const isBusiness = myMemberType === 'business'

  const createCustomer = () => {
    const confirm = window.confirm('Are you sure you want to create a customer account?')
    if (!confirm) return
    setPageLoading(true)
    createCustomerService(
      myUser, 
      myUserID, 
      {
        name: myUserName,
        email: myUser?.email,
        city: myUser?.city,
        state: myUser?.region,
        country: myUser?.country || 'CA',
        address: myUser?.address,
        postcode: myUser?.postcode,
        phone: myUser?.phone,
        shipping: null,
      },
      setPageLoading
    )
    .then(() => {
      createNotification(
        myUserID,
        'Customer account created',
        'A new customer account has been created for you.',
        'fas fa-user-tag',
        '/payments'
      )
    })
  }

  useEffect(() => {
    setCompactNav(true)
    return () => setCompactNav(false)
  }, [])

  return isBusiness ? 
    customerID ? (
    <div className="payments-page">
      <HelmetTitle title="Payments" />
      <PageTitleBar
        title="Payments"
        rightComponent={
          <AppButton
            label="New Payment"
            url="/payments/new"
            rightIcon="far fa-plus"
          />
        }
      />
      <AppTabsBar
        sticky
        noSpread
        spacedOut={15}
      >
        <NavLink 
          to=""
          className={window.location.pathname === '/payments' ? 'active' : 'not-active'}
        >
          Payments
        </NavLink>
        <NavLink to="sent-payments">
          Sent Payments
        </NavLink>
        <NavLink to="subscriptions">
          Subscriptions
        </NavLink>
        <NavLink to="payment-methods">
          Payment Methods
        </NavLink>
        <NavLink to="invoices">
          Invoices
        </NavLink>
      </AppTabsBar>
      <div className="payments-page-routes">
        <Routes>
          <Route path="" element={<PaymentsGeneral />} />
          <Route path="sent-payments" element={<PaymentsSent />} />
          <Route path="subscriptions" element={<PaymentSubscriptions />} />
          <Route path="payment-methods" element={<PaymentsMethods />} />
          <Route path="invoices" element={<PaymentInvoices />} />
        </Routes>
      </div>
    </div>
  ) :
  <>
    <span>You must create a Stripe customer account in order to send payments</span>
    <br/><br/>
    <AppButton
      label="Create Customer Account"
      onClick={() => createCustomer()}
    />
  </> :
  <ProContent />
}
