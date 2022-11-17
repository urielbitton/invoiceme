import React from 'react'
import './styles/AppButton.css'
import { Link } from "react-router-dom"

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
        buttonType === 'secondaryGrayBtn' ? 'secondaryGrayBtn' :
        buttonType === 'gradientBtn' ? 'gradientBtn' : 
        buttonType === 'redBtn' ? 'redBtn' :
        buttonType === 'outlineBtn' ? 'outlineBtn' :
        buttonType === 'invertedBtn' ? 'invertedBtn' :
        buttonType === 'invertedBtn secondary' ? 'invertedBtn secondary' :
        buttonType === 'invertedBtn black' ? 'invertedBtn black' :
        buttonType === 'black' ? 'black' :
        buttonType === 'ternaryBtn' ? 'ternaryBtn' :
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
