import { functions } from "app/firebase/fire"
import { useEmailsByType, useUnreadEmails } from "app/hooks/emailHooks"
import { useAllNotifications, useUnreadNotifications } from "app/hooks/notificationHooks"
import { StoreContext } from "app/store/store"
import React, { useContext, useEffect, useState } from 'react'
import { AppInput } from "../ui/AppInputs"
import DropdownButton from "../ui/DropdownButton"
import IconContainer from "../ui/IconContainer"
import EmailElement from "./EmailElement"
import NavBottomBar from "./NavBottomBar"
import NavDropdown from "./NavDropdown"
import NavSearch from "./NavSearch"
import NotificationElement from "./NotificationElement"
import ProfileDropdown from "./ProfileDropdown"
import './styles/Navbar.css'

export default function Navbar() {

  const { myUserID, myUser, compactNav, setShowMobileSidebar } = useContext(StoreContext)
  const [showMenu, setShowMenu] = useState(null)
  const unreadNotifications = useUnreadNotifications(myUserID)
  const unreadEmails = useUnreadEmails(myUser?.email)
  const emails = useEmailsByType(myUser?.email, 'inbox', 5)
  const notifications = useAllNotifications(myUserID, 5)

  const notificationsList = notifications?.map((notif, index) => {
    return <NotificationElement
      key={index}
      notif={notif}
    />
  })

  const emailsList = emails?.map((email, index) => {
    return <EmailElement
      key={index}
      email={email}
    />
  })

  useEffect(() => {
    if (showMenu !== null) {
      window.onclick = () => setShowMenu(null)
    }
    return () => window.onclick = null
  }, [showMenu])

  return (
    <nav className={`navbar ${compactNav ? 'compact-nav' : ''}`}>
      <div className="topbar">
        <div className="left">
          <NavSearch />
          <div 
            className="mobile-btn"
            onClick={() => setShowMobileSidebar(true)}
          >
            <i className="fal fa-bars" />
          </div>
        </div>
        <div className="right">
          <DropdownButton
            label="Create New"
            iconRight="fal fa-plus"
            showMenu={showMenu === 'show'}
            setShowMenu={setShowMenu}
            className="create-new-btn"
            buttonType="outlineBtn"
            rightIcon="fal fa-chevron-down"
            items={[
              { label: "New Invoice", icon: "fas fa-file-invoice-dollar", url: "/invoices/new" },
              { label: "New Estimate", icon: "fas fa-file-invoice", url: "/estimates/new" },
              { label: "New Contact", icon: "fas fa-address-book", url: "/contacts/new" },
              { label: "New Email", icon: "fas fa-envelope", url: "/emails?new=true" },
              { label: "New Payment", icon: "fas fa-credit-card", url: "/payments/new" },
            ]}
          />
          <IconContainer
            icon="fal fa-bell"
            inverted
            iconColor="#fff"
            dimensions="30px"
            tooltip="Notifications"
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(showMenu === 'notifications' ? null : 'notifications')
            }}
            badgeValue={unreadNotifications.length}
            badgeBgColor="#fff"
            badgeTextColor="var(--darkGrayText)"
          />
          <IconContainer
            icon="fal fa-envelope"
            inverted
            iconColor="#fff"
            dimensions="30px"
            tooltip="Emails"
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(showMenu === 'emails' ? null : 'emails')
            }}
            badgeValue={unreadEmails.length}
            badgeBgColor="#fff"
            badgeTextColor="var(--darkGrayText)"
          />
          <NavDropdown 
            label="Notifications"
            viewAllURL="/notifications"
            type="notifications" 
            showDropdown={showMenu}
            setShowDropdown={setShowMenu} 
            itemsRender={notificationsList}
          />
          <NavDropdown 
            label="Emails"
            viewAllURL="/emails"
            type="emails" 
            showDropdown={showMenu}
            setShowDropdown={setShowMenu} 
            itemsRender={emailsList}
          />
          <ProfileDropdown
            showMenu={showMenu}
            setShowMenu={setShowMenu}
          />
        </div>
      </div>
      <NavBottomBar />
      <div className="shapes-container">
        <div className="shape shape1" />
        <div className="shape shape2" />
        <div className="shape shape3" />
        <div className="shape shape4" />
      </div>
    </nav>
  )
}
