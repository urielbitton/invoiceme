import HelmetTitle from "app/components/ui/HelmetTitle"
import React from 'react'

export default function SettingsPage() {
  return (
    <div>
      <HelmetTitle title="Settings" />
      SettingsPage<br/>
      Let client users create a scheduled email that sends an invoice template to a client on nth day of the month.<br/>
      Let business users create a scheduled email that sends payment for an received invoice to client (using stripe or paypal)
      Let users choose if the want to show invoice page titles, dates and numbers on printed invoice (can be hidden with this code):
      {/* @page { size: auto;  margin: 0mm; }*/}
    </div>
  )
}
