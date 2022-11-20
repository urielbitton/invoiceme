import AppButton from "app/components/ui/AppButton"
import { AppInput } from "app/components/ui/AppInputs"
import { functions } from "app/firebase/fire"
import React, { useState } from 'react'

export default function ContactsPage() {

  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  const callPhone = () => {
    functions.httpsCallable('callPhone')({ phone })
    .then(result => {
      console.log(result) 
    })
  }

  const sendSMS = () => {
    functions.httpsCallable('sendSMS')({ phone, message })
    .then(result => {
      console.log(result) 
      setMessage('')
    })
  }

  return (
    <div>
      ContactsPage<br/><br/>
      <AppInput
        placeholder="Phone Number"
        value={phone}
        onChange={e => setPhone(e.target.value)}
      /><br/><br/>
      <AppButton
        label="Call"
        onClick={() => callPhone()}
        leftIcon="fas fa-phone"
      /><br/><br/>
      <AppInput
        placeholder="Text Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      /><br/><br/>
      <AppButton
        label="Send SMS"
        onClick={() => sendSMS()}
        leftIcon="fas fa-comment"
      />
    </div>
  )
}
