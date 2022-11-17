import React from 'react'
import './styles/IconContainer.css'

export default function IconContainer(props) {

  const { bgColor, icon, iconColor, iconSize="16px",
    width="35px", height="35px", round=true, noHover,
    inverted, onClick } = props

  return (
    <div 
      className={`icon-container ${round ? "round" : ""} ${noHover ? "no-hover" : ""} ${inverted ? "inverted" : ""}`}
      onClick={(e) => onClick && onClick(e)}
      style={{ backgroundColor: bgColor, width, height }}
    >
      <i 
        className={icon} 
        style={{ color: iconColor, fontSize: iconSize }}
      />
    </div>
  )
}
