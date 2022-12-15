import AppButton from "app/components/ui/AppButton"
import Avatar from "app/components/ui/Avatar"
import HelmetTitle from "app/components/ui/HelmetTitle"
import { doGetContactByID, getContactStripeCustomerIDByEmail } from "app/services/contactsServices"
import { createPaymentIntentService, retrieveCustomerService } from "app/services/paymentsServices"
import { StoreContext } from "app/store/store"
import React, { useContext, useEffect, useState } from 'react'
import './styles/NewPaymentPage.css'
import { formatCurrency } from "app/utils/generalUtils"
import { useNavigate, useSearchParams } from "react-router-dom"
import ProContent from "app/components/ui/ProContent"
import { errorToast, infoToast, successToast } from "app/data/toastsTemplates"
import { createNotification } from "app/services/notifServices"
import ContactSearchDropdown from "app/components/contacts/ContactSearchDropdown"

export default function NewPaymentPage() {

  const { myUser, myUserName, myUserID, myMemberType, 
    setPageLoading, setToasts } = useContext(StoreContext)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [stripeLoading, setStripeLoading] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)
  const [contactCustomer, setContactCustomer] = useState(null)
  const [payAmount, setPayAmount] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const loadedContactID = searchParams.get('contactID')
  const filters = `ownerID: ${myUserID}`
  const navigate = useNavigate()
  const isBusiness = myMemberType === 'business'

  const initiateTransactionDetails = (contact) => {
    setSelectedContact(contact)
    setStripeLoading(true)
    getContactStripeCustomerIDByEmail(contact.email)
      .then((user) => {
        if(user?.stripe?.stripeAccountID && user?.stripe?.stripeDetailsSubmitted) {
          retrieveCustomerService({customerID: user.stripe.stripeCustomerID})
          .then((customer) => {
            setContactCustomer(customer)
            setStripeLoading(false) 
          })
          .catch((error) => {
            console.log(error)
            setStripeLoading(false)
            setToasts(errorToast('An error occured. Please try again.'))
          })
        }
        else {
          setStripeLoading(false)
          setToasts(infoToast('This user either did not complete their Stripe account or is not a business member on Invoice Me.'))
        }
      })
      .catch((error) => {
        console.log(error)
        setStripeLoading(false)
        setToasts(errorToast('An error occured. Please try again.'))
      })
  }

  const sendPayment = () => {
    if(+payAmount < 0.5) return setToasts(infoToast(`Amount must be greater than $0.50 ${myUser?.currency?.value}.`))
    if(!contactCustomer) return setToasts(infoToast('Please select a contact to send a payment to.'))
    setPageLoading(true)
    createPaymentIntentService({
      amount: (+payAmount * 100).toFixed(0),
      currency: myUser?.currency?.value,
      customerID: contactCustomer.id,
      paymentMethodID: contactCustomer.invoice_settings.default_payment_method,
      contactEmail: selectedContact.email,
      myName: myUserName,
      description: `Payment from ${myUserName} automatically deposited.`,
      myUserID
    })
      .then((charge) => {
        console.log(charge)
        setPageLoading(false)
        setToasts(successToast(`Payment sent to ${selectedContact.name}.`))
        createNotification(
          myUserID,
          'Payment Sent',
          `You sent a payment of ${formatCurrency(payAmount)} to ${selectedContact.name}.`,
          'fas fa-credit-card',
          '/payments/sent-payments'
        )
        setPayAmount('')
        setContactCustomer(null)
        setSelectedContact(null)
        navigate('/payments/sent-payments')
      })
      .catch((error) => {
        console.log(error)
        setPageLoading(false)
        setToasts(errorToast('An error occured while sending payment. Please try again.'))
      })
  }

  useEffect(() => {
    if(loadedContactID) {
      setStripeLoading(true)
      doGetContactByID(myUserID, loadedContactID)
      .then((data) => {
        initiateTransactionDetails(data)
      })
      .catch((error) => {
        console.log(error)
        setToasts(errorToast('An error occured. Please try again.'))
        setStripeLoading(false)
      })
    }
  },[loadedContactID])

  return isBusiness ? (
    <div className="new-payment-page">
      <HelmetTitle title="New Payment" />
      <div className="new-payment-container">
        <h4>Send a Payment</h4>
        <div className="payment-options">
          <i className="fab fa-cc-visa" />
          <i className="fab fa-cc-mastercard" />
          <i className="fab fa-cc-amex" />
          <i className="fab fa-cc-discover" />
        </div>
        <ContactSearchDropdown 
          query={query}
          setQuery={setQuery}
          loading={loading}
          setLoading={setLoading}
          filters={filters}
          onUserClick={initiateTransactionDetails}
        />
        <p className="transaction-details-text">
          Select a contact to send a payment to. If the contact has their payments setup the transaction details will
          open below. Otherwise they will be prompted to setup their payments.
        </p>
        {
          stripeLoading &&
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin" />
          </div>
        }
        <div className={`transaction-flex ${contactCustomer ? 'active' : ''}`}>
          <div className="side">
            <h5>My Details</h5>
            <Avatar
              src={myUser?.photoURL}
            />
            <h6>Name: {myUserName}</h6>
            <h6>Email: {myUser?.email}</h6>
            <h6>ID: {myUser?.stripe?.stripeCustomerID}</h6>
          </div>
          <div className="pay-to">
            <h5>Pay To</h5>
            <i className="fas fa-arrow-right" />
          </div>
          <div className="side">
            <h5>Contact Details</h5>
            <Avatar
              src={selectedContact?.photoURL}
            />
            <h6>{contactCustomer?.name}</h6>
            <h6>{contactCustomer?.email}</h6>
            <h6>ID: {contactCustomer?.id}</h6>
          </div>
        </div>
        {
          contactCustomer &&
          <div className="amount-section">
            <h5>Enter Amount</h5>
            <div className="pay-row">
              <input
                type="number"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
              />
              <AppButton
                label={`Send $${formatCurrency((+payAmount).toFixed(2))} ${myUser?.currency?.value}`}
                onClick={() => sendPayment()}
                disabled={+payAmount <= 0}
              />
            </div>
          </div>
        }
      </div>
    </div>
  ) :
  <ProContent />
}
