import React from 'react'
import './styles/OptionsDropdown.css'

export default function OptionsDropdown(props) {

  const { children, show, onClick, className, top, left, width="auto",
    large } = props

  return (
    <div 
      className={`options-dropdown ${className ?? ''} ${show ? 'show' : ''} ${large ? 'large' : ''}`}
      onClick={(e) => onClick && onClick(e)}
      style={{ top, left, width }}
    >
      {children}
    </div>
  )
}
