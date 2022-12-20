import AppButton from "app/components/ui/AppButton"
import { AppInput, AppSelect, AppTextarea } from "app/components/ui/AppInputs"
import PageTitleBar from "app/components/ui/PageTitleBar"
import { supportIssuesOptions } from "app/data/general"
import { StoreContext } from "app/store/store"
import React, { useContext, useEffect, useState } from 'react'
import './styles/HelpAndSupport.css'
import { infoToast } from "app/data/toastsTemplates"
import { createSupportTicketService } from "app/services/emailServices"

export default function HelpAndSupport() {

  const { myUser, setCompactNav, setToasts, myUserID, 
    setPageLoading } = useContext(StoreContext)
  const [supportType, setSupportType] = useState(null)
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [issueType, setIssueType] = useState("technical")
  const allowSendMessage = issueType && message && (issueType !== "other" || subject)

  const clearForm = () => {
    setSubject("")
    setMessage("")
    setIssueType("technical")
  }

  const sendMessage = () => {
    if (!!!allowSendMessage) return setToasts(infoToast("Please add a message to submit the form."))
    const confirm = window.confirm("Send message to support?")
    if(!confirm) return setToasts(infoToast("Message not sent."))
    setPageLoading(true)
    createSupportTicketService(
      myUserID,
      issueType === "other" ? subject : issueType,
      message,
      myUser.email,
    )
      .then(() => {
        setPageLoading(false)
        setToasts(infoToast("Your message has been sent to the support team. We'll get back to you as soon as possible"))
        clearForm()
      })
      .catch(err => {
        console.log(err)
        setPageLoading(false)
      })
  }

  useEffect(() => {
    setCompactNav(true)
    return () => setCompactNav(false)
  }, [])

  return (
    <div className="help-page">
      <PageTitleBar
        title="Help & Support"
        subtitle="You can send us a message here and we'll get back to you as soon as possible."
      />
      <div className="select-content">
        <div
          className={`support-box ${supportType === "message" ? "active" : ""}`}
          onClick={() => setSupportType("message")}
        >
          <i className="fas fa-envelope" />
          <h4>Customer Support</h4>
        </div>
        <div
          className={`support-box ${supportType === "chat" ? "active" : ""}`}
          onClick={() => setSupportType("chat")}
        >
          <i className="fas fa-comment" />
          <h4>Chat Support</h4>
        </div>
      </div>
      {
        supportType === "message" &&
        <div className="message-content">
          <form onSubmit={(e) => e.preventDefault()}>
            <AppSelect
              label="Issue Type"
              options={supportIssuesOptions}
              onChange={(e) => setIssueType(e.target.value)}
              value={issueType}
            />
            {
              issueType === "other" &&
              <AppInput
                label="Other Issue"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            }
            <AppTextarea
              label="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <AppButton
              label="Send Message"
              onClick={() => sendMessage()}
              disabled={!!!allowSendMessage}
            />
          </form>
        </div>
      }
      {
        supportType === "chat" &&
        <>Coming soon...</>
      }
    </div>
  )
}
