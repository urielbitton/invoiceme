import { dateToMonthName, getNameDayOfTheWeekFromDate, 
  shortAndLongMonthNames, splitDocsIntoMonths, 
  splitDocsIntoWeeksOfMonth, splitMonthDocsIntoDays } from "app/utils/dateUtils"
import { formatCurrency, objectToArray, sortArrayByProperty } from "app/utils/generalUtils"
import React from 'react'
import { AppAreaChart } from "../ui/AppChart"
import StatusToggler from "./StatusToggler"

export default function RevenueChart(props) {

  const { revenueMode, setRevenueMode, thisYearInvoices } = props
  const monthlyInvoices = splitDocsIntoMonths(thisYearInvoices, 'dateCreated')
  const weeklyInvoices = splitDocsIntoWeeksOfMonth(monthlyInvoices[dateToMonthName(new Date())], 'dateCreated')
  const dailyInvoices = splitMonthDocsIntoDays(monthlyInvoices[dateToMonthName(new Date())], 'dateCreated')
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

  return (
    <AppAreaChart
      title={`Revenue By ${revenueMode}*`}
      actions={
        <StatusToggler
          mode={revenueMode}
          setMode={setRevenueMode}
        />
      }
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
            getNameDayOfTheWeekFromDate(new Date(new Date().getFullYear(), new Date().getMonth(), value[0]?.payload?.day)) + 
            ', ' + dateToMonthName(new Date(), 'short') + ' ' + value[0]?.payload?.day + ' ' :
            value[0]?.payload?.week
      }}
      tooltipFormat={(name) => `$${formatCurrency(name)}`}
    />
  )
}
