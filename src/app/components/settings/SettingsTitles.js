import React from 'react'

export default function SettingsTitles({label, sublabel, icon=null}) {
  return (
    <div className="settings-page-titles">
        <h4>
          { icon && <i className={icon}/> }
          {label}
        </h4>
        <h6>{sublabel}</h6>
      </div>
  )
}
