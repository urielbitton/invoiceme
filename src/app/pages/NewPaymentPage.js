import AppButton from "app/components/ui/AppButton"
import Avatar from "app/components/ui/Avatar"
import HelmetTitle from "app/components/ui/HelmetTitle"
import { useContactsSearch } from "app/hooks/searchHooks"
import { getContactStripeAccountIDByEmail } from "app/services/contactsServices"
import { retrieveStripeAccountService } from "app/services/userServices"
import { StoreContext } from "app/store/store"
import React, { useContext, useEffect, useState } from 'react'
import './styles/NewPaymentPage.css'

export default function NewPaymentPage() {

  const { myUser, myUserName,  myUserID } = useContext(StoreContext)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [stripeLoading, setStripeLoading] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)
  const filters = `ownerID: ${myUserID}`
  const [myStripeAccount, setMyStripeAccount] = useState(null)
  const [contactStripeAccount, setContactStripeAccount] = useState(null)

  const contacts = useContactsSearch(query, setLoading, filters)

  const usersResults = contacts
  ?.filter(contact => contact.email !== myUser?.email)
  .map((contact, index) => {
    return (
      <div 
        key={index}
        className="user-row"
        onClick={() => setSelectedContact(contact)}
      >
        <Avatar 
          src={contact.photoURL} 
          dimensions={30}
          alt="user" 
        />
        <h6>{contact.name}</h6>
        -
        <span>{contact.email}</span>
      </div>
    )
  })

  useEffect(() => {
    if(selectedContact) {
      setStripeLoading(true)
      getContactStripeAccountIDByEmail('u')
      .then((data) => {
        setContactStripeAccount(data)
        if(data) {
          retrieveStripeAccountService(data)
          .then((myData) => {
            setMyStripeAccount(myData.id)
            setStripeLoading(false)
          })
          .catch(err => {
            console.log(err)
            setStripeLoading(false)
          })
        }
      })
      .catch((error) => {
        console.log(error)
        setStripeLoading(false)
      })
    }
  },[selectedContact])

  return (
    <div>
      <HelmetTitle title="New Payment" />
      <div className="new-payment-container">
        <h4>Send a Payment</h4>
        <div className="payment-options">
          <i className="fab fa-cc-visa"/>
          <i className="fab fa-cc-mastercard"/>
          <i className="fab fa-cc-amex"/>
          <i className="fab fa-cc-discover"/>
        </div>
        <div className="user-search-row">
          <input
            type="Search"
            placeholder="Enter a name or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            enterKeyHint="go"
          />
          <AppButton
            buttonType="iconBtn"
            rightIcon={!loading ? 'far fa-search' : 'fas fa-spinner fa-spin'}
          />
          {
            query.length > 0 && 
            <div className="results-dropdown">
              {usersResults}
            </div>
          }
        </div>
        <p className="transaction-details-text">
          Select a contact to send a payment to. If the contact has their payments setup the transaction details will
          open below. Otherwise they will be prompted to setup their payments.
        </p>
        <div className={`transaction-flex ${contactStripeAccount ? 'active' : ''}`}>
          <div className="side">
            <h5>My Details</h5>
            <h6>Name: {myUserName}</h6>
            <h6>Email: {myUser?.email}</h6>
          </div>
          <div className="side">
            <Avatar
              src={selectedContact?.photoURL}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
