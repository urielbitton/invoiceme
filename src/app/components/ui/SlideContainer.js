import React from 'react'
import './styles/SlideContainer.css'

export default function SlideContainer({children, fade=''}) {
  return (
    <div className={`slide-container ${fade}`}>
      {children}
    </div>
  )
}
