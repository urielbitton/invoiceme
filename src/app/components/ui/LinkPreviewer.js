import React from 'react'
import './styles/LinkPreviewer.css'
import { truncateText } from "app/utils/generalUtils"

export default function LinkPreviewer(props) {

  const { link, title, description, imgURL, withBorder } = props

  return (
    <a 
      className={`link-previewer ${withBorder ? "with-border" : ""}`}
      href={link}
        target="_blank"
        rel="noopener noreferrer"
    >
      <img 
        src={imgURL} 
        alt="preview"
      />
      <div className="text-content">
        <h5>{title}</h5>
        <span>{truncateText(description, 90)}</span>
      </div>
    </a>
  )
}
