import { getMyInboxEmails, getMySentEmails, getUnreadEmails } from "app/services/emailServices"
import { useEffect, useState } from "react"

export const useInboxEmails = (myEmail, limit) => {

  const [inboxEmails, setInboxEmails] = useState([])

  useEffect(() => {
    if (myEmail) {
      getMyInboxEmails(myEmail, setInboxEmails, limit)
    }
  }, [myEmail, limit])

  return inboxEmails
}

export const useSentEmails = (myEmail, limit) => {

  const [sentEmails, setSentEmails] = useState([])

  useEffect(() => {
    if (myEmail) {
      getMySentEmails(myEmail, setSentEmails, limit)
    }
  }, [myEmail, limit])

  return sentEmails
}

export const useEmailsByType = (myEmail, type, limit) => {

  const [emails, setEmails] = useState([])

  useEffect(() => {
    if(myEmail) {
      type === 'inbox' ? 
      getMyInboxEmails(emails, setEmails, limit) :
      getMySentEmails(emails, setEmails, limit)

    }
  }, [myEmail, type, limit])

  return emails
}

export const useUnreadEmails = (myEmail) => {

  const [unreadEmails, setUnreadEmails] = useState([])

  useEffect(() => {
    if(myEmail) {
      getUnreadEmails(myEmail, setUnreadEmails)
    }
  }, [myEmail])

  return unreadEmails
}