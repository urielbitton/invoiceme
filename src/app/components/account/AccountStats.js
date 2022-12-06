import { monthSelectOptions } from "app/data/general"
import { extendedStatsData } from "app/data/statsData"
import { useContactYearOptions } from "app/hooks/contactsHooks"
import { useEstimateYearOptions } from "app/hooks/estimateHooks"
import { useInvoiceYearOptions } from "app/hooks/invoiceHooks"
import { useCurrentMonthInvoices, useCurrentYearContacts, 
  useCurrentYearEstimates, useCurrentYearInvoices } from "app/hooks/statsHooks"
import { StoreContext } from "app/store/store"
import { monthNames } from "app/utils/dateUtils"
import React, { useContext, useState } from 'react'
import Dashbox from "../stats/Dashbox"
import InvEstConChart from "../stats/InvEstConChart"
import InvoicesStatusChart from "../stats/InvoicesStatusChart"
import PaidUnpaidChart from "../stats/PaidUnpaidChart"
import RevenueChart from "../stats/RevenueChart"
import AppButton from "../ui/AppButton"
import { AppSelect } from "../ui/AppInputs"
import './styles/AccountStats.css'

export default function AccountStats() {

  const { myUser } = useContext(StoreContext)
  const date = new Date()
  const [selectedYear, setSelectedYear] = useState(date.getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(date.getMonth())
  const [activeDate, setActiveDate] = useState(new Date(date.getFullYear(), date.getMonth(), 1))
  const [activeYear, setActiveYear] = useState(date.getFullYear())
  const [activeMonth, setActiveMonth] = useState(date.getMonth())
  const [revenueMode, setRevenueMode] = useState('month')
  const [paidTimeMode, setPaidTimeMode] = useState('month')
  const [statusesTimeMode, setStatusesTimeMode] = useState('month')
  const [allItemsMode, setAllItemsMode] = useState('month')
  const invoiceYearOptions = useInvoiceYearOptions()
  const estimateYearOptions = useEstimateYearOptions()
  const contactYearOptions = useContactYearOptions()
  const activeYearInvoices = useCurrentYearInvoices(null, null, activeYear)
  const activeYearEstimates = useCurrentYearEstimates(null, null, activeYear)
  const activeYearContacts = useCurrentYearContacts(null, null, activeYear)
  const activeMonthInvoices = useCurrentMonthInvoices(null, null, activeDate)
  const allYearsOptions = [...invoiceYearOptions, ...estimateYearOptions, ...contactYearOptions]
  // @ts-ignore
  const allYearsSelectOptions = [...new Map(allYearsOptions.map(item => [item['label'], item])).values()]

  const extendedStatsList = extendedStatsData(myUser)?.map((stat, index) => {
    return <Dashbox
      key={index}
      dashbox={stat}
      hideSublabel
    />
  })

  const initStatsDates = () => {
    setActiveDate(new Date(selectedYear, selectedMonth, 1))
    setActiveYear(selectedYear)
    setActiveMonth(selectedMonth)
  }

  return (
    <div className="account-stats">
      <h4>All Time Counts</h4>
      <div className="stats-grid">
        {extendedStatsList}
      </div>
      <div className="toolbar">
        <AppSelect
          label="Select a year"
          options={allYearsSelectOptions}
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        />
        <AppSelect
          label="Select a month"
          options={monthSelectOptions.slice(1)}
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
        <AppButton
          label="Set Dates"
          onClick={() => initStatsDates()}
          disabled={selectedYear === activeYear && selectedMonth === activeMonth}
        />
      </div>
      <h3>Viewing {monthNames[activeMonth]} {activeYear}</h3>
      <div className="charts-grid">
        <RevenueChart
          revenueMode={revenueMode}
          setRevenueMode={setRevenueMode}
          thisYearInvoices={activeYearInvoices}
          selectedYear={activeYear}
          selectedMonth={activeMonth}
          subtitle={revenueMode === 'month' ? `${monthNames[activeMonth]} ${activeYear}` : activeYear }
        />
        <PaidUnpaidChart
          paidTimeMode={paidTimeMode}
          setPaidTimeMode={setPaidTimeMode}
          thisYearInvoices={activeYearInvoices}
          thisMonthInvoices={activeMonthInvoices} 
          className="paid-unpaid-chart"
          subtitle={paidTimeMode === 'month' ? `${monthNames[activeMonth]} ${activeYear}` : activeYear }
        />
        <InvoicesStatusChart
          statusesTimeMode={statusesTimeMode}
          setStatusesTimeMode={setStatusesTimeMode}
          thisYearInvoices={activeYearInvoices}
          thisMonthInvoices={activeMonthInvoices}
          subtitle={statusesTimeMode === 'month' ? `${monthNames[activeMonth]} ${activeYear}` : activeYear }
        />
        <InvEstConChart
          mode={allItemsMode}
          setMode={setAllItemsMode}
          className="all-items-chart"
          selectedYear={activeYear}
          selectedMonth={activeMonth}
          thisYearInvoices={activeYearInvoices}
          thisYearEstimates={activeYearEstimates}
          thisYearContacts={activeYearContacts}
          subtitle={allItemsMode === 'month' ? `${monthNames[activeMonth]} ${activeYear}` : activeYear }
        />
      </div>
    </div>
  )
}
