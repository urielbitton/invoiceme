import React from 'react'
import logo from 'app/assets/images/logo2.png'
import AppButton from "./AppButton"

export default function AuthHandlerPage(props) {

  const { contentImg, title, description, btnLabel, btnOnClick, loading=false } = props

  return (
    <div className="verify-email-page">
      <div className="header">
        <h5>
          <img src={logo} alt="logo" />
          <span>Invoice Me</span>
        </h5>
      </div>
      <div className="site-grid">
        <div className="content">
          <img src={contentImg} alt="verify-email" />
          <h3>{title}</h3>
          <p>{description}</p>
          <AppButton
            label={btnLabel}
            onClick={btnOnClick}
            rightIcon={loading ? 'far fa-spinner fa-spin' : null}
          />
        </div>
      </div>
    </div>
  )
}
