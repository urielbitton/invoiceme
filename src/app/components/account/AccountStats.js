import { monthSelectOptions } from "app/data/general"
import { extendedStatsData } from "app/data/statsData"
import { useContactYearOptions } from "app/hooks/contactsHooks"
import { useEstimateYearOptions } from "app/hooks/estimateHooks"
import { useInvoiceYearOptions } from "app/hooks/invoiceHooks"
import {
  useCurrentMonthInvoices, useCurrentYearContacts,
  useCurrentYearEstimates, useCurrentYearInvoices
} from "app/hooks/statsHooks"
import { sendHtmlToEmailAsPDF } from "app/services/emailServices"
import { StoreContext } from "app/store/store"
import { monthNames } from "app/utils/dateUtils"
import { domToPDFDownload, downloadHtmlElementAsImage } from "app/utils/fileUtils"
import React, { useContext, useState } from 'react'
import Dashbox from "../stats/Dashbox"
import InvEstConChart from "../stats/InvEstConChart"
import InvoicesStatusChart from "../stats/InvoicesStatusChart"
import PaidUnpaidChart from "../stats/PaidUnpaidChart"
import RevenueChart from "../stats/RevenueChart"
import AppButton from "../ui/AppButton"
import { AppSelect } from "../ui/AppInputs"
import DropdownButton from "../ui/DropdownButton"
import './styles/AccountStats.css'

export default function AccountStats() {

  const { myUser, myMemberType, setPageLoading } = useContext(StoreContext)
  const date = new Date()
  const [showExportMenu, setShowExportMenu] = useState(false)
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
  const isBusiness = myMemberType === 'business'

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

  const downloadImgStats = () => {
    downloadHtmlElementAsImage(
      document.querySelector('.account-stats'),
      `invoice_me_stats${selectedYear}-${selectedMonth}.png`
    )
  }

  const downloadPDFStats = () => {
      domToPDFDownload(
      document.querySelector('.account-stats'),
      `invoice_me_stats${selectedYear}-${selectedMonth}.pdf`,
      true
    )
  }

  const sendStatsToEmail = () => {
    setPageLoading(true)
    sendHtmlToEmailAsPDF(
      'info@atomicsdigital.com', 
      myUser?.email, 
      'Invoice Me Extended Stats', 
      `Hi ${myUser?.firstName}, <br/><br/>Here are your extended stats for `+
      `${monthNames[selectedMonth]} ${selectedYear}.<br/><br/>The Invoice Me Team`, 
      document.querySelector('.account-stats'),
      `invoice_me_stats${selectedYear}-${selectedMonth}.pdf`,
      [], 
      null
    )
    .then(() => {
      setPageLoading(false)
    })
    .catch(err => {
      console.log(err)
      setPageLoading(false)
    })
  }

  return isBusiness ? (
    <div className="account-stats">
      <div className="page-title">
        <h4>All Time Counts</h4>
        <DropdownButton
          label="Export Stats"
          iconRight="fal fa-file-export"
          showMenu={showExportMenu}
          setShowMenu={setShowExportMenu}
          className="export-btn"
          rightIcon="fal fa-chevron-down"
          items={[
            {
              label: "Download As Image",
              icon: "fas fa-image",
              onClick: () => downloadImgStats()
            },
            {
              label: "Download As PDF",
              icon: "fas fa-file-pdf",
              onClick: () => downloadPDFStats()
            },
            {
              label: "Send To My Email",
              icon: "fas fa-envelope",
              onClick: () => sendStatsToEmail()
            },
          ]}
        />
      </div>
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
          subtitle={revenueMode === 'month' ? `${monthNames[activeMonth]} ${activeYear}` : activeYear}
        />
        <PaidUnpaidChart
          paidTimeMode={paidTimeMode}
          setPaidTimeMode={setPaidTimeMode}
          thisYearInvoices={activeYearInvoices}
          thisMonthInvoices={activeMonthInvoices}
          className="paid-unpaid-chart"
          subtitle={paidTimeMode === 'month' ? `${monthNames[activeMonth]} ${activeYear}` : activeYear}
        />
        <InvoicesStatusChart
          statusesTimeMode={statusesTimeMode}
          setStatusesTimeMode={setStatusesTimeMode}
          thisYearInvoices={activeYearInvoices}
          thisMonthInvoices={activeMonthInvoices}
          subtitle={statusesTimeMode === 'month' ? `${monthNames[activeMonth]} ${activeYear}` : activeYear}
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
          subtitle={allItemsMode === 'month' ? `${monthNames[activeMonth]} ${activeYear}` : activeYear}
        />
      </div>
    </div>
  ) :
    <>
      <br />
      Upgrade your membership to view extended stats.<br /><br />
      <AppButton
        label="Upgrade"
        url="/upgrade"
        leftIcon="fal fa-rocket-launch"
      />
    </>
}
