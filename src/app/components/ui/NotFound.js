import React from 'react'
import './styles/NotFound.css'
import AppButton from "./AppButton"
import PageLoader from "./PageLoader"

export default function NotFound(props) {

  const { object, icon, title, subtitle, btnLabel, btnURL, btnIcon,
    img, imgDimensions=[300, 300], fitContainer, imgFitContain } = props

  return (
    object !== null ?
    <div className={`page-not-found ${fitContainer ? 'fit-container' : ''}`}>
      { icon && <i className={`${icon} page-icon`}/>}
      { title && <h1>{title}</h1> }
      { 
        img && 
        <img 
          src={img} 
          className={imgFitContain ? 'img-fit-contain' : ''}
          alt="not found" 
          width={imgDimensions[0]}
          height={imgDimensions[1]}
        /> 
      }
      { subtitle && <h5>{subtitle}</h5> }
      {
        btnLabel &&
        <AppButton
          label={btnLabel}
          leftIcon={btnIcon}
          url={btnURL}
        />
      }
    </div> : <PageLoader loading={!object}/>
  )
}
