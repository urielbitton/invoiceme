import { signOut } from "app/services/CrudDB"
import { StoreContext } from "app/store/store"
import React, { useContext, useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import { AppInput } from "../ui/AppInputs"
import Avatar from "../ui/Avatar"
import DropdownButton from "../ui/DropdownButton"
import IconContainer from "../ui/IconContainer"
import './styles/Navbar.css'

export default function Navbar() {

  const { setPageLoading } = useContext(StoreContext)
  const [showButtonMenu, setShowButtonMenu] = useState(false)
  const [openProfileMenu, setOpenProfileMenu] = useState(false)

  useEffect(() => {
    if (openProfileMenu) {
      window.onclick = () => setOpenProfileMenu(false)
    }
  }, [openProfileMenu]) 

  return (
    <nav className="navbar">
      <div className="topbar">
        <div className="left">
          <AppInput
            placeholder="Search"
            iconright={<i className="fal fa-search" />}
          />
        </div>
        <div className="right">
          <DropdownButton
            label="Create New"
            iconRight="fal fa-plus"
            showMenu={showButtonMenu}
            setShowMenu={setShowButtonMenu}
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
          />
          <IconContainer
            icon="fal fa-envelope"
            inverted
            iconColor="#fff"
            dimensions="30px"
          />
          <div className="profile-container">
            <div 
              className="clickable-profile"
              onClick={(e) => {
                setOpenProfileMenu(prev => !prev)
                e.stopPropagation()
              }}
            >
              <Avatar
                img="https://i.imgur.com/0xERjh8.jpg"
                dimensions="30px"
                alt="profile"
                border="1.5px solid #fff"
              />
              <i className="fal fa-angle-down" />
            </div>
            <div className={`profile-dropdown ${openProfileMenu ? 'show' : ''}`}>
              <Link to="/my-profile">
                <i className="fas fa-user" />
                <span>My Profile</span>
              </Link>
              <Link to="/my-account">
                <i className="fas fa-user-circle" />
                <span>My Account</span>
              </Link>
              <Link to="/upgrade">
                <i className="fas fa-rocket" />
                <span>Upgrade To Pro</span>
              </Link>
              <h6 onClick={() => signOut(setPageLoading)}>
                <i className="fas fa-sign-out" />
                <span>Sign Out</span>
              </h6>
            </div>
          </div>
        </div>
      </div>
      <div className="bottom">

      </div>
      <div className="shape shape1" />
      <div className="shape shape2" />
      <div className="shape shape3" />
      <div className="shape shape4" />
    </nav>
  )
}
