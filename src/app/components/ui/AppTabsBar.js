import React from 'react'
import './styles/AppTabsBar.css'

export default function AppTabsBar(props) {

  const { children, sticky, className, noSpread, spacedOut, noBorder } = props

  return (
    <div 
      className={`app-tabs-bar ${sticky ? 'sticky' : ''} `+
      `${noSpread ? 'no-spread' : ''} ${spacedOut ? 'spaced-out' : ''} `+
      `${noBorder ? 'no-border' : ''} ${className ?? ''}`} 
      style={{gap: spacedOut}}
    >
      {children}
    </div>
  )
}
