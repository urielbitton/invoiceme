import React from 'react'
import AppButton from "./AppButton"
import PageLoader from "./PageLoader"
import './styles/ProContent.css'

export default function ProContent(myUser) {
  return (
    myUser !== null ? 
    <div className="pro-content">
      <div className="container">
        <i className="fas fa-rocket-launch rocket" />
        <h4>This content is for business members only.</h4>
        <h6>Upgrade to a business membership to access this content.</h6>
        <AppButton
          label="Upgrade Now"
          buttonType="outlineGrayBtn"
          url="/upgrade"
        />
        <div className="shapes-container">
          <div className="shape shape1" />
          <div className="shape shape2" />
          <div className="shape shape3" />
          <div className="shape shape4" />
        </div>
        <i className="fas fa-lock lock-icon"/>
      </div>
    </div> :
    <PageLoader loading />
  )
}
