import React from 'react'
import { Link } from "react-router-dom"
import './styles/AppButton.css'

export default function AppButton(props) {

  const { url, leftIcon, rightIcon, onClick, className,
    buttonType, disabled, style, label, round, title, iconBtn,
    useATag, externalLink, id } = props

  const button = <button
    id={id}
    className={`appButton 
      ${className ?? ""} 
      ${
        buttonType === 'grayBtn' ? 'grayBtn' : 
        buttonType === 'secondaryBtn' ? 'secondaryBtn' : 
        buttonType === 'gradientBtn' ? 'gradientBtn' : 
        buttonType === 'invertedRedBtn' ? 'invertedRedBtn' :
        buttonType === 'outlineBtn' ? 'outlineBtn' :
        buttonType === 'outlineBlueBtn' ? 'outlineBlueBtn' :
        buttonType === 'invertedBtn' ? 'invertedBtn' :
        buttonType === 'white' ? 'white' :
        buttonType === 'tabBtn' ? 'tabBtn' :
        'primaryBtn'
      }
      ${disabled ? 'disabled' : ''}
      ${round ? 'round' : ''}
      ${iconBtn ? 'iconBtn' : ''}
    `}
    onClick={(e) => onClick && onClick(e)}
    style={style}
    title={title}
  >
    { leftIcon && <i className={`${leftIcon} leftIcon  ${!label?.length && 'no-text'}`}></i> }
    {label}
    { rightIcon && <i className={`${rightIcon} rightIcon ${!label?.length && 'no-text'}`}></i> }
  </button>

  return (
    url ? 
    !useATag ?
    <Link to={!disabled ? url : '#'}>{button}</Link> :
    <a 
      href={url} 
      target={externalLink ? '_blank' : '_self'} 
      rel="noopener noreferrer"
    >
      {button}
    </a> :
    button
  )
}
