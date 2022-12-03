import React from 'react'
import { AppPieChart } from "../ui/AppChart"
import StatusToggler from "./StatusToggler"

export default function InvoicesStatusChart(props) {

  const { statusesTimeMode, setStatusesTimeMode, 
    thisYearInvoices, thisMonthInvoices } = props
  const paidYearInvoices = thisYearInvoices?.filter(doc => doc.isPaid)
  const unpaidYearInvoices = thisYearInvoices?.filter(doc => !doc.isPaid)
  const paidMonthInvoices = thisMonthInvoices?.filter(doc => doc.isPaid)
  const unpaidMonthInvoices = thisMonthInvoices?.filter(doc => !doc.isPaid)
  const partiallyPaidYearInvoices = thisYearInvoices?.filter(doc => doc.status === 'partially-paid')
  const overdueYearInvoices = thisYearInvoices?.filter(doc => doc.status === 'overdue')
  const partiallyPaidMonthInvoices = thisMonthInvoices?.filter(doc => doc.status === 'partially-paid')
  const overdueMonthInvoices = thisMonthInvoices?.filter(doc => doc.status === 'overdue')

  const invoiceStatusesData = [
    { value: paidYearInvoices?.length, name: 'Paid', fill: 'var(--theme1)', time: 'year' },
    { value: partiallyPaidYearInvoices?.length, name: 'Partially Paid', fill: 'var(--theme2)', time: 'year' },
    { value: unpaidYearInvoices?.length, name: 'Unpaid', fill: 'var(--theme4)', time: 'year' },
    { value: overdueYearInvoices?.length, name: 'Overdue', fill: 'var(--theme3)', time: 'year' },
    { value: paidMonthInvoices?.length, name: 'Paid', fill: 'var(--theme1)', time: 'month' },
    { value: partiallyPaidMonthInvoices?.length, name: 'Partially Paid', fill: 'var(--theme2)', time: 'month' },
    { value: unpaidMonthInvoices?.length, name: 'Unpaid', fill: 'var(--theme4)', time: 'month' },
    { value: overdueMonthInvoices?.length, name: 'Overdue', fill: 'var(--theme3)', time: 'month' }
  ]

  return (
    <AppPieChart
      title="Invoice Statuses"
      actions={
        <StatusToggler
          mode={statusesTimeMode}
          setMode={setStatusesTimeMode}
          hideWeek
        />
      }
      data={invoiceStatusesData.filter(item => item.time === statusesTimeMode)}
    />
  )
}
