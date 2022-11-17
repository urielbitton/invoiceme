import React from 'react'
import './styles/ProgressBar.css'

export default function ProgressBar(props) {

  const { progress, title, withpercent } = props

  return (
    <div className="progress-bar-container">
      <h5>{title}</h5>
      <div className="progress-row">
        <div className="progress-bar-wrapper">
          <div 
            className="progress-bar" 
            style={{width: progress + '%'}}
          />
        </div>
        { withpercent && <span>{progress}%</span> }
      </div>
    </div>
  )
}
