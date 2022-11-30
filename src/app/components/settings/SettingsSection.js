import React from 'react'
import AppBadge from "../ui/AppBadge"

export default function SettingsSection({label, sublabel='', badge='', children}) {
  return (
    <div className="settings-section">
      <div className="left-side">
        { badge?.length > 0 && <AppBadge label={badge}/> }
        <h5>{label}</h5>
        <h6>{sublabel}</h6>
      </div>
      <div className="right-side">
        {children}
      </div>
    </div>
  )
}
