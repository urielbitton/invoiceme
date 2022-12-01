import React, { useEffect, useState } from 'react'

export default function SlideElement({ slidePosition, index, children, ...props}) {

  const { className } = props
  const [hideElement, setHideElement] = useState(false)

  useEffect(() => {
    if(slidePosition !== index) {
      const timer = setTimeout(() => {
        setHideElement(true)
      }, 300)
      return () => clearTimeout(timer)
    }
    else {
      const timer = setTimeout(() => {
        setHideElement(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  },[slidePosition])

  return (
    <div className={`slide-element ${className ?? ""} `+
      `${slidePosition === index ? "active" : slidePosition > index ? "prev" : "next"} `+
      `${hideElement ? "hide" : ""}
      `}
    >
      {children}
    </div>
  )
}
