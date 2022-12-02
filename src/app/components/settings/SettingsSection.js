import React from 'react'
import { useSearchParams } from "react-router-dom"
import AppBadge from "../ui/AppBadge"

export default function SettingsSection(props) {

  const { label, sublabel='', badge='', flexStart=false, 
    children, className='' } = props
  const [searchParams, setSearchParams] = useSearchParams()
  const goTo = searchParams.get('goTo')
  const isActive = goTo === className

  return (
    <div className={`settings-section ${className} ${isActive ? 'active' : ''}`}>
      <div className="left-side">
        { badge?.length > 0 && <AppBadge label={badge}/> }
        <h5>{label}</h5>
        <h6>{sublabel}</h6>
      </div>
      <div className={`right-side ${flexStart ? 'flex-start' : ''}`}>
        {children}
      </div>
    </div>
  )
}
