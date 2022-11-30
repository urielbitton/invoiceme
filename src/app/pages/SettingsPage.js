import ContactsSettings from "app/components/settings/ContactsSettings"
import CreateScheduledInvoice from "app/components/settings/CreateScheduledInvoice"
import EmailsSettings from "app/components/settings/EmailsSettings"
import EstimatesSettings from "app/components/settings/EstimatesSettings"
import GeneralSettings from "app/components/settings/GeneralSettings"
import InvoicesSettings from "app/components/settings/InvoicesSettings"
import NotificationsSettings from "app/components/settings/NotificationsSettings"
import PaymentsSettings from "app/components/settings/PaymentsSettings"
import ScheduledInvoicesSettings from "app/components/settings/ScheduledInvoicesSettings"
import { AppInput } from "app/components/ui/AppInputs"
import AppTabsBar from "app/components/ui/AppTabsBar"
import HelmetTitle from "app/components/ui/HelmetTitle"
import PageTitleBar from "app/components/ui/PageTitleBar"
import { StoreContext } from "app/store/store"
import React, { useContext, useEffect } from 'react'
import { NavLink, Route, Routes, useLocation } from "react-router-dom"
import './styles/SettingsPage.css'

export default function SettingsPage() {

  const { setCompactNav } = useContext(StoreContext)
  const location = useLocation()

  useEffect(() => {
    setCompactNav(true)
    return () => setCompactNav(false)
  }, [])

  return (
    <div className="settings-page">
      <HelmetTitle title="Settings" />
      <PageTitleBar
        title="Settings"
        rightComponent={
          <AppInput
            placeholder="Search settings..."
          />
        }
      />
      <AppTabsBar 
        noSpread 
        spacedOut={15}
        sticky
      >
        <NavLink
          to=""
          className={location.pathname !== '/settings' ? 'not-active' : ''}
        >
          General
        </NavLink>
        <NavLink
          to="invoices"
        >
          Invoices
        </NavLink>
        <NavLink to="estimates">
          Estimates
        </NavLink>
        <NavLink to="contacts">
          Contacts
        </NavLink>
        <NavLink
          to="scheduled-invoices"
        >
          Scheduled Invoices
        </NavLink>
        <NavLink to="payments">
          Payments
        </NavLink>
        <NavLink to="notifications">
          Notifications
        </NavLink>
        <NavLink to="emails">
          Emails
        </NavLink>
      </AppTabsBar>
      <div className="settings-page-routes">
        <Routes>
          <Route path="" element={<GeneralSettings />} />
          <Route path="invoices" element={<InvoicesSettings />} />
          <Route path="estimates" element={<EstimatesSettings />} />
          <Route path="contacts" element={<ContactsSettings />} />
          <Route path="scheduled-invoices" element={<ScheduledInvoicesSettings />} />
          <Route path="payments" element={<PaymentsSettings />} />
          <Route path="notifications" element={<NotificationsSettings />} />
          <Route path="emails" element={<EmailsSettings />} />
          <Route path="scheduled-invoices/new/*" element={<CreateScheduledInvoice />} />
        </Routes>
      </div>
    </div>
  )
}
