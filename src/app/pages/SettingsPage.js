import GeneralSettings from "app/components/settings/GeneralSettings"
import { AppInput } from "app/components/ui/AppInputs"
import AppTabsBar from "app/components/ui/AppTabsBar"
import HelmetTitle from "app/components/ui/HelmetTitle"
import PageTitleBar from "app/components/ui/PageTitleBar"
import { StoreContext } from "app/store/store"
import React, { useContext, useEffect, useState } from 'react'
import { NavLink, Route, Routes } from "react-router-dom"
import './styles/SettingsPage.css'

export default function SettingsPage() {

  const { setCompactNav } = useContext(StoreContext)
  // const [activeTab, setActiveTab] = useState('general')

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
        noBorder
      >
        <NavLink
          to=""
        >
          General
        </NavLink>
        <NavLink
          to="invoices"
        >
          Invoices
        </NavLink>
        <NavLink
          to="scheduled-invoices"
        >
          Scheduled Invoices
        </NavLink>
        <NavLink to="estimates">
          Estimates
        </NavLink>
        <NavLink to="payments">
          Payments
        </NavLink>
        <NavLink to="notifications">
          Notifications
        </NavLink>
        <NavLink to="messages">
          Messages
        </NavLink>
      </AppTabsBar>
      <div className="settings-page-routes">
        <Routes>
          <Route path="" element={<GeneralSettings />} />
        </Routes>
      </div>
    </div>
  )
}
