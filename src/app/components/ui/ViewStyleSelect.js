import React from 'react'
import './styles/ViewStyleSelect.css'

export default function ViewStyleSelect({viewStyle, setViewStyle, extraStyle}) {
  return (
    viewStyle ?
    <div className="view-style-select">
      <h6>View</h6>
      <div 
        className={`icon-container ${viewStyle === "large" ? "active" : ""}`}
        onClick={() => setViewStyle("large")}
      >
        <i className="fas fa-th-large"></i>
      </div>
      <div 
        className={`icon-container ${viewStyle === "small" ? "active" : ""}`}
        onClick={() => setViewStyle("small")}
      >
        <i className="fas fa-th"></i>
      </div>
      {extraStyle}
    </div> :
    null
  )
}
