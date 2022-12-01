import ContactEstimates from "app/components/contacts/ContactEstimates"
import ContactEvents from "app/components/contacts/ContactEvents"
import ContactGeneral from "app/components/contacts/ContactGeneral"
import ContactInvoices from "app/components/contacts/ContactInvoices"
import ContactPayments from "app/components/contacts/ContactPayments"
import AppButton from "app/components/ui/AppButton"
import { AppInput, AppTextarea } from "app/components/ui/AppInputs"
import AppModal from "app/components/ui/AppModal"
import AppTabsBar from "app/components/ui/AppTabsBar"
import Avatar from "app/components/ui/Avatar"
import EmailModal from "app/components/emails/EmailModal"
import { useContact } from "app/hooks/contactsHooks"
import { useContactEstimates } from "app/hooks/estimateHooks"
import { useContactInvoices } from "app/hooks/invoiceHooks"
import { sendSMSService, updateContactService } from "app/services/contactsServices"
import { sendAppEmail } from "app/services/emailServices"
import { StoreContext } from "app/store/store"
import { convertClassicDate } from "app/utils/dateUtils"
import { validatePhone } from "app/utils/generalUtils"
import React, { useContext, useState } from 'react'
import { NavLink, Route, Routes, useLocation, useParams } from "react-router-dom"
import './styles/ContactPage.css'

