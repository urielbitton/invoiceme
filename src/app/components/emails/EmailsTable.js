import { deleteDB, updateDB } from "app/services/CrudDB"
import { StoreContext } from "app/store/store"
import { convertClassicDate } from "app/utils/dateUtils"
import { truncateText } from "app/utils/generalUtils"
import React, { useContext } from 'react'
import AppItemRow from "../ui/AppItemRow"
import AppTable from "../ui/AppTable"
import IconContainer from "../ui/IconContainer"

export default function EmailsTable({ emails, setActiveEmail, setShowEmailModal }) {

  const { setPageLoading } = useContext(StoreContext)

  
  const markAsRead = (email) => {
    updateDB('mail', email.emailID, { 
      isRead: true 
    })
    .catch(err => console.log(err))
  }

  const openEmail = (email) => {
    setShowEmailModal(true)
    setActiveEmail(email)
    markAsRead(email)
  }

  const deleteEmail = (email) => {
    const confirm = window.confirm('Are you sure you want to delete this email?')
    if (confirm) {
      setPageLoading(true)
      deleteDB('mail', email.emailID)
      .then(() => {
        setPageLoading(false)
        alert('Email deleted!')
      })
      .catch(err => {
        setPageLoading(false)
        console.log(err)
      })
    }
  }

  const emailsList = emails?.map((email, index) => {
    return <AppItemRow
      key={index}
      item1={email.from}
      item2={email.to}
      item3={email.subject}
      item4={truncateText(email.html, 50)}
      item5={convertClassicDate(email.dateSent?.toDate())}
      actions={<>
        <IconContainer
          icon="fas fa-eye"
          iconSize={14}
          onClick={() => openEmail(email)}
          dimensions={27}
        />
        <IconContainer
          icon="fas fa-trash"
          iconSize={14}
          onClick={() => deleteEmail(email)}
          dimensions={27}
        />
        </>
      }
    />
  })

  return (
    <AppTable
      headers={[
        'From',
        'To',
        'Subject',
        'Message',
        'Date',
        'View'
      ]}
      rows={emailsList}
    />
  )
}
