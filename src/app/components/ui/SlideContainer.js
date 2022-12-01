import React from 'react'
import './styles/SlideContainer.css'

export default function SlideContainer({children}) {
  return (
    <div className="slide-container">
      {children}
    </div>
  )
}
