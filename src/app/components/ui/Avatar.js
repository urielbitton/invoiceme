import React from 'react'
import './styles/Avatar.css'

export default function Avatar(props) {

  const { src, dimensions="50px", alt='avatar', title, border } = props

  return (
    <div 
      className="avatar-container"
      style={{width: dimensions, height: dimensions, border}}
      title={title}
    >
      <img 
        src={src} 
        alt={alt} 
      />
    </div>
  )
}
