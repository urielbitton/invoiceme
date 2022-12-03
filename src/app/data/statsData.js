import { formatCurrency } from "app/utils/generalUtils"

export const dashboxesList = (thisYearInvoices, thisMonthInvoices, thisYearEstimates,
  thisMonthEstimates, thisYearContacts, thisMonthContacts) => {

  const thisYearRevenue = thisYearInvoices?.reduce((acc, invoice) => acc + (invoice.isPaid ? invoice.total : 0), 0)
  const thisMonthRevenue = thisMonthInvoices?.reduce((acc, invoice) => acc + (invoice.isPaid ? invoice.total : 0), 0)

  const dashboxArray = [
    {
      name: 'Revenue',
      icon: 'fal fa-dollar-sign',
      value: `$${formatCurrency(thisYearRevenue?.toFixed(0)) || 0}`,
      thisMonth: `$${formatCurrency(thisMonthRevenue?.toFixed(0))}`
    },
    {
      name: 'Invoices',
      icon: 'fal fa-file-invoice-dollar',
      value: thisYearInvoices?.length,
      thisMonth: thisMonthInvoices?.length
    },
    {
      name: 'Estimates',
      icon: 'fal fa-file-invoice',
      value: thisYearEstimates?.length,
      thisMonth: thisMonthEstimates?.length
    },
    {
      name: 'Contacts',
      icon: 'fal fa-users',
      value: thisYearContacts?.length,
      thisMonth: thisMonthContacts?.length
    }
  ]
  return dashboxArray
}

export const extendedStatsData = (myUser) => {
  return [
    {
      name: 'Total Invoices',
      icon: 'fas fa-file-invoice-dollar',
      value: myUser?.invoicesNum
    },
    {
      name: 'Total Estimates',
      icon: 'fas fa-file-invoice',
      value: myUser?.estimatesNum
    },
    {
      name: 'Total Contacts',
      icon: 'fas fa-users',
      value: myUser?.contactsNum
    },
  ]
}