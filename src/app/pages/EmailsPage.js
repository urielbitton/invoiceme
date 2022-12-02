import EmailModal from "app/components/emails/EmailModal"
import EmailsTable from "app/components/emails/EmailsTable"
import AppButton from "app/components/ui/AppButton"
import AppTabsBar from "app/components/ui/AppTabsBar"
import HelmetTitle from "app/components/ui/HelmetTitle"
import PageTitleBar from "app/components/ui/PageTitleBar"
import { showXResultsOptions } from "app/data/general"
import { useEmailsByType, useUnreadEmails } from "app/hooks/emailHooks"
import { sendAppEmail } from "app/services/emailServices"
import { StoreContext } from "app/store/store"
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
  const emails = useEmailsByType(myUser?.email, emailsType, emailsLimit)
  const unreadEmails = useUnreadEmails(myUser?.email)
  const location = useLocation()

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
  },[])

  useEffect(() => {
    if(location.pathname.includes('sent')) {
      setEmailsType('sent')
    }
    else {
      setEmailsType('inbox')
    }
    return () => setEmailsType('inbox')
  },[location])

  return (
    <div className="emails-page">
      <HelmetTitle title="Emails" />
      <PageTitleBar
        title="Emails"
        rightComponent={
          <AppButton
            label="New Email"
            leftIcon="fas fa-plus"
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
          <Route path="" element={<EmailsTable emails={emails} />} />
          <Route path="sent" element={<EmailsTable emails={emails} />} />
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
    </div>
  )
}
