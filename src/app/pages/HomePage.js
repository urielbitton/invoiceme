import ContactsList from "app/components/contacts/ContactsList"
import EstimatesList from "app/components/estimates/EstimatesList"
import InvoicesList from "app/components/invoices/InvoicesList"
import AppButton from "app/components/ui/AppButton"
import { AppAreaChart, AppBarChart, 
  AppPieChart, AppRadarChart
} from "app/components/ui/AppChart"
import { AppSelect } from "app/components/ui/AppInputs"
import HelmetTitle from "app/components/ui/HelmetTitle"
import IconContainer from "app/components/ui/IconContainer"
import PageTitleBar from "app/components/ui/PageTitleBar"
import { recentsListOptions } from "app/data/general"
import { dashboxesList } from "app/data/statsData"
import { useContacts } from "app/hooks/contactsHooks"
import { useEstimates } from "app/hooks/estimateHooks"
import { useInvoices } from "app/hooks/invoiceHooks"
import { useCurrentYearInvoices, useCurrentMonthInvoices, 
  useCurrentYearEstimates, useCurrentMonthEstimates, 
  useCurrentYearContacts, useCurrentMonthContacts } from "app/hooks/statsHooks"
import { StoreContext } from "app/store/store"
import { dateToMonthName, getNameDayOfTheWeekFromDate, shortAndLongMonthNames,
  splitDocsIntoMonths, splitDocsIntoWeeksOfMonth, splitMonthDocsIntoDays
} from "app/utils/dateUtils"
import { displayGreeting, formatCurrency, objectToArray, 
  sortArrayByProperty } from "app/utils/generalUtils"
import React, { useContext, useEffect, useState } from 'react'
import './styles/Homepage.css'

export default function HomePage() {

  const { setCompactNav, myUser, myUserID } = useContext(StoreContext)
  const [revenueMode, setRevenueMode] = useState('year')
  const [recentsView, setRecentsView] = useState('invoices')
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const thisYearInvoices = useCurrentYearInvoices(selectedYear)
  const thisMonthInvoices = useCurrentMonthInvoices(new Date())
  const thisYearEstimates = useCurrentYearEstimates(selectedYear)
  const thisMonthEstimates = useCurrentMonthEstimates(new Date())
  const thisYearContacts = useCurrentYearContacts(selectedYear)
  const thisMonthContacts = useCurrentMonthContacts(new Date())
  const dbInvoices = useInvoices(myUserID, 5)
  const dbEstimates = useEstimates(myUserID, 5)
  const dbContacts = useContacts(myUserID, 5)
  const monthlyInvoices = splitDocsIntoMonths(thisYearInvoices, 'dateCreated')
  const weeklyInvoices = splitDocsIntoWeeksOfMonth(monthlyInvoices[dateToMonthName(new Date())], 'dateCreated')
  const dailyInvoices = splitMonthDocsIntoDays(monthlyInvoices[dateToMonthName(new Date())], 'dateCreated')
  const paidInvoices = thisYearInvoices?.filter(doc => doc.isPaid)
  const unpaidInvoices = thisYearInvoices?.filter(doc => !doc.isPaid)
  const partiallyPaidInvoices = thisYearInvoices?.filter(doc => doc.status === 'partially-paid')
  const overdueInvoices = thisYearInvoices?.filter(doc => doc.status === 'overdue')
  const dailyInvoicesArray = objectToArray(dailyInvoices, 'day')
  const weeklyInvoicesArray = sortArrayByProperty(objectToArray(weeklyInvoices, 'week'), 'week', 'desc')

  const dashboxArray = dashboxesList(
    thisYearInvoices, thisMonthInvoices, 
    thisYearEstimates, thisMonthEstimates, 
    thisYearContacts, thisMonthContacts
  )

  const yearSelectOptions = [
    { label: '2022', value: 2022 },
    { label: '2021', value: 2021 },
    { label: '2020', value: 2020 },
  ]

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
    { value: paidInvoices?.length, name: 'Paid', fill: 'var(--theme1)' },
    { value: partiallyPaidInvoices?.length, name: 'Partially Paid', fill: 'var(--theme2)' },
    { value: unpaidInvoices?.length, name: 'Unpaid', fill: 'var(--theme4)' },
    { value: overdueInvoices?.length, name: 'Overdue', fill: 'var(--theme3)' },
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

  const dashboxList = dashboxArray?.map((dashbox, index) => {
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
        subtitle={<>{displayGreeting()}, <span>{myUser?.firstName}</span></>}
        rightComponent={
          <div className="year-selector">
            <h5>View Year:</h5>
            <AppSelect
              options={yearSelectOptions}
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
            />
          </div>
        }
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
        <div className="invoices-section full-width">
          <div className="titles">
            <h4>Recent Invoices</h4>
            <AppSelect
              options={recentsListOptions}
              value={recentsView}
              onChange={(e) => setRecentsView(e.target.value)}
            />
          </div>
          {
            recentsView === 'invoices' ?
            <InvoicesList
              dbInvoices={dbInvoices}
            /> :
            recentsView === 'estimates' ?
            <EstimatesList
              dbEstimates={dbEstimates}
            /> :
            <ContactsList
              dbContacts={dbContacts}
            />
          }
        </div>
      </div>
      <div className="foot-notes">
        <small>*Revenue is calculated from your paid invoices.</small>
      </div>
    </div>
  )
}
