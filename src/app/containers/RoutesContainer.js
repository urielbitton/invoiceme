import React, { useContext, useEffect, useRef } from 'react'
import './styles/RoutesContainer.css'
import ErrorPage from "app/pages/ErrorPage"
import HomePage from 'app/pages/HomePage'
import { StoreContext } from "app/store/store"
import { Routes, Route, useLocation } from "react-router"
import InvoicesPage from "app/pages/InvoicesPage"
import EstimatesPage from "app/pages/EstimatesPage"
import ContactsPage from "app/pages/ContactsPage"
import PaymentsPage from "app/pages/PaymentsPage"
import SettingsPage from "app/pages/SettingsPage"
import UpgradePage from "app/pages/UpgradePage"
import MyAccountPage from "app/pages/MyAccountPage"
import NewInvoicePage from "app/pages/NewInvoicePage"
import NewEstimatePage from "app/pages/NewEstimatePage"
import NewContactPage from "app/pages/NewContactPage"
import NewPaymentPage from "app/pages/NewPaymentPage"
import InvoicePage from "app/pages/InvoicePage"
import NotificationsPage from "app/pages/NotificationsPage"
import EmailsPage from "app/pages/EmailsPage"
import EstimatePage from "app/pages/EstimatePage"
import ContactPage from "app/pages/ContactPage"
import HelpAndSupport from "app/pages/HelpAndSupport"
import UpgradeCheckoutPage from "app/pages/UpgradeCheckoutPage"

export default function RoutesContainer() {

  const { compactNav } = useContext(StoreContext)
  const windowRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    if (windowRef.current && !location.pathname.includes('/settings')) {
      windowRef.current.scrollTop = 0
    }
  },[location])

  return (
    <div className={`routes-container ${compactNav ? 'compact' : ''}`} ref={windowRef}>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="invoices" element={<InvoicesPage />} />
        <Route path="/invoices/:invoiceID" element={<InvoicePage />} />
        <Route path="invoices/new" element={<NewInvoicePage />} />
        <Route path="estimates" element={<EstimatesPage />} />
        <Route path="estimates/new" element={<NewEstimatePage />} />
        <Route path="/estimates/:estimateID" element={<EstimatePage />} />
        <Route path="contacts" element={<ContactsPage />} />
        <Route path="contacts/new" element={<NewContactPage />} />
        <Route path="/contacts/:contactID/*" element={<ContactPage />} />
        <Route path="payments/*" element={<PaymentsPage />} />
        <Route path="payments/new" element={<NewPaymentPage />} />
        <Route path="my-account/*" element={<MyAccountPage />} />
        <Route path="settings/*" element={<SettingsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="emails/*" element={<EmailsPage />} />
        <Route path="upgrade" element={<UpgradePage />} />
        <Route path="upgrade-checkout" element={<UpgradeCheckoutPage />} />
        <Route path="help-and-support" element={<HelpAndSupport />} />
        <Route path="login" element={<HomePage />} />
        <Route path="register" element={<HomePage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  )
}
