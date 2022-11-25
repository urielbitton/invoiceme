import { dateToMonthName } from "app/utils/dateUtils"
import { formatCurrency } from "app/utils/generalUtils"

export const dashboxesList = (myUser, thisMonthInvoices, monthlyInvoices) => {
  const dashboxArray = [
    {
      name: 'Revenue',
      icon: 'fal fa-dollar-sign',
      value: `$${formatCurrency(myUser?.totalRevenue) || 0}`,
      thisMonth: `$${formatCurrency(thisMonthInvoices)}`
    },
    {
      name: 'Invoices',
      icon: 'fal fa-file-invoice-dollar',
      value: myUser?.invoicesNum,
      thisMonth: monthlyInvoices[dateToMonthName(new Date())]?.length
    },
    {
      name: 'Estimates',
      icon: 'fal fa-file-invoice',
      value: myUser?.estimatesNum,
      thisMonth: 0
    },
    {
      name: 'Contacts',
      icon: 'fal fa-users',
      value: myUser?.contactsNum,
      thisMonth: 0
    }
  ]
  return dashboxArray
}