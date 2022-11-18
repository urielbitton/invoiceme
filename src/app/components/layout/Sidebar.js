import React from 'react'
import './styles/Sidebar.css'
import logo from 'app/assets/images/logo.png'
import { menuLinks } from "app/data/menuLinks"
import { NavLink } from "react-router-dom"
import AppButton from "../ui/AppButton"

export default function Sidebar() {

  const navLinksList = menuLinks.map((link, index) => {
    return <NavLink
      key={index}
      to={link.url}
    >
      <i className={link.icon}></i>
      <span>{link.name}</span>
    </NavLink>
  })

  return (
    <div className="sidebar">
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
      </div>
      <div className="bottom">
        <AppButton
          label="Upgrade to Business"
          rightIcon="far fa-rocket"
        />
      </div>
    </div>
  )
}
