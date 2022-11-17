import React from 'react'
import './styles/PageTitleBar.css'

export default function PageTitleBar(props) {

  const { title, icon, subtitle, rightComponent } = props

  return (
    <div className="page-title-bar">
      <div className="left">
        <h1>
          { icon && <i className={icon}/>}
          {title}
        </h1>
        { subtitle && <h5>{subtitle}</h5> }
      </div>
      {rightComponent}
    </div>
  )
}
