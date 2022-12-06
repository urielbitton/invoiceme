import PaymentInvoices from "app/components/payments/PaymentInvoices"
import PaymentsAccount from "app/components/payments/PaymentsAccount"
import PaymentsGeneral from "app/components/payments/PaymentsGeneral"
import PaymentSubscriptions from "app/components/payments/PaymentSubscriptions"
import AppTabsBar from "app/components/ui/AppTabsBar"
import HelmetTitle from "app/components/ui/HelmetTitle"
import PageTitleBar from "app/components/ui/PageTitleBar"
import React from 'react'
import { NavLink, Route, Routes } from "react-router-dom"
import './styles/PaymentsPage.css'

export default function PaymentsPage() {
  return (
    <div className="payments-page">
      <HelmetTitle title="Payments" />
      <PageTitleBar
        title="Payments"
      />
      <AppTabsBar
        sticky
        noSpread
        spacedOut
      >
        <NavLink 
          to=""
          className={window.location.pathname === '/payments' ? 'active' : 'not-active'}
        >
          Payments
        </NavLink>
        <NavLink to="subscriptions">
          Subscriptions
        </NavLink>
        <NavLink to="invoices">
          Invoices
        </NavLink>
        <NavLink to="account">
          Account
        </NavLink>
      </AppTabsBar>
      <div className="payments-page-routes">
        <Routes>
          <Route path="" element={<PaymentsGeneral />} />
          <Route path="subscriptions" element={<PaymentSubscriptions />} />
          <Route path="invoices" element={<PaymentInvoices />} />
          <Route path="account-details" element={<PaymentsAccount />} />
        </Routes>
      </div>
    </div>
  )
}
