import React from 'react'

export default function SettingsTitles({ label, sublabel, icon=null, button=null }) {
  return (
    <div className="settings-page-titles">
      <div className="texts">
        <h4>
          {icon && <i className={icon} />}
          {label}
        </h4>
        <h6>{sublabel}</h6>
      </div>
      <div className="btn-side">
        {button}
      </div>
    </div>
  )
}
