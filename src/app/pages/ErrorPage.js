import React from 'react'
import './styles/ErrorPage.css'
import errorImg from '../assets/images/error-404.png'
import AppButton from "app/components/ui/AppButton"
import HelmetTitle from "app/components/ui/HelmetTitle"

export default function ErrorPage() {

  return (
    <div className="error-page">
      <HelmetTitle title="Error 404"/>
      <img 
        src={errorImg} 
        alt="error 404"
      />
      <h1>Page Not Found</h1>
      <h6>Oops, error 404. The page you're looking for was not found.</h6>
      <AppButton
        label="Back Home"
        leftIcon="fal fa-home"
        url="/"
      />
    </div>
  )
}
