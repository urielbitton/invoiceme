import React from 'react'
import './styles/AppTabsBar.css'

export default function AppTabsBar(props) {

  const { children, sticky, className, noSpread, spacedOut } = props

  return (
    <div 
      className={`app-tabs-bar ${sticky ? 'sticky' : ''} `+
      `${noSpread ? 'no-spread' : ''} ${spacedOut ? 'spaced-out' : ''}`+
      `${className ?? ''}`} 
      style={{gap: spacedOut}}
    >
      {children}
    </div>
  )
}
