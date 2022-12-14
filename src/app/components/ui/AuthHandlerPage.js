import React, { useContext } from 'react'
import logo from 'app/assets/images/logo.png'
import AppButton from "./AppButton"
import { useNavigate } from "react-router-dom"
import { signOut } from "app/services/CrudDB"
import { StoreContext } from "app/store/store"
import './styles/AuthHandlerPage.css'

export default function AuthHandlerPage(props) {

  const { setPageLoading } = useContext(StoreContext)
  const { contentImg, title, description, btnLabel, btnOnClick, 
    loading=false, customComponent } = props
  const navigate = useNavigate()

  return (
    <div className="auth-handler-page">
      <div className="header">
        <h5 onClick={() => navigate('/')}>
          <img src={logo} alt="logo" />
          <span>Invoice Me</span>
        </h5>
        <small onClick={() => signOut(setPageLoading)}>Log out</small>
      </div>
      <div className="site-grid">
        <div className="content">
          <img src={contentImg} alt="content" />
          <h3>{title}</h3>
          <p>{description}</p>
          {
            btnLabel &&
            <AppButton
              label={btnLabel}
              onClick={btnOnClick}
              rightIcon={loading ? 'far fa-spinner fa-spin' : null}
            />
          }
          { customComponent }
        </div>
      </div>
    </div>
  )
}
