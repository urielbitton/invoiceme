import HelmetTitle from "app/components/ui/HelmetTitle"
import React from 'react'

export default function SettingsPage() {

  return (
    <div>
      <HelmetTitle title="Settings" />
      SettingsPage<br/>
      Let business members only users create a scheduled email that sends an invoice template to a client on nth day of the month. 
      (create 3 max pubsub functions that run everyday and execute ibusiness user has times matching these.)<br/>
      Let business users create a scheduled email that sends payment for an received invoice to client (using stripe or paypal)
      Let users choose if they want to show invoice page titles, dates and numbers on printed invoice (can be hidden with this code):
      {/* @page { size: auto;  margin: 0mm; }*/}
    </div>
  )
}
