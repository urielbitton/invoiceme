import React from 'react'
import './styles/AppLoadingPage.css'
import logo from 'app/assets/images/white-logo.png'
import DotsLoader from "./DotsLoader"

export default function AppLoadingPage() {
  return (
    <div className="app-loading-page">
      <div className="top"/>
      <div className="middle">
        <div className="logo-container">
          <img src={logo} alt="logo" />
        </div>
        <DotsLoader loading />
      </div>
      <div className="bottom">
        <h5>Invoice Me</h5>
        <small>Send & receive invoices quickly, get paid faster</small>
      </div>
    </div>
  )
}
