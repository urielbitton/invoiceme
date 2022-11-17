import React from 'react'
import './styles/BubbleItem.css'

export default function BubbleItem({title, icon}) {
  return (
    <div 
      className="bubble-item"
      key={title}
    >
      <i className={icon} />
      <h6>{title}</h6>
    </div>
  )
}
