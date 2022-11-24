import { AppAreaChart } from "app/components/ui/AppChart"
import HelmetTitle from "app/components/ui/HelmetTitle"
import IconContainer from "app/components/ui/IconContainer"
import PageTitleBar from "app/components/ui/PageTitleBar"
import { monthlyRevenue } from "app/data/statsData"
import { useMonthlyRevenue } from "app/hooks/statsHooks"
import { StoreContext } from "app/store/store"
import { monthNameToDate } from "app/utils/dateUtils"
import { displayGreeting, formatCurrency } from "app/utils/generalUtils"
import React, { useContext, useEffect } from 'react'
import './styles/Homepage.css'

export default function HomePage() {

  const { setCompactNav, myUser } = useContext(StoreContext)
  const thisMonthRevenue = useMonthlyRevenue(new Date())
  const janRevenue = useMonthlyRevenue(monthNameToDate('January'))
  const febRevenue = useMonthlyRevenue(monthNameToDate('February'))
  const marRevenue = useMonthlyRevenue(monthNameToDate('March'))
  const aprRevenue = useMonthlyRevenue(monthNameToDate('April'))
  const mayRevenue = useMonthlyRevenue(monthNameToDate('May'))
  const junRevenue = useMonthlyRevenue(monthNameToDate('June'))
  const julRevenue = useMonthlyRevenue(monthNameToDate('July'))
  const augRevenue = useMonthlyRevenue(monthNameToDate('August'))
  const sepRevenue = useMonthlyRevenue(monthNameToDate('September'))
  const octRevenue = useMonthlyRevenue(monthNameToDate('October'))
  const novRevenue = useMonthlyRevenue(monthNameToDate('November'))
  const decRevenue = useMonthlyRevenue(monthNameToDate('December'))

  const revenuesArr = [
    janRevenue,
    febRevenue,
    marRevenue,
    aprRevenue,
    mayRevenue,
    junRevenue,
    julRevenue,
    augRevenue,
    sepRevenue,
    octRevenue,
    novRevenue,
    decRevenue
  ]

  const dashboxArray = [
    { 
      name: 'Revenue', 
      icon: 'fal fa-dollar-sign', 
      value: `$${formatCurrency(myUser?.totalRevenue)}`, 
      thisMonth: `$${formatCurrency(thisMonthRevenue)}` 
    },
    { 
      name: 'Invoices', 
      icon: 'fal fa-file-invoice-dollar', 
      value: 100, 
      thisMonth: 30 
    },
    { 
      name: 'Estimates', 
      icon: 'fal fa-file-invoice', 
      value: 60, 
      thisMonth: 12 
    },
    { 
      name: 'Contacts', 
      icon: 'fal fa-users', 
      value: 250, 
      thisMonth: 24 
    }
  ]

  const dashboxList = dashboxArray.map((dashbox, index) => {
    return <div 
      className="dashbox" 
      key={index} 
    >
      <IconContainer
        icon={dashbox.icon}
        dimensions="30px"
        iconSize="27px"
        iconColor="#fff"
      />
      <div className="right-side">
        <h4>{dashbox.value}</h4>
        <small>{dashbox.name}</small>
        <h6>This Month: {dashbox.thisMonth}</h6>
      </div>
    </div>
  })

  useEffect(() => {
    setCompactNav(true)
    return () => setCompactNav(false)
  }, [])

  return (
    <div className="homepage">
      <HelmetTitle />
      <PageTitleBar
        subtitle={`${displayGreeting()}, ${myUser?.firstName}`}
      />
      <div className="dashboard-grid">
        <div className="dashboard-section full-width">
          {dashboxList}
        </div>
        <div className="dashboard-section full-width">
          <AppAreaChart
            title="Monthly Revenue"
            data={monthlyRevenue.map((month,i) => ({...month, revenue: revenuesArr[i]}))}
            areas={[
              { dataKey: 'revenue', stroke: 'var(--primary)', fill: 'var(--lightPrimary)' }
            ]}
            xAxisDataKey="month"
            xAxisStyles={{fontSize: '13px'}}
            yAxisStyles={{fontSize: '13px'}}
            tooltipLabelFormat={(name, value) => value[0]?.payload?.monthName}
            tooltipFormat={(name) => `$${formatCurrency(name)}`}
          />
        </div>
      </div>
    </div>
  )
}
