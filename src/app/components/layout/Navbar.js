import React, { useState } from 'react'
import { AppInput } from "../ui/AppInputs"
import Avatar from "../ui/Avatar"
import DropdownButton from "../ui/DropdownButton"
import IconContainer from "../ui/IconContainer"
import './styles/Navbar.css'

export default function Navbar() {

  const [showButtonMenu, setShowButtonMenu] = useState(false)

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
            <Avatar 
              img="https://i.imgur.com/0xERjh8.jpg" 
              dimensions="30px"
              alt="profile" 
              border="1.5px solid #fff"
            />
            <i className="fal fa-angle-down"/>
          </div>
        </div>
      </div>
      <div className="bottombar">

      </div>
    </nav>
  )
}
