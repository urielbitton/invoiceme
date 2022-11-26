import AppTabsBar from "app/components/ui/AppTabsBar"
import React from 'react'
import { NavLink } from "react-router-dom"
import './styles/ContactPage.css'

export default function ContactPage() {
  return (
    <div className="contact-page">
      <header>
        <div className="side">

        </div>
        <div className="side">
          
        </div>
      </header>
      <div className="contact-routes">
        <AppTabsBar noSpread spacedOut={15}>
          <NavLink to="">
            Invoices
          </NavLink>
          <NavLink to="estimates">
            Estimates
          </NavLink>
          <NavLink to="payments">
            Payments
          </NavLink>
        </AppTabsBar>
      </div>
    </div>
  )
}