export default function ContactPage() {

  const { myUserID, myUser, setPageLoading, myMemberType } = useContext(StoreContext)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showSMSModal, setShowSMSModal] = useState(false)
  const [textMessage, setTextMessage] = useState('')
  const [emailSubject, setEmailSubject] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const [emailFiles, setEmailFiles] = useState([])
  const [textMediaUrl, setTextMediaUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const contactID = useParams().contactID
  const contact = useContact(myUserID, contactID)
  const contactInvoices = useContactInvoices(myUserID, contact?.email)
  const contactEstimates = useContactEstimates(myUserID, contact?.email)
  const location = useLocation()
  const isBusiness = myMemberType === "business"

  const notIndexTab = location.pathname.includes('invoices') ||
    location.pathname.includes('estimates') ||
    location.pathname.includes('payments')

  const resetInputFields = () => {
    setTextMessage('')
    setEmailSubject('')
    setEmailMessage('')
    setEmailFiles([])
  }

  const sendEmail = () => {
    if (!emailSubject || !emailMessage)
      return alert('Please fill in all fields')
    setLoading(true)
    sendAppEmail(
      myUser?.email,
      contact?.email,
      emailSubject,
      emailMessage,
      emailFiles.map(file => file.file)
    )
    .then(() => {
      setLoading(false)
      resetInputFields()
      setShowEmailModal(false)
      alert('Email sent to contact.')
    })
    .catch(err => {
      setLoading(false)
      alert(err.message)
    })
  }

  const sendSMS = () => {
    if (!validatePhone(contact?.phone) || !textMessage)
      return alert('Please enter a valid phone number and message.')
    sendSMSService(contact?.phone, textMessage, textMediaUrl, setLoading)
      .then(() => {
        setShowSMSModal(false)
        resetInputFields()
      })
  }

  return (
    contact ?
      <div className="contact-page">
        <header>
          <div className="side">
            <Avatar
              dimensions="90px"
              src={contact.photoURL || 'https://i.imgur.com/D4fLSKa.png'}
            />
          </div>
          <div className="side intro">
            <h4>{contact.name}</h4>
            <h5>{contact.companyName}</h5>
            <div className="btn-group">
              <AppButton
                label="Send Email"
                onClick={() => setShowEmailModal(true)}
                rightIcon="far fa-envelope"
              />
              <AppButton
                label="Send SMS"
                onClick={() => isBusiness ? setShowSMSModal(true) : alert('Sending SMS is only available to business members.')}
                buttonType="outlineBlueBtn"
                rightIcon="far fa-comment"
              />
            </div>
          </div>
          <div className="side info">
            <h5>
              <span><i className="fas fa-envelope" />Email</span>
              <span>{contact.email}</span>
            </h5>
            <h5>
              <span><i className="fas fa-phone" />Phone</span>
              <span>{contact.phone}</span>
            </h5>
            <h5>
              <span><i className="fas fa-map-marker-alt" />Address</span>
              <span>{contact.address}</span>
            </h5>
            <h5>
              <span><i className="fas fa-globe-americas" />Location</span>
              <span>{contact.city}, {contact.region}, {contact.country}</span>
            </h5>
            <h5>
              <span><i className="fas fa-mailbox" />Postal Code/ZIP</span>
              <span>{contact.postcode}</span>
            </h5>
            <h5>
              <span><i className="fas fa-clock" />Date Created</span>
              <span>{convertClassicDate(contact.dateCreated?.toDate())}</span>
            </h5>
          </div>
          <div className="side favorite">
            <AppButton
              label={contact.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              onClick={() => updateContactService(myUserID, contactID, {isFavorite: !contact.isFavorite}, setPageLoading)}
              buttonType={contact.isFavorite ? 'primary' : 'outlineBlueBtn'}
              rightIcon={contact.isFavorite ? 'fas fa-heart' : 'far fa-heart'}
            />
          </div>
        </header>
        <div className="contact-routes">
          <AppTabsBar noSpread spacedOut={15}>
            <NavLink
              to=""
              className={notIndexTab ? 'not-active' : ''}
            >
              General
            </NavLink>
            <NavLink
              to="invoices"
            >
              Invoices
            </NavLink>
            <NavLink to="estimates">
              Estimates
            </NavLink>
            <NavLink to="payments">
              Payments
            </NavLink>
            <NavLink to="events">
              Events
            </NavLink>
          </AppTabsBar>
        </div>
        <div className="contact-pages">
          <Routes>
            <Route path="" element={
              <ContactGeneral
                contact={contact}
                invoices={contactInvoices}
                estimates={contactEstimates}
                payments={null}
              />}
            />
            <Route path="invoices" element={
              <ContactInvoices invoices={contactInvoices} />}
            />
            <Route path="estimates" element={
              <ContactEstimates estimates={contactEstimates} />}
            />
            <Route path="payments" element={
              <ContactPayments

              />}
            />
            <Route path="events" element={
              <ContactEvents

              />}
            />
          </Routes>
        </div>
        <EmailModal
          showModal={showEmailModal}
          setShowModal={setShowEmailModal}
          fromEmail={myUser?.email}
          toEmail={contact.email}
          subject={emailSubject}
          setSubject={setEmailSubject}
          message={emailMessage}
          setMessage={setEmailMessage}
          files={emailFiles}
          setFiles={setEmailFiles}
          sendEmail={sendEmail}
          loading={loading}
          disableTo
          disableFrom
        />
        <AppModal
          label="Send SMS"
          showModal={showSMSModal}
          setShowModal={setShowSMSModal}
          portalClassName="new-sms-modal"
          actions={
            <>
              <AppButton
                label="Send SMS"
                onClick={() => isBusiness ? sendSMS() : alert('Sending SMS is only available for business accounts.')}
                rightIcon={loading ? 'fas fa-spinner fa-spin' : 'far fa-comment'}
              />
              <AppButton
                label="Cancel"
                onClick={() => setShowSMSModal(false)}
                buttonType="invertedBtn"
              />
            </>
          }
        >
          <form>
            <AppInput
              label="Phone Number"
              value={contact?.phone}
              placeholder="Enter phone number"
              disabled
            />
            <AppTextarea
              label="SMS Message"
              value={textMessage}
              onChange={e => setTextMessage(e.target.value)}
              placeholder="Enter message"
            />
            <AppInput
              label="Media URL (Optional)"
              value={textMediaUrl}
              onChange={e => setTextMediaUrl(e.target.value)}
              placeholder="Enter media URL"
            />
          </form>
        </AppModal>
      </div> :
      null
  )
}
