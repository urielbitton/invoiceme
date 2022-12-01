import NotificationCard from "app/components/notifications/NotificationCard"
import AppButton from "app/components/ui/AppButton"
import { AppSelect } from "app/components/ui/AppInputs"
import HelmetTitle from "app/components/ui/HelmetTitle"
import PageTitleBar from "app/components/ui/PageTitleBar"
import { showXResultsOptions } from "app/data/general"
import { useAllNotifications, useUnreadNotifications } from "app/hooks/notificationHooks"
import { StoreContext } from "app/store/store"
import React, { useContext, useEffect, useState } from 'react'
import './styles/NotificationsPage.css'

export default function NotificationsPage() {

  const { myUser, myUserID, setNavItem1, setNavItem2 } = useContext(StoreContext)
  const limitsNum = showXResultsOptions[1].value
  const [notifsLimit, setNotifsLimit] = useState(limitsNum)
  const unreadNotifications = useUnreadNotifications(myUserID)
  const allNotifications = useAllNotifications(myUserID, notifsLimit)

  const notificationsList = allNotifications?.map((notif, index) => {
    return <NotificationCard
      notification={notif}
      key={index}
    />
  })

  useEffect(() => {
    setNavItem1({ label: "Unread", icon: 'fas fa-bell-exclamation', value: unreadNotifications?.length })
    setNavItem2({ 
      label: "Total", 
      icon: 'fas fa-bell', 
      value: `${allNotifications?.length}${notifsLimit <= allNotifications?.length ? '+' : ''}` 
    })
    return () => {
      setNavItem1(null)
      setNavItem2(null)
    }
  }, [myUser, unreadNotifications, allNotifications])

  return (
    <div className="notifications-page">
      <HelmetTitle title="Notifications" />
      <PageTitleBar
        title="Notifications"
      />
      <div className="toolbar">
        <h6>Showing {allNotifications?.length} notifications</h6>
        <AppSelect
          label="Show"
          options={showXResultsOptions}
          value={notifsLimit}
          onChange={e => setNotifsLimit(e.target.value)}
        />
      </div>
      <div className="notifications-list">
        {notificationsList}
      </div>
      {
        notifsLimit <= allNotifications?.length &&
        <AppButton
          label="Load More"
          onClick={() => setNotifsLimit(notifsLimit + limitsNum)}
          className="load-more-btn"
        />
      }
    </div>
  )
}
