import EmailModal from "app/components/emails/EmailModal"
import EmailsTable from "app/components/emails/EmailsTable"
import AppButton from "app/components/ui/AppButton"
import AppModal from "app/components/ui/AppModal"
import AppTabsBar from "app/components/ui/AppTabsBar"
import HelmetTitle from "app/components/ui/HelmetTitle"
import PageTitleBar from "app/components/ui/PageTitleBar"
import { showXResultsOptions } from "app/data/general"
import { useEmailsByType, useUnreadEmails } from "app/hooks/emailHooks"
import { sendAppEmail } from "app/services/emailServices"
import { StoreContext } from "app/store/store"
import { convertClassicDateAndTime } from "app/utils/dateUtils"
import React, { useContext, useEffect, useState } from 'react'
import { NavLink, Route, Routes, useLocation } from "react-router-dom"
import './styles/EmailsPage.css'

export default function EmailsPage() {

  const { myUser, setCompactNav } = useContext(StoreContext)
  const [emailsType, setEmailsType] = useState('inbox')
  const limitsNum = showXResultsOptions[0].value
  const [emailsLimit, setEmailsLimit] = useState(limitsNum)
  const [showNewEmailModal, setShowNewEmailModal] = useState(false)
  const [toEmail, setToEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [activeEmail, setActiveEmail] = useState(null)
  const emails = useEmailsByType(myUser?.email, emailsType, emailsLimit)
  const unreadEmails = useUnreadEmails(myUser?.email)
  const location = useLocation()


  const clearInputs = () => {
    setToEmail('')
    setSubject('')
    setMessage('')
    setFiles([])
  }

  const sendEmail = () => {
    setLoading(true)
    sendAppEmail(
      myUser?.email,
      toEmail,
      subject,
      message,
      files
    )
      .then(() => {
        setLoading(false)
        setShowNewEmailModal(false)
        clearInputs()
        alert('Email sent!')
      })
      .catch(err => {
        setLoading(false)
        alert(err)
      })
  }

  useEffect(() => {
    setCompactNav(true)
    return () => setCompactNav(false)
  }, [])

  useEffect(() => {
    if (location.pathname.includes('sent')) {
      setEmailsType('sent')
    }
    else {
      setEmailsType('inbox')
    }
    return () => setEmailsType('inbox')
  }, [location])

  useEffect(() => {
    if (!showEmailModal) {
      setActiveEmail(null)
    }
  }, [showEmailModal])

  return (
    <div className="emails-page">
      <HelmetTitle title="Emails" />
      <PageTitleBar
        title="Emails"
        rightComponent={
          <AppButton
            label="New Email"
            leftIcon="far fa-plus"
            onClick={() => setShowNewEmailModal(true)}
          />
        }
      />
      <AppTabsBar
        noSpread
        spacedOut={15}
        sticky
      >
        <NavLink
          to=""
          className={location.pathname !== '/emails' ? 'not-active' : ''}
        >
          Inbox{unreadEmails?.length > 0 && ` (${unreadEmails?.length})`}
        </NavLink>
        <NavLink
          to="sent"
        >
          Sent
        </NavLink>
      </AppTabsBar>
      <div className="emails-page-routes">
        <Routes>
          <Route path="" element={<EmailsTable
            emails={emails}
            setActiveEmail={setActiveEmail}
            setShowEmailModal={setShowEmailModal}
          />} />
          <Route path="sent" element={<EmailsTable
            emails={emails}
            setActiveEmail={setActiveEmail}
            setShowEmailModal={setShowEmailModal}
          />} />
        </Routes>
      </div>
      {
        emailsLimit <= emails.length &&
        <AppButton
          label="Show More"
          onClick={() => setEmailsLimit(emailsLimit + limitsNum)}
        />
      }
      <EmailModal
        showModal={showNewEmailModal}
        setShowModal={setShowNewEmailModal}
        fromEmail={myUser?.email}
        toEmail={toEmail}
        setToEmail={setToEmail}
        subject={subject}
        setSubject={setSubject}
        message={message}
        setMessage={setMessage}
        files={files}
        setFiles={setFiles}
        sendEmail={sendEmail}
        loading={loading}
        disableFrom
      />
      <AppModal
        showModal={showEmailModal}
        setShowModal={setShowEmailModal}
        label={activeEmail?.subject}
        portalClassName="email-modal-portal"
        actions={
          <AppButton
            label="Done"
            onClick={() => setShowEmailModal(false)}
          />
        }
      >
        <div className="header">
          <h6>
            From: <span>{activeEmail?.from}</span>
          </h6>
          <h6>
            To: <span>{activeEmail?.to}</span>
          </h6>
          <h6>
            Subject: <span>{activeEmail?.subject}</span>
          </h6>
          <h6>
            Date: <span>{convertClassicDateAndTime(activeEmail?.dateSent?.toDate())}</span>
          </h6>
        </div>
        <div className="body">
          <p>{activeEmail?.html}</p>
        </div>
      </AppModal>
    </div>
  )
}
