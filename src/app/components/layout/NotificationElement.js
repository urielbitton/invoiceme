import React, { useContext } from 'react'
import { truncateText } from "app/utils/generalUtils"
import { convertClassicDate, getTimeAgo } from "app/utils/dateUtils"
import { useNavigate } from "react-router-dom"
import { updateDB } from "app/services/CrudDB"
import { StoreContext } from "app/store/store"
import './styles/NotificationElement.css'
import IconContainer from "../ui/IconContainer"
import { errorToast } from "app/data/toastsTemplates"

export default function NotificationElement(props) {

  const { myUserID, setToasts } = useContext(StoreContext)
  const { notificationID, text, dateCreated, url, isRead, icon } = props.notif
  const navigate = useNavigate()

  const markAsRead = (goToURL) => {
    updateDB(`users/${myUserID}/notifications`, notificationID, {
      isRead: true 
    })
    .then(() => {
      if(goToURL)
        navigate(url)
    })
    .catch(err => {
      console.log(err)
      setToasts(errorToast('An error occured. Please try again.'))
    })
  }

  return (
    <div 
      className={`notif-element ${!isRead ? 'unread' : ''}`} 
      onClick={() => markAsRead(true)}
      key={notificationID}
    >
      <div className="left">
        <IconContainer
          icon={icon}
          className="notif-icon"
          bgColor="var(--primary)"
          iconColor="#fff"
          dimensions="32px"
          iconSize="13px"
        />
      </div>
      <div className="text-info">
        <div className="texts">
          <p>{truncateText(text, 60)}</p>
          <small title={convertClassicDate(dateCreated?.toDate())}>{getTimeAgo(dateCreated?.toDate())}</small>
        </div>  
        <div 
          className={`read-reciept ${isRead ? "read" : ""}`} 
          onClick={(e) => {
            e.stopPropagation()
            markAsRead(false)
          }}
        />
      </div>
    </div>
  )
}
