import React from 'react'

export default function SlideElement({ slidePosition, index, children, ...props}) {

  const { className } = props

  return (
    <div className={`slide-element ${className ?? ""} ${slidePosition === index ? "active" : slidePosition > index ? "prev" : "next"}`}>
      {
       (slidePosition === index || slidePosition === index-1 || slidePosition === index+1) && 
       children
      }
    </div>
  )
}
