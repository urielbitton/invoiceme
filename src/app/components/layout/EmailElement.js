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

  const markAsRead = (read) => {
    updateDB('mail', emailID, {
      isRead: read 
    })
    .catch(err => {
      console.log(err)
      setToasts(errorToast('An error occured. Please try again.'))
    })
    navigate(`/emails`)
  }

  return (
    <div 
      className={`notif-element ${!isRead ? 'unread' : ''}`} 
      onClick={() => markAsRead(true)}
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
          <p>{truncateText(html, 60)}</p>
          <small title={convertClassicDate(dateSent?.toDate())}>{getTimeAgo(dateSent?.toDate())}</small>
        </div>  
        <div 
          className={`read-reciept ${isRead ? "read" : ""}`} 
          onClick={(e) => {
            e.stopPropagation()
            markAsRead(false)
          }}
        />
        { files?.length > -1 && <i className="fal fa-paperclip" />}
      </div>
    </div>
  )
}
