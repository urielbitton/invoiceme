import React from 'react'
import './styles/AppModal.css'
import AppPortal from "./AppPortal"

export default function AppModal(props) {

  const { label, children, actions, showModal, setShowModal,
    className, sectionClassName, portalClassName, noHeader } = props

  return (
    <AppPortal
      showPortal={showModal}
      className={portalClassName}
    >
      <div
        className={`app-modal-container ${showModal ? "show" : ""}`}
        onMouseDown={() => setShowModal(false)}
      >
        <div
          className={`app-modal ${className ?? ''}`}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {
            !noHeader &&
            <header>
              <h4>{label}</h4>
              <div
                className="icon-container"
                onClick={() => setShowModal(false)}
              >
                <i className="fal fa-times"></i>
              </div>
            </header>
          }
          <section className={sectionClassName}>
            {children}
          </section>
          <footer style={{ display: actions ? 'flex' : "none" }}>
            {actions}
          </footer>
        </div>
      </div>
    </AppPortal>
  )
}

export function AppModalNoPortal(props) {

  const { label, children, actions, showModal, setShowModal,
    className, sectionClassName, portalClassName, noHeader } = props

  return (
    <div className={portalClassName}>
      <div
        className={`app-modal-container ${showModal ? "show" : ""}`}
        onMouseDown={() => setShowModal(false)}
      >
        <div
          className={`app-modal ${className ?? ''}`}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {
            !noHeader &&
            <header>
              <h4>{label}</h4>
              <div
                className="icon-container"
                onClick={() => setShowModal(false)}
              >
                <i className="fal fa-times"></i>
              </div>
            </header>
          }
          <section className={sectionClassName}>
            {children}
          </section>
          <footer style={{ display: actions ? 'flex' : "none" }}>
            {actions}
          </footer>
        </div>
      </div>
    </div>
  )
}