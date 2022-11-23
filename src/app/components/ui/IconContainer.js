import React from 'react'
import './styles/IconContainer.css'

export default function IconContainer(props) {

  const { bgColor, icon, iconColor, iconSize="16px",
    dimensions="35px", round=true, noHover,
    inverted, onClick, tooltip, badgeValue, badgeBgColor,
    badgeTextColor, style, className='' } = props

  return (
    <div
      className={`icon-container ${className} ${round ? "round" : ""} ${noHover ? "no-hover" : ""} ${inverted ? "inverted" : ""}`}
      onClick={(e) => onClick && onClick(e)}
      title={tooltip}
      style={{ backgroundColor: bgColor, width: dimensions, height: dimensions, ...style }}
    >
      <i
        className={icon}
        style={{ color: iconColor, fontSize: iconSize }}
      />
      {
        badgeValue > 0 &&
        <div
          className="badge-container"
          style={{ background: badgeBgColor }}
        >
          <small style={{ color: badgeTextColor }}>{badgeValue}</small>
        </div>
      }
    </div>
  )
}
