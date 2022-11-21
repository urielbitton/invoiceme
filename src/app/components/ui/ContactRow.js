import { formatPhoneNumber } from "app/utils/generalUtils"
import React from 'react'
import './styles/ContactRow.css'

export default function ContactRow({contact, actions, className=''}) {
  return (
    <div className={`app-contact-row ${className}`}>
      <i className="fas fa-id-badge" />
      <h6>{contact.name}</h6>
      <h6>{contact.email}</h6>
      <h6>{formatPhoneNumber(contact.phone)}</h6>
      <h6>{contact.address}</h6>
      <h6>{contact.city}, {contact.region}, {contact.country}</h6>
      {actions}
    </div>
  )
}
