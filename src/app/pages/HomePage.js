import { AppAreaChart } from "app/components/ui/AppChart"
import HelmetTitle from "app/components/ui/HelmetTitle"
import IconContainer from "app/components/ui/IconContainer"
import PageTitleBar from "app/components/ui/PageTitleBar"
import { useMonthlyRevenue, useYearlyRevenueByMonth } from "app/hooks/statsHooks"
import { StoreContext } from "app/store/store"
import { dateToMonthName, shortAndLongMonthNames, 
  splitDocsIntoMonths } from "app/utils/dateUtils"
import { displayGreeting, formatCurrency } from "app/utils/generalUtils"
import React, { useContext, useEffect } from 'react'
import './styles/Homepage.css'

export default function HomePage() {

  const { setCompactNav, myUser } = useContext(StoreContext)
  const thisMonthRevenue = useMonthlyRevenue(new Date())
  const yearlyRevenue = useYearlyRevenueByMonth(new Date())
  const monthlyDocs = splitDocsIntoMonths(yearlyRevenue, 'dateCreated')

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
      value: myUser?.invoicesNum, 
      thisMonth: monthlyDocs[dateToMonthName(new Date())]?.length
    },
    { 
      name: 'Estimates', 
      icon: 'fal fa-file-invoice', 
      value: myUser?.estimatesNum, 
      thisMonth: 0 
    },
    { 
      name: 'Contacts', 
      icon: 'fal fa-users', 
      value: myUser?.contactsNum, 
      thisMonth: 0
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
            title="Revenue By Months"
            data={shortAndLongMonthNames.map((month,i) => 
              ({...month, revenue: monthlyDocs[month.longName]?.reduce((acc, doc) => acc + (doc.isPaid ? doc?.total : 0) || 0, 0)})
            )}
            areas={[
              { dataKey: 'revenue', stroke: 'var(--primary)', fill: 'var(--lightPrimary)' }
            ]}
            xAxisDataKey="shortName"
            xAxisStyles={{fontSize: '13px'}}
            yAxisStyles={{fontSize: '13px'}}
            tooltipLabelFormat={(name, value) => value[0]?.payload?.longName}
            tooltipFormat={(name) => `$${formatCurrency(name)}`}
          />
        </div>
      </div>
    </div>
  )
}
