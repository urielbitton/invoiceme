import React from 'react'
import './styles/Avatar.css'
import placeholderImg from 'app/assets/imgs/placeholder.jpg'

export default function Avatar(props) {

  const { img, dimensions=50, alt='avatar', title } = props

  return (
    <div 
      className="avatar-container"
      style={{width: dimensions, height: dimensions}}
      title={title}
    >
      <img 
        src={img ?? placeholderImg} 
        alt={alt} 
      />
    </div>
  )
}
