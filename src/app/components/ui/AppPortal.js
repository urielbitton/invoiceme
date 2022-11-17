import React from 'react'
import './styles/AppPortal.css'
import { createPortal } from 'react-dom'

export default function AppPortal({children, showPortal, className="app-portal"}) {

  if (!showPortal) return null
  return createPortal(
    <div className={className}>
      {children}
    </div>, 
    document.body
  )
}

export function AppTooltip({top, left, message, isOpen, onClose}) {
  
  if (!isOpen) return null

  return (
    <AppPortal
      showPortal={isOpen}
    >
      <div 
        className="app-tooltip"
        style={{top, left}}
      >
        <span>{message}</span>
        <button onClick={onClose}>Close</button>
      </div>
    </AppPortal>
  ) 
}
