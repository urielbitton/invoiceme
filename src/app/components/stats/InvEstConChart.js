import { getNameDayOfTheWeekFromDate, monthNames, 
  shortAndLongMonthNames, shortMonthNames, splitDocsIntoMonths, 
  splitDocsIntoWeeksOfMonth, splitMonthDocsIntoDays } from "app/utils/dateUtils"
import { formatCurrency, objectToArray, sortArrayByProperty } from "app/utils/generalUtils"
import React from 'react'
import { AppBarChart } from "../ui/AppChart"
import StatusToggler from "./StatusToggler"

export default function InvEstConChart(props) {

  const { mode, setMode, thisYearInvoices, thisYearEstimates, thisYearContacts,
    hideStatusToggler, selectedYear, selectedMonth, className, subtitle } = props
  const monthlyInvoices = splitDocsIntoMonths(thisYearInvoices, 'dateCreated')
  const weeklyInvoices = splitDocsIntoWeeksOfMonth(monthlyInvoices[monthNames[selectedMonth]], 'dateCreated')
  const dailyInvoices = splitMonthDocsIntoDays(monthlyInvoices[monthNames[selectedMonth]], 'dateCreated')
  const monthlyEstimates = splitDocsIntoMonths(thisYearEstimates, 'dateCreated')
  const weeklyEstimates = splitDocsIntoWeeksOfMonth(monthlyEstimates[monthNames[selectedMonth]], 'dateCreated')
  const dailyEstimates = splitMonthDocsIntoDays(monthlyEstimates[monthNames[selectedMonth]], 'dateCreated')
  const monthlyContacts = splitDocsIntoMonths(thisYearContacts, 'dateCreated')
  const weeklyContacts = splitDocsIntoWeeksOfMonth(monthlyContacts[monthNames[selectedMonth]], 'dateCreated')
  const dailyContacts = splitMonthDocsIntoDays(monthlyContacts[monthNames[selectedMonth]], 'dateCreated')
  const dailyArray = objectToArray(dailyInvoices, 'day')
  const weeklyArray = sortArrayByProperty(objectToArray(weeklyInvoices, 'week'), 'week', 'desc')
  
  const yearlyData = shortAndLongMonthNames.map((month, i) => ({
    ...month,
    invoices: monthlyInvoices[month.longName]?.reduce((acc, doc) => acc + 1, 0),
    estimates: monthlyEstimates[month.longName]?.reduce((acc, doc) => acc + 1, 0),
    contacts: monthlyContacts[month.longName]?.reduce((acc, doc) => acc + 1, 0),
  }))
  const monthlyData = dailyArray?.map((day, i) => ({
    day: `${shortMonthNames[selectedMonth]} ${day.day}`,
    invoices: dailyInvoices[day.day]?.reduce((acc, doc) => acc + (doc.dateCreated ? 1 : 0), 0),
    estimates: dailyEstimates[day.day]?.reduce((acc, doc) => acc + (doc.dateCreated ? 1 : 0), 0),
    contacts: dailyContacts[day.day]?.reduce((acc, doc) => acc + (doc.dateCreated ? 1 : 0), 0)
  }))
  const weeklyData = weeklyArray?.map((week, i) => ({
    week: week.week,
    invoices: weeklyInvoices[week.week]?.reduce((acc, doc) => acc + 1, 0),
    estimates: weeklyEstimates[week.week]?.reduce((acc, doc) => acc + 1, 0),
    contacts: weeklyContacts[week.week]?.reduce((acc, doc) => acc + 1, 0),
  }))

  const barsList = [
    { 
      dataKey: 'invoices', 
      fill: 'var(--theme1)', 
      legendLabel: 'Invoices' 
    },
    { 
      dataKey: 'estimates', 
      fill: 'var(--theme2)', 
      legendLabel: 'Estimates' 
    },
    { 
      dataKey: 'contacts', 
      fill: 'var(--theme3)', 
      legendLabel: 'Contacts' 
    },
  ]

  return (
    <AppBarChart
      title="Invoices, Estimates & Contacts"
      subtitle={subtitle}
      className={className}
      actions={!hideStatusToggler &&
        <StatusToggler
          mode={mode}
          setMode={setMode}
        />
      }
      data={mode === 'year' ? yearlyData :
        mode === 'month' ? monthlyData :
        weeklyData
      }
      barsList={barsList}
      xDataKey={mode === 'year' ? 'shortName' : mode === 'month' ? 'day' : 'week'}
      xAxisStyles={{ fontSize: '13px' }}
      yAxisStyles={{ fontSize: '13px' }}
      tooltipLabelFormat={(name, value) => {
        return mode === 'year' ? value[0]?.payload?.longName + ' ' + new Date().getFullYear() :
        mode === 'month' ?
          getNameDayOfTheWeekFromDate(new Date(selectedYear, selectedMonth, value[0]?.payload?.day.slice(4))) +
          ' ' + value[0]?.payload?.day :
          value[0]?.payload?.week
      }}
    />
  )
}
