import React from 'react'
import './styles/PageTitleBar.css'

export default function PageTitleBar(props) {

  const { title, rightComponent, hasBorder } = props

  return (
    <div className={`page-title-bar ${hasBorder ? 'has-border' : ''}`}>
      <div className="left">
        <h1>{title}</h1>
      </div>
      <div className="right">
        {rightComponent}
      </div>
    </div>
  )
}
