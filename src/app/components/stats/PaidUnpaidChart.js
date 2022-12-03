import React from 'react'
import { AppBarChart } from "../ui/AppChart"
import StatusToggler from "./StatusToggler"

export default function PaidUnpaidChart(props) {

  const { paidTimeMode, setPaidTimeMode, thisYearInvoices,
    thisMonthInvoices } = props
  const paidYearInvoices = thisYearInvoices?.filter(doc => doc.isPaid)
  const unpaidYearInvoices = thisYearInvoices?.filter(doc => !doc.isPaid)
  const paidMonthInvoices = thisMonthInvoices?.filter(doc => doc.isPaid)
  const unpaidMonthInvoices = thisMonthInvoices?.filter(doc => !doc.isPaid)

  const paidUnpaidInvoicesData = [
    { value: paidYearInvoices?.length, name: 'Paid', fill: 'var(--theme1)', time: 'year' },
    { value: unpaidYearInvoices?.length, name: 'Unpaid', fill: 'var(--theme4)', time: 'year' },
    { value: paidMonthInvoices?.length, name: 'Paid', fill: 'var(--theme1)', time: 'month' },
    { value: unpaidMonthInvoices?.length, name: 'Unpaid', fill: 'var(--theme4)', time: 'month' },
  ]

  return (
    <AppBarChart
      title="Paid/Unpaid"
      legendLabel="Invoices"
      fill="var(--primary)"
      actions={
        <StatusToggler
          mode={paidTimeMode}
          setMode={setPaidTimeMode}
          hideWeek
        />
      }
      data={paidUnpaidInvoicesData.filter(item => item.time === paidTimeMode)}
    />
  )
}
