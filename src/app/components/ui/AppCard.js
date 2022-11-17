import React from 'react'
import './styles/AppCard.css'

export default function AppCard(props) {

  const { children, padding='15px', className, onClick, noBorder,
    onDoubleClick, classic } = props

  return (
    <div 
      className={`appCard ${classic ? 'classic' : ''} ${className ?? ''} ${noBorder ? 'noBorder' : ''}`}
      style={{ padding }}
      onClick={(e) => onClick && onClick(e)}
      onDoubleClick={(e) => onDoubleClick && onDoubleClick(e)}
    >
      {children}
    </div>
  )
}
