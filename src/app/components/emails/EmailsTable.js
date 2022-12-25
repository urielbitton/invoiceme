import { errorToast, infoToast } from "app/data/toastsTemplates"
import { deleteDB, updateDB } from "app/services/CrudDB"
import { StoreContext } from "app/store/store"
import { convertClassicDate } from "app/utils/dateUtils"
import { cleanHtml, truncateText } from "app/utils/generalUtils"
import React, { useContext } from 'react'
import AppItemRow from "../ui/AppItemRow"
import AppTable from "../ui/AppTable"
import IconContainer from "../ui/IconContainer"

export default function EmailsTable({ emails, setActiveEmail, setShowEmailModal }) {

  const { setPageLoading, setToasts, myUser } = useContext(StoreContext)
  
  const markAsRead = (email) => {
    updateDB('mail', email.emailID, { 
      isRead: true 
    })
    .catch(err => {
      console.log(err)
      setToasts(errorToast('An error occured. Please try again.'))
    })
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
        setToasts(infoToast('Email deleted!'))
      })
      .catch(err => {
        setPageLoading(false)
        console.log(err)
        setToasts(errorToast('An error occured. Please try again.'))
      })
    }
  }

  const emailsList = emails?.map((email, index) => {
    return <AppItemRow
      key={index}
      item1={<>
        {(!email.isRead && email.from !== myUser?.email) && <i className="fas fa-circle"/>}
        {truncateText(email.from, 20)}
      </>}
      item2={email.to}
      item3={email.subject}
      item4={truncateText(cleanHtml(email.html), 40)}
      item5={email?.files?.length > 0 ?<>
        <i className="fas fa-paperclip"/>&nbsp;
        {email.files.length} file{email.files.length !== 1 ? 's' : ''}</> : 'No files'
      }
      item6={convertClassicDate(email.dateSent?.toDate())}
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
      onDoubleClick={() => openEmail(email)}
    />
  })

  return (
    <AppTable
      headers={[
        'From',
        'To',
        'Subject',
        'Message',
        'Files',
        'Date',
        'View'
      ]}
      rows={emailsList}
    />
  )
}
