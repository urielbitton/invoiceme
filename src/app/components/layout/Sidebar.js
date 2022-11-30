import React, { useContext, useEffect } from 'react'
import './styles/Sidebar.css'
import logo from 'app/assets/images/logo2.png'
import { menuLinks } from "app/data/menuLinks"
import { NavLink, useLocation } from "react-router-dom"
import AppButton from "../ui/AppButton"
import { StoreContext } from "app/store/store"
import { AppInput } from "../ui/AppInputs"

export default function Sidebar() {

  const { showMobileSidebar, setShowMobileSidebar } = useContext(StoreContext)
  const location = useLocation()

  const navLinksList = menuLinks.map((link, index) => {
    return <NavLink
      key={index}
      to={link.url}
    >
      <i className={link.icon}></i>
      <span>{link.name}</span>
    </NavLink>
  })

  useEffect(() => {
    if(showMobileSidebar) {
      setShowMobileSidebar(false)
    }
  },[location])

  return (
    <div className={`sidebar ${showMobileSidebar ? 'show-mobile' : ''}`}>
      <div className="top">
        <div className="logo">
          <img
            src={logo}
            alt="logo"
          />
          <h4>Invoice Me</h4>
        </div>
        <div className="menu">
          {navLinksList}
        </div>
        <AppInput
          placeholder="Search"
          iconright={<i className="fal fa-search" />}
        />
      </div>
      <div className="bottom">
        <AppButton
          label="Upgrade to Business"
          leftIcon="far fa-rocket-launch"
          url="/upgrade"
        />
      </div>
      <i
        className="fal fa-times close-sidebar"
        onClick={() => setShowMobileSidebar(false)}
      />
    </div>
  )
}
