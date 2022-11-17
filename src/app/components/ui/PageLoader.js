import React from 'react'
import AppPortal from "./AppPortal"

export default function PageLoader({ loading }) {

  return (
    <AppPortal
      showPortal={loading}
    >
      <div
        className='page-loader'
        style={{
          position: 'fixed',
          top: '0', left: '0',
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(2px)',
          width: '100%',
          height: '100vh',
          zIndex: '99000',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          visibility: loading ? "visible" : "hidden",
          opacity: loading ? "1" : "0"
        }}>
        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="100px" height="100px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
          <path d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50" fill="var(--primary)" stroke="none">
            <animateTransform attributeName="transform" type="rotate" dur="1s" repeatCount="indefinite" keyTimes="0;1" values="0 50 51;360 50 51"></animateTransform>
          </path>
        </svg>
      </div>
    </AppPortal>
  )
}
