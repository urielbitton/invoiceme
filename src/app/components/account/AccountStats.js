import { extendedStatsData } from "app/data/statsData"
import { StoreContext } from "app/store/store"
import { monthNames } from "app/utils/dateUtils"
import React, { useContext } from 'react'
import Dashbox from "../stats/Dashbox"
import { AppSelect } from "../ui/AppInputs"
import './styles/AccountStats.css'

export default function AccountStats() {

  const { myUser } = useContext(StoreContext)

  const extendedStatsList = extendedStatsData(myUser)?.map((stat, index) => {
    return <Dashbox
      key={index}
      dashbox={stat}
      hideSublabel
    />
  })

  return (
    <div className="account-stats">
      <h4>Extended Stats</h4>
      <div className="stats-grid">
        {extendedStatsList}
      </div>
      <div className="toolbar">
        <AppSelect
          label="Select a year"
          options={['2020', '2021']}
        />
        <AppSelect
          label="Select a month"
          options={monthNames}
        />
      </div>
    </div>
  )
}
