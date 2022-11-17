import React, { useEffect } from 'react'
import './styles/DropdownButton.css'
import AppButton from "./AppButton"

export default function DropdownButton(props) {

  const { children, leftIcon, rightIcon, buttonType, label,
    showMenu, setShowMenu, preventCloseOnClick } = props

  useEffect(() => {
    if(showMenu) {
      window.onclick = () => setShowMenu(false)
    }
  },[showMenu])

  return (
    <div 
      className="dropdown-button"
      onClick={(e) => {
        e.stopPropagation()
        setShowMenu(prev => preventCloseOnClick ? true : !prev)
      }}
    >
      <AppButton
        label={label}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        buttonType={buttonType}
      />
      <div className={`dropdown-menu ${showMenu ? 'show' : ''}`}>
        {children}
      </div>
    </div>
  )
}
