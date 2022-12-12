import { useCustomerInvoices } from "app/hooks/paymentHooks"
import { StoreContext } from "app/store/store"
import { convertClassicUnixDate } from "app/utils/dateUtils"
import { formatCurrency } from "app/utils/generalUtils"
import React, { useContext, useState } from 'react'
import AppButton from "../ui/AppButton"
import AppItemRow from "../ui/AppItemRow"
import AppTable from "../ui/AppTable"
import EmptyPage from "../ui/EmptyPage"
import IconContainer from "../ui/IconContainer"

export default function PaymentsInvoices() {

  const { myUser } = useContext(StoreContext)
  const [invoicesLimit, setInvoicesLimit] = useState(10)
  const invoices = useCustomerInvoices(myUser?.stripe?.stripeCustomerID, invoicesLimit)

  const invoicesList = invoices?.data?.map((invoice) => {
    return <AppItemRow
      key={invoice.id}
      item1={invoice.customer_name}
      item2={<span className="lowercase">{invoice.customer_email}</span>}
      item3={`$${formatCurrency((invoice.amount_due/100).toFixed(2))} ${invoice.lines.data[0].currency.toUpperCase()}`}
      item4={`$${formatCurrency((invoice.amount_paid/100).toFixed(2))} ${invoice.lines.data[0].currency.toUpperCase()}`}
      item5={`$${formatCurrency((invoice.subtotal/100).toFixed(2))} ${invoice.lines.data[0].currency.toUpperCase()}`}
      item6={`$${formatCurrency((invoice.total/100).toFixed(2))} ${invoice.lines.data[0].currency.toUpperCase()}`}
      item7={convertClassicUnixDate(invoice.created)}
      actions={
        <a 
          href={`https://billing.stripe.com${invoice.lines.url}`}
          target="_blank"
        >
        <IconContainer
          icon="fas fa-link"
          iconSize={14}
          dimensions={27}
        />
        </a>
      }
    />
  })

  return invoicesList?.data?.length ? (
    <div className="payments-content">
      <AppTable
        headers={[
          'Customer Name',
          'Customer Email',
          'Amount Due',
          'Amount Paid',
          'Subotal',
          'Total',
          'Date Created',
          'Actions'
        ]}
        rows={invoicesList}
      />
      {
        invoices?.has_more && 
        <AppButton
          label="Load More"
          onClick={() => setInvoicesLimit(invoicesLimit + 10)}
        />
      }
    </div>
  ) :
    <EmptyPage
      label="No account invoices found"
      sublabel="No account invoices were found for this customer"
    />
}
