import { useNotifications, useUnreadNotifications } from "app/hooks/notificationHooks"
import { signOut } from "app/services/CrudDB"
import { StoreContext } from "app/store/store"
import React, { useContext, useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import { AppInput } from "../ui/AppInputs"
import Avatar from "../ui/Avatar"
import DropdownButton from "../ui/DropdownButton"
import IconContainer from "../ui/IconContainer"
import NavBottomBar from "./NavBottomBar"
import NavDropdown from "./NavDropdown"
import NotificationElement from "./NotificationElement"
import './styles/Navbar.css'

export default function Navbar() {

  const { myUserID, setPageLoading, myUserImg, myMemberType,
    compactNav, setShowMobileSidebar } = useContext(StoreContext)
  const [showMenu, setShowMenu] = useState(null)
  const unreadNotifications = useUnreadNotifications(myUserID)
  const notifications = useNotifications(myUserID, 5)

  const notificationsList = notifications?.map((notif, index) => {
    return <NotificationElement
      key={index}
      notif={notif}
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
          <AppInput
            placeholder="Search"
            iconright={<i className="fal fa-search" />}
          />
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
              { label: "New Invoice", icon: "fal fa-file-invoice-dollar", url: "/invoices/new" },
              { label: "New Estimate", icon: "fal fa-file-invoice", url: "/estimates/new" },
              { label: "New Contact", icon: "fal fa-address-book", url: "/contacts/new" },
              { label: "New Payment", icon: "fal fa-credit-card", url: "/payments/new" },
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
            viewAllURL="/messages"
            type="emails" 
            showDropdown={showMenu}
            setShowDropdown={setShowMenu} 
          />
          <div className="profile-container">
            <div
              className="clickable-profile"
              onClick={(e) => {
                e.stopPropagation()
                setShowMenu(prev => prev === 'profile' ? null : 'profile')
              }}
            >
              <Avatar
                src={myUserImg}
                dimensions="30px"
                alt="profile"
                border="1.5px solid #fff"
              />
              <i className="fal fa-angle-down" />
            </div>
            <div className={`profile-dropdown ${showMenu === 'profile' ? 'show' : ''}`}>
              <Link to="/my-account">
                <i className="fas fa-user-circle" />
                <span>My Account</span>
              </Link>
              {
                myMemberType !== 'business' &&
                <Link to="/upgrade">
                  <i className="fas fa-rocket-launch" />
                  <span>Upgrade</span>
                </Link>
              }
              <Link to="help-and-contact">
                <i className="fas fa-question-circle" />
                <span>Help & Contact</span>
              </Link>
              <Link to="/settings">
                <i className="fas fa-cog" />
                <span>Settings</span>
              </Link>
              <h6 onClick={() => signOut(setPageLoading)}>
                <i className="fas fa-sign-out" />
                <span>Sign Out</span>
              </h6>
              <hr />
              <div className="info">
                <span>Account Type:</span>
                <span className="capitalize value">{myMemberType}</span>
              </div>
            </div>
          </div>
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
