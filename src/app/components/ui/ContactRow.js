import React from 'react'
import AppButton from "./AppButton"
import './styles/ContactRow.css'

export default function ContactRow({contact, onClick}) {
  return (
    <div className="app-contact-row">
      <i className="fas fa-id-badge" />
      <h6>{contact.name}</h6>
      <h6>{contact.email}</h6>
      <h6>{contact.phone}</h6>
      <h6>{contact.address}</h6>
      <h6>{contact.city}, {contact.region}, {contact.country}</h6>
      <AppButton
        label="Select"
        onClick={onClick}
      />
    </div>
  )
}
