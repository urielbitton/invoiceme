import React, { useContext } from 'react'
import { truncateText } from "app/utils/generalUtils"
import { convertClassicDate, getTimeAgo } from "app/utils/dateUtils"
import { useNavigate } from "react-router-dom"
import { updateDB } from "app/services/CrudDB"
import './styles/NotificationElement.css'
import IconContainer from "../ui/IconContainer"
import { StoreContext } from "app/store/store"
import { errorToast } from "app/data/toastsTemplates"

export default function EmailElement(props) {

  const { setToasts } = useContext(StoreContext)
  const { emailID, subject, html, from, to, dateSent, files,
    isRead } = props.email
  const navigate = useNavigate()

  const toggleRead = (e, read, navToEmails) => {
    e.stopPropagation()
    updateDB('mail', emailID, {
      isRead: read 
    })
    .then(() => {
      if(!navToEmails) return
      navigate(`/emails`)
    })
    .catch(err => {
      console.log(err)
      setToasts(errorToast('An error occured. Please try again.'))
    })
  }

  return (
    <div 
      className={`notif-element ${!isRead ? 'unread' : ''}`} 
      onClick={(e) => toggleRead(e, true, true)}
      key={emailID}
    >
      <div className="left">
        <IconContainer
          icon="fas fa-envelope"
          className="notif-icon"
          bgColor="var(--primary)"
          iconColor="#fff"
          dimensions="32px"
          iconSize="13px"
        />
      </div>
      <div className="text-info">
        <div className="texts">
          <small>{truncateText(from, 30)}</small>
          <small>{truncateText(subject, 30)}</small>
          <p>{truncateText(html.replaceAll('</br>', ' '), 60)}</p>
          <small title={convertClassicDate(dateSent?.toDate())}>{getTimeAgo(dateSent?.toDate())}</small>
        </div>  
        <div 
          className={`read-reciept ${isRead ? "read" : ""}`} 
          onClick={(e) => toggleRead(e, !isRead, false)}
        />
        { files?.length > -1 && <i className="fal fa-paperclip" />}
      </div>
    </div>
  )
}
