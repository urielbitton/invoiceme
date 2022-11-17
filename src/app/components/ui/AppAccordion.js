import React from 'react'
import './styles/AppAccordion.css'

export default function AppAccordion(props) {

  const {maxAccordionHeight=600, children, title, open, setOpen, className, noPadding, active, deleteBtn,
    editBtn, headerMetaTitle} = props

  return (
    <div className={`app-accordion ${active ? "active": ""} ${className} ${open && "open"}`}>
      <header onClick={() => setOpen(prev => !prev)}>
        <h5 title={headerMetaTitle}>{title}</h5>
        <div className="action-btns">
          {deleteBtn}
          {editBtn}
          <i className={`far fa-angle-up ${open && "down"}`}></i>
        </div>
      </header>
      <div className="content" style={{maxHeight: open ? maxAccordionHeight : "0", padding: noPadding ? "0" : open ? "20px" : "0 20px"}}>
        {children}
      </div>
    </div>
  )
}
