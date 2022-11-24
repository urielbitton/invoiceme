import React from 'react'
import './styles/PageTitleBar.css'

export default function PageTitleBar(props) {

  const { title, subtitle, rightComponent, hasBorder } = props

  return (
    <div className={`page-title-bar ${hasBorder ? 'has-border' : ''}`}>
      <div className="left">
        <h1>{title}</h1>
        <h5>{subtitle}</h5>
      </div>
      <div className="right">
        {rightComponent}
      </div>
    </div>
  )
}
