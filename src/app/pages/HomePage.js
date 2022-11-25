import AppButton from "app/components/ui/AppButton"
import { AppAreaChart, AppBarChart, AppPieChart, 
  AppRadarChart } from "app/components/ui/AppChart"
import HelmetTitle from "app/components/ui/HelmetTitle"
import IconContainer from "app/components/ui/IconContainer"
import PageTitleBar from "app/components/ui/PageTitleBar"
import { useCurrentYearInvoices, useCurrentMonthInvoices } from "app/hooks/statsHooks"
import { StoreContext } from "app/store/store"
import { dateToMonthName, getNameDayOfTheWeekFromDate, shortAndLongMonthNames,
  splitDocsIntoMonths, splitDocsIntoWeeksOfMonth, 
  splitMonthDocsIntoDays
} from "app/utils/dateUtils"
import { displayGreeting, formatCurrency, objectToArray, sortArrayByProperty } from "app/utils/generalUtils"
import React, { useContext, useEffect, useState } from 'react'
import './styles/Homepage.css'

export default function HomePage() {

  const { setCompactNav, myUser } = useContext(StoreContext)
  const [revenueMode, setRevenueMode] = useState('year')
  const thisMonthInvoices = useCurrentMonthInvoices(new Date())
  const thisYearInvoices = useCurrentYearInvoices(new Date())
  const monthlyInvoices = splitDocsIntoMonths(thisYearInvoices, 'dateCreated')
  const dailyInvoices = splitMonthDocsIntoDays(monthlyInvoices[dateToMonthName(new Date())], 'dateCreated')
  const weeklyInvoices = splitDocsIntoWeeksOfMonth(monthlyInvoices[dateToMonthName(new Date())], 'dateCreated')
  const paidInvoices = thisYearInvoices?.filter(doc => doc.isPaid)
  const unpaidInvoices = thisYearInvoices?.filter(doc => !doc.isPaid)
  const partiallyPaidInvoices = thisYearInvoices?.filter(doc => doc.status === 'partially-paid')
  const overdueInvoices = thisYearInvoices?.filter(doc => doc.status === 'overdue')
  const dailyInvoicesArray = objectToArray(dailyInvoices, 'day')
  const weeklyInvoicesArray = sortArrayByProperty(objectToArray(weeklyInvoices, 'week'), 'week', 'desc')

  const yearlyRevenueData = shortAndLongMonthNames.map((month, i) => ({
    ...month,
    revenue: monthlyInvoices[month.longName]?.reduce((acc, doc) => acc + (doc.isPaid ? doc?.total : 0) || 0, 0)
  }))
  const monthlyRevenueData = dailyInvoicesArray?.map((day, i) => ({
    day: day.day,
    revenue: dailyInvoices[day.day]?.reduce((acc, doc) => acc + (doc.isPaid ? doc?.total : 0) || 0, 0)
  }))
  const weeklyRevenueData = weeklyInvoicesArray?.map((week, i) => ({
    week: week.week,
    revenue: weeklyInvoices[week.week]?.reduce((acc, doc) => acc + (doc.isPaid ? doc?.total : 0) || 0, 0)
  }))

  const monthlyInvoicesData = shortAndLongMonthNames.map((month, i) => ({
    ...month,
    invoices: monthlyInvoices[month.longName]?.reduce((acc, doc) => acc + 1, 0), fill: `var(--primary)`
  }))
  const paidUnpaidInvoicesData = [
    { value: paidInvoices?.length, name: 'Paid', fill: 'var(--theme1)' },
    { value: unpaidInvoices?.length, name: 'Unpaid', fill: 'var(--theme4)' },
  ]
  const invoiceStatusesData = [
    {value: paidInvoices?.length, name: 'Paid', fill: 'var(--theme1)'},
    {value: partiallyPaidInvoices?.length, name: 'Partially Paid', fill: 'var(--theme2)'},
    {value: unpaidInvoices?.length, name: 'Unpaid', fill: 'var(--theme4)'},
    {value: overdueInvoices?.length, name: 'Overdue', fill: 'var(--theme3)'},
  ]

  const dashboxArray = [
    {
      name: 'Revenue',
      icon: 'fal fa-dollar-sign',
      value: `$${formatCurrency(myUser?.totalRevenue)}`,
      thisMonth: `$${formatCurrency(thisMonthInvoices)}`
    },
    {
      name: 'Invoices',
      icon: 'fal fa-file-invoice-dollar',
      value: myUser?.invoicesNum,
      thisMonth: monthlyInvoices[dateToMonthName(new Date())]?.length
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

  const revenueChartActions = <div className="revenue-chart-actions">
    <AppButton
      buttonType="tabBtn"
      label="Yearly"
      onClick={() => setRevenueMode('year')}
      className={revenueMode === 'year' ? 'active' : ''}
    />
    <AppButton
      buttonType="tabBtn"
      label="Monthly"
      onClick={() => setRevenueMode('month')}
      className={revenueMode === 'month' ? 'active' : ''}
    />
    <AppButton
      buttonType="tabBtn"
      label="Weekly"
      onClick={() => setRevenueMode('week')}
      className={revenueMode === 'week' ? 'active' : ''}
    />
  </div>

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
            title={`Revenue By ${revenueMode}*`}
            actions={revenueChartActions}
            legendLabel="Revenue"
            data={revenueMode === 'year' ? yearlyRevenueData : 
              revenueMode === 'month' ? monthlyRevenueData : 
              weeklyRevenueData
            }
            areas={[
              { dataKey: 'revenue', stroke: 'var(--primary)', fill: 'var(--lightPrimary)' }
            ]}
            xDataKey={revenueMode === 'year' ? 'shortName' : revenueMode === 'month' ? 'day' : 'week'}
            xAxisStyles={{ fontSize: '13px' }}
            yAxisStyles={{ fontSize: '13px' }}
            tooltipLabelFormat={(name, value) => {
              return revenueMode === 'year' ? value[0]?.payload?.longName + ' ' + new Date().getFullYear() : 
              revenueMode === 'month' ? 
              getNameDayOfTheWeekFromDate(new Date(new Date().getFullYear(), new Date().getMonth(), value[0]?.payload?.day)) + ', ' + dateToMonthName(new Date(), 'short') + ' ' + value[0]?.payload?.day + ' ' : 
              value[0]?.payload?.week
            }}
            tooltipFormat={(name) => `$${formatCurrency(name)}`}
          />
        </div>
        <div className="dashboard-section">
          <AppRadarChart
            title="Invoices monthly"
            fill="var(--primary)"
            stroke="var(--primary)"
            barLabel="Invoices"
            radarDataKey="invoices"
            axisDataKey="shortName"
            data={monthlyInvoicesData}
          />
        </div>
        <div className="dashboard-section">
          <AppBarChart
            title="Paid/Unpaid"
            legendLabel="Invoices"
            fill="var(--primary)"
            data={paidUnpaidInvoicesData}
          />
        </div>
        <div className="dashboard-section">
          <AppPieChart
            title="Invoice Statuses"
            data={invoiceStatusesData}
          />
        </div>
      </div>
      <div className="foot-notes">
        <small>*Revenue is calculated from your paid invoices.</small>
      </div>
    </div>
  )
}
