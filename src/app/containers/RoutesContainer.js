import React, { useContext } from 'react'
import './styles/RoutesContainer.css'
import ErrorPage from "app/pages/ErrorPage"
import HomePage from 'app/pages/HomePage'
import { Routes, Route } from "react-router"
import InvoicesPage from "app/pages/InvoicesPage"
import EstimatesPage from "app/pages/EstimatesPage"
import ContactsPage from "app/pages/ContactsPage"
import PaymentsPage from "app/pages/PaymentsPage"
import SettingsPage from "app/pages/SettingsPage"
import UpgradePage from "app/pages/UpgradePage"
import MyProfilePage from "app/pages/MyProfilePage"
import MyAccountPage from "app/pages/MyAccountPage"
import NewInvoicePage from "app/pages/NewInvoicePage"
import NewEstimatePage from "app/pages/NewEstimatePage"
import NewContactPage from "app/pages/NewContactPage"
import NewPaymentPage from "app/pages/NewPaymentPage"
import InvoicePage from "app/pages/InvoicePage"
import NotificationsPage from "app/pages/NotificationsPage"
import MessagesPage from "app/pages/MessagesPage"

export default function RoutesContainer() {

  return (
    <div className="routes-container">
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="invoices" element={<InvoicesPage />} />
        <Route path="/invoices/:invoiceID" element={<InvoicePage />} />
        <Route path="invoices/new" element={<NewInvoicePage />} />
        <Route path="estimates" element={<EstimatesPage />} />
        <Route path="estimates/new" element={<NewEstimatePage />} />
        <Route path="contacts" element={<ContactsPage />} />
        <Route path="contacts/new" element={<NewContactPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="paments/new" element={<NewPaymentPage />} />
        <Route path="my-profile" element={<MyProfilePage />} />
        <Route path="my-account" element={<MyAccountPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="upgrade" element={<UpgradePage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  )
}
