import React from 'react'

export default function ContactGeneral({contact, invoices, estimates, payments}) {
  return (
    <div className="contact-general contact-content">
      ContactGeneral
      <br />
      <h5>Total Billed: </h5>
      <h5>Highest Billed: </h5>
      <h5>Lowest Billed: </h5>
      <h5>Average Billed: </h5>
    </div>
  )
}
