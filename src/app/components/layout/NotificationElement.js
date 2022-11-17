import React, { useContext } from 'react'
import { truncateText } from "app/utils/generalUtils"
import { StoreContext } from "app/store/store"
import { convertClassicDate, getTimeAgo } from "app/utils/dateUtils"

export default function NotificationElement(props) {

  const { notificationID, text, dateCreated, url, isRead, icon,
    notifImg } = props.notif

  return (
    <div 
      className={`notif-element ${!isRead ? 'unread' : ''}`} 
      key={notificationID}
    >
      <div className="notif-avatar">
        {
          notifImg ?
          <>
            <img src={notifImg} alt="avatar" />
            <div className="icon-container">
              <i className={icon}/>
            </div>
          </> :
          <div className="icon-container-center">
            <i className={icon}/>
          </div>
        }
      </div>
      <div className="text-info">
        <div className="texts">
          <p>{truncateText(text, 94)}</p>
          <small title={convertClassicDate(dateCreated?.toDate())}>{getTimeAgo(dateCreated?.toDate())}</small>
        </div>  
        <div 
          className={`read-reciept ${isRead ? "read" : ""}`} 
          onClick={(e) => {
            e.stopPropagation()
          }}
        />
      </div>
    </div>
  )
}
