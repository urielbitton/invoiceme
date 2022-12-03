import React from 'react'
import IconContainer from "../ui/IconContainer"
import './styles/Dashbox.css'

export default function Dashbox({dashbox, sublabel='This Month:', hideSublabel=false}) {
  return (
    <div className="dashbox">
      <IconContainer
        icon={dashbox.icon}
        dimensions="30px"
        iconSize="27px"
        iconColor="#fff"
      />
      <div className="right-side">
        <h4>{dashbox.value}</h4>
        <small>{dashbox.name}</small>
        { !hideSublabel && <h6>{sublabel} {dashbox.thisMonth}</h6> }
      </div>
    </div>
  )
}
