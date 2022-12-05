import AccountStats from "app/components/account/AccountStats"
import Account from "app/components/account/Account"
import AccountBusiness from "app/components/account/AccountBusiness"
import AppTabsBar from "app/components/ui/AppTabsBar"
import HelmetTitle from "app/components/ui/HelmetTitle"
import React, { useContext, useEffect } from 'react'
import { NavLink, Route, Routes, useLocation } from "react-router-dom"
import './styles/MyAccountPage.css'
import { StoreContext } from "app/store/store"
import PageTitleBar from "app/components/ui/PageTitleBar"
import AccountPayments from "app/components/account/AccountPayments"

export default function MyAccountPage() {

  const { setCompactNav } = useContext(StoreContext)
  const location = useLocation()

  useEffect(() => {
    setCompactNav(true)
    return () => setCompactNav(false)
  },[])

  return (
    <div className="account-page">
      <HelmetTitle title="My Account" />
      <PageTitleBar
        title="My Account"
      />  
      <AppTabsBar 
        noSpread 
        spacedOut={15}
      >
        <NavLink
          to=""
          className={location.pathname !== "/my-account" ? "not-active" : ""}
        >
          Account
        </NavLink>
        <NavLink
          to="business"
        >
          Business
        </NavLink>
        <NavLink to="extended-stats">
          Extended Stats
        </NavLink>
        <NavLink to="payments">
          Payments
        </NavLink>
      </AppTabsBar>
      <div className="account-page-routes">
        <Routes>
          <Route path="" element={<Account />} />
          <Route path="business" element={<AccountBusiness />} />
          <Route path="extended-stats" element={<AccountStats />} />
          <Route path="payments" element={<AccountPayments />} />
        </Routes>
      </div>
    </div>
  )
}
