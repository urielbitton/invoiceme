import React from 'react'
import './styles/AppBadge.css'

export default function AppBadge({ label }) {
  return (
    <div className="app-badge">
      <h6>{label}</h6>
    </div>
  )
}
