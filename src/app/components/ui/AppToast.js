import { StoreContext } from "app/store/store"
import React, { useEffect, useState } from 'react'
import { useContext } from "react"
import AppButton from "./AppButton"
import IconContainer from "./IconContainer"
import './styles/AppToast.css'

export default function AppToast(props) {

  const { setToasts, toasts } = useContext(StoreContext)
  const { title, message, icon, url, onClick, btnLabel = 'View',
    toastID } = props.toast
  const [markClosing, setMarkClosing] = useState([])

  const closeToast = (id) => {
    setMarkClosing(prev => [...prev, id])
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.toastID !== id))
    }, 400)
  }

  useEffect(() => {
    if (toasts.length) {
      toasts.forEach(toast => {
        if (!toast.keep) {
          setTimeout(() => {
            closeToast(toast.toastID)
          }, 5000)
        }
      })
    }
  }, [toasts])

  return (
    <div className={`app-toast entering ${markClosing.includes(toastID) && 'closing'}`}>
      <div className="side left">
        <i className={icon} />
        <div className="texts">
          {title && <h5>{title}</h5>}
          <h6>{message}</h6>
        </div>
      </div>
      <div className="side right">
        {
          (onClick || url) &&
          <AppButton
            label={btnLabel}
            buttonType="tabWhiteBtn"
            onClick={(e) => onClick && onClick(e)}
            url={url && url}
            className="toast-btn"
          />
        }
        <IconContainer
          icon="fal fa-times"
          dimensions="28px"
          iconSize="20px"
          bgColor="rgba(255,255,255,0.1)"
          iconColor="#fff"
          round={false}
          onClick={() => closeToast(toastID)}
        />
      </div>
    </div>
  )
}
