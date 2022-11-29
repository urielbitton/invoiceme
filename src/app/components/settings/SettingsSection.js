import React from 'react'

export default function SettingsSection({label, sublabel='', children}) {
  return (
    <div className="settings-section">
      <div className="left-side">
        <h5>{label}</h5>
        <h6>{sublabel}</h6>
      </div>
      <div className="right-side">
        {children}
      </div>
    </div>
  )
}
