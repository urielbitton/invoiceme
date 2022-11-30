import { formatPhoneNumber, truncateText } from "app/utils/generalUtils"
import React from 'react'
import './styles/ContactRowBasic.css'

export default function ContactRowBasic({contact, actions, className=''}) {
  return (
    <div className={`app-contact-row ${className}`}>
      <div className="img-container">
        <img src={contact.photoURL} alt="profile"/>
      </div>
      <h6>{truncateText(contact.name, 40)}</h6>
      <h6>{truncateText(contact.email, 25)}</h6>
      <h6>{formatPhoneNumber(contact.phone)}</h6>
      <h6>{truncateText(contact.address, 25)}</h6>
      <h6>{contact.city}, {contact.region}, {contact.country}</h6>
      {actions}
    </div>
  )
}
