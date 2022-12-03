import { shortAndLongMonthNames, splitDocsIntoMonths } from "app/utils/dateUtils"
import React from 'react'
import { AppRadarChart } from "../ui/AppChart"

export default function InvoicesCountChart(props) {

  const { thisYearInvoices } = props
  const monthlyInvoices = splitDocsIntoMonths(thisYearInvoices, 'dateCreated')

  const monthlyInvoicesData = shortAndLongMonthNames.map((month, i) => ({
    ...month,
    invoices: monthlyInvoices[month.longName]?.reduce((acc, doc) => acc + 1, 0), fill: `var(--primary)`
  }))

  return (
    <AppRadarChart
      title="Invoices by month"
      fill="var(--primary)"
      stroke="var(--primary)"
      barLabel="Invoices"
      radarDataKey="invoices"
      axisDataKey="shortName"
      data={monthlyInvoicesData}
    />
  )
}
