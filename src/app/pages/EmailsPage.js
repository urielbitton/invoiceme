import EmailModal from "app/components/emails/EmailModal"
import EmailsTable from "app/components/emails/EmailsTable"
import AppButton from "app/components/ui/AppButton"
import AppModal from "app/components/ui/AppModal"
import AppTabsBar from "app/components/ui/AppTabsBar"
import EmptyPage from "app/components/ui/EmptyPage"
import HelmetTitle from "app/components/ui/HelmetTitle"
import PageTitleBar from "app/components/ui/PageTitleBar"
import { showXResultsOptions } from "app/data/general"
import { errorToast, infoToast, successToast } from "app/data/toastsTemplates"
import { useEmailsByType, useUnreadEmails } from "app/hooks/emailHooks"
import { sendAppEmail, updateEmailService } from "app/services/emailServices"
import { StoreContext } from "app/store/store"
import { convertClassicDateAndTime } from "app/utils/dateUtils"
import React, { useContext, useEffect, useState } from 'react'
import { NavLink, Route, Routes, useLocation, useSearchParams } from "react-router-dom"
import './styles/EmailsPage.css'

export default function EmailsPage() {

  const { myUser, setCompactNav, setToasts } = useContext(StoreContext)
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
  const [searchParams, setSearchParams] = useSearchParams()
  const newEmail = searchParams.get('new') === 'true'
  const allowSendEmail = toEmail && subject && message

  const clearInputs = () => {
    setToEmail('')
    setSubject('')
    setMessage('')
    setFiles([])
  }

  const markAsUnRead = () => {
    updateEmailService(activeEmail?.emailID, { 
      isRead: false
    })
    .then(() => {
      setToasts(successToast('Email marked as unread'))
    })
    .catch(err => {
      setToasts(errorToast('Error marking email as unread'))
      console.log(err)
    })
  }

  const sendEmail = () => {
    if(!allowSendEmail) return setToasts(infoToast('Please fill out a subject, message and recipient email.'))
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
        setToasts(successToast('Email sent!'))
      })
      .catch(err => {
        setLoading(false)
        setToasts(errorToast('Error sending email. Try again later'))
      })
  }

  const filesList = activeEmail?.files?.map((file, index) => {
    return <div
      key={index}
      className="email-file"
    >
      <i className="fas fa-paperclip" />
      <h6>{file}</h6>
    </div>
  })

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

  useEffect(() => {
    if (newEmail) {
      setShowNewEmailModal(true)
      setSearchParams({})
    }
  },[])

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
      {
        emails?.length > 0 ?
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
            <br/>
            {
              emailsLimit <= emails.length &&
              <AppButton
                label="Show More"
                onClick={() => setEmailsLimit(emailsLimit + limitsNum)}
              />
            }
          </div> :
          <EmptyPage
            label="No emails found."
            sublabel="Refine your search or send a new email."
            btnLabel="New"
            btnClick={() => setShowNewEmailModal(true)}
            btnIcon="fal fa-paper-plane"
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
          <label className="read-label">
            <input 
              type="checkbox"
              checked={!activeEmail?.isRead}
              onChange={() => markAsUnRead()}
              />
            <h6>Mark as unread</h6>
          </label>
        </div>
        <div className="body">
          <p>{activeEmail?.html.replaceAll('</br>', '\n')}</p>
        </div>
        {
          activeEmail?.files?.length > 0 &&
          <div className="files-list">
            <h5>Files</h5>
            {filesList}
          </div>
        }
      </AppModal>
    </div>
  )
}
