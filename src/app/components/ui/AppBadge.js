import React from 'react'
import './styles/AppBadge.css'

export default function AppBadge({ label, noIcon=false }) {
  return (
    <div className="app-badge">
      { !noIcon && <i className="fas fa-lock" /> }
      <h6>
        {label}
      </h6>
    </div>
  )
}
