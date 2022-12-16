import React from 'react'
import AppBadge from "../ui/AppBadge"

export default function SettingsTitles({ label, sublabel, icon=null, button=null, badge='', isSticky=false }) {
  return (
    <div className={`settings-page-titles ${isSticky ? 'sticky' : ''}`}>
      <div className="texts">
        <h4>
          {icon && <i className={icon} />}
          {label}
          {badge?.length > 0 && <AppBadge label={badge} /> }
        </h4>
        <h6>{sublabel}</h6>
      </div>
      <div className="btn-side">
        {button}
      </div>
    </div>
  )
}
