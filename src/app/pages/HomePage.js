import ContactsList from "app/components/contacts/ContactsList"
import EstimatesList from "app/components/estimates/EstimatesList"
import InvoicesList from "app/components/invoices/InvoicesList"
import Dashbox from "app/components/stats/Dashbox"
import InvoicesCountChart from "app/components/stats/InvoicesCountChart"
import InvoicesStatusChart from "app/components/stats/InvoicesStatusChart"
import PaidUnpaidChart from "app/components/stats/PaidUnpaidChart"
import RevenueChart from "app/components/stats/RevenueChart"
import AppButton from "app/components/ui/AppButton"
import { AppSelect } from "app/components/ui/AppInputs"
import HelmetTitle from "app/components/ui/HelmetTitle"
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
import { getNumOfDaysInMonth } from "app/utils/dateUtils"
import { displayGreeting } from "app/utils/generalUtils"
import React, { useContext, useEffect, useState } from 'react'
import './styles/Homepage.css'

export default function HomePage() {

  const { setCompactNav, myUser, myUserID } = useContext(StoreContext)
  const date = new Date()
  const [revenueMode, setRevenueMode] = useState('year')
  const [recentsView, setRecentsView] = useState('invoices')
  const [paidTimeMode, setPaidTimeMode] = useState('year')
  const [statusesTimeMode, setStatusesTimeMode] = useState('year')
  const [selectedYear, setSelectedYear] = useState(date.getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(date.getMonth())
  const monthStart = `${date.getMonth() + 1}, 01, ${date.getFullYear()}`
  const monthEnd = `${date.getMonth() + 1}, ${getNumOfDaysInMonth(date)}, ${date.getFullYear()}`
  const yearStart = `01, 01, ${date.getFullYear()}`
  const yearEnd = `12, 31, ${date.getFullYear()}`
  const thisMonthInvoices = useCurrentMonthInvoices(monthStart, monthEnd)
  const thisMonthEstimates = useCurrentMonthEstimates(monthStart, monthEnd)
  const thisMonthContacts = useCurrentMonthContacts(monthStart, monthEnd)
  const thisYearInvoices = useCurrentYearInvoices(yearStart, yearEnd)
  const thisYearEstimates = useCurrentYearEstimates(yearStart, yearEnd)
  const thisYearContacts = useCurrentYearContacts(yearStart, yearEnd)
  const dbInvoices = useInvoices(myUserID, 5)
  const dbEstimates = useEstimates(myUserID, 5)
  const dbContacts = useContacts(myUserID, 5)
  
  const dashboxArray = dashboxesList(
    thisYearInvoices, thisMonthInvoices, 
    thisYearEstimates, thisMonthEstimates, 
    thisYearContacts, thisMonthContacts
  )

  const dashboxList = dashboxArray?.map((dashbox, index) => {
    return <Dashbox
      key={index}
      dashbox={dashbox}
    />
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
      />
      <div className="dashboard-grid">
        <div className="dashboard-section full-width">
          {dashboxList}
        </div>
        <div className="dashboard-section full-width">
          <RevenueChart
            revenueMode={revenueMode}
            setRevenueMode={setRevenueMode}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            thisYearInvoices={thisYearInvoices}
          />
        </div>
        <div className="dashboard-section">
          <InvoicesCountChart
            thisYearInvoices={thisYearInvoices}
          />
        </div>
        <div className="dashboard-section">
          <PaidUnpaidChart
            paidTimeMode={paidTimeMode}
            setPaidTimeMode={setPaidTimeMode}
            thisYearInvoices={thisYearInvoices}
            thisMonthInvoices={thisMonthInvoices}
          />
        </div>
        <div className="dashboard-section">
          <InvoicesStatusChart
            statusesTimeMode={statusesTimeMode}
            setStatusesTimeMode={setStatusesTimeMode}
            thisYearInvoices={thisYearInvoices}
            thisMonthInvoices={thisMonthInvoices}
          />
        </div>
        <div className="more-stats">
          <AppButton
            label="More Stats"
            url="/my-account/extended-stats"
            rightIcon="fal fa-chart-bar"
          />
        </div>
        <div className="invoices-section full-width">
          <div className="titles">
            <h4>Recent {recentsView}</h4>
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
