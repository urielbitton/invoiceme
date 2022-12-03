import React from 'react'
import AppButton from "../ui/AppButton"
import './styles/StatusToggler.css'

export default function StatusToggler(props) {

  const { mode, setMode, hideYear, hideMonth, hideWeek } = props

  return (
    <div className="status-toggler-container">
      {
        !hideYear &&
        <AppButton
          buttonType="tabBtn"
          label="Yearly"
          onClick={() => setMode('year')}
          className={mode === 'year' ? 'active' : ''}
        />
      }
      {
        !hideMonth &&
        <AppButton
          buttonType="tabBtn"
          label="Monthly"
          onClick={() => setMode('month')}
          className={mode === 'month' ? 'active' : ''}
        />
      }
      {
        !hideWeek &&
        <AppButton
          buttonType="tabBtn"
          label="Weekly"
          onClick={() => setMode('week')}
          className={mode === 'week' ? 'active' : ''}
        />
      }
    </div>
  )
}
