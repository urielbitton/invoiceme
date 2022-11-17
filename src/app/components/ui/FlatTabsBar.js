import React from 'react'
import './styles/FlatTabsBar.css'

export default function FlatTabsBar(props) {

  const { children, sticky, className, noSpread, spacedOut, whiteBg } = props

  return (
    <div 
      className={`flat-tabs-bar ${sticky ? 'sticky' : ''} `+
      `${noSpread ? 'no-spread' : ''} ${spacedOut ? 'spaced-out' : ''}`+
      `${className ?? ''} ${whiteBg ? 'white-bg' : ''}`} 
    >
      {children}
    </div>
  )
}
