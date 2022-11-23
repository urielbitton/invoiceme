import React, { useEffect } from 'react'
import './styles/DropdownButton.css'
import AppButton from "./AppButton"
import { Link } from "react-router-dom"

export default function DropdownButton(props) {

  const { items, leftIcon, rightIcon, buttonType, label,
    showMenu, setShowMenu, className='', dropdownPosition="place-right-bottom" } = props

  const itemsList = items.map((item, index) => {
    return (
      !item.url ?
      <div 
        key={index} 
        onClick={() => item.onClick()}
        className="dropdown-item"
      >
        <i className={item.icon}></i>
        <span>{item.label}</span>
      </div> :
      <Link
        key={index}
        to={item.url}
        className="dropdown-item"
      >
        <i className={item.icon}></i>
        <span>{item.label}</span>
      </Link>
    )
  })

  useEffect(() => {
    if(showMenu !== null) {
      window.onclick = () => setShowMenu(null)
    }
    return () => window.onclick = null
  },[showMenu])

  return (
    <div 
      className="dropdown-button"
      onClick={(e) => {
        e.stopPropagation()
        setShowMenu(prev => prev === 'show' ? null : 'show')
      }}
    >
      <AppButton
        label={label}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        buttonType={buttonType}
        className={className}
      />
      <div className={`dropdown-menu ${showMenu ? 'show' : ''} ${dropdownPosition}`}>
        {itemsList}
      </div>
    </div>
  )
}
