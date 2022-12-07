import { useCustomerPayments } from "app/hooks/paymentHooks"
import { StoreContext } from "app/store/store"
import { convertClassicUnixDate } from "app/utils/dateUtils"
import { formatCurrency, truncateText } from "app/utils/generalUtils"
import React, { useContext, useState } from 'react'
import AppItemRow from "../ui/AppItemRow"
import AppTable from "../ui/AppTable"
import EmptyPage from "../ui/EmptyPage"
import IconContainer from "../ui/IconContainer"

export default function PaymentsGeneral() {

  const { myUser, stripeCustomerPortalLink } = useContext(StoreContext)
  const [paymentsLimit, setPaymentsLimit] = useState(10)
  const payments = useCustomerPayments(myUser?.stripe.stripeCustomerID, paymentsLimit)

  const paymentsList = payments?.data?.map((payment) => {
    return <AppItemRow
      key={payment.id}
      item1={convertClassicUnixDate(payment.created)}
      item2={`$${formatCurrency((payment.amount/100).toFixed(2))} ${payment.currency.toUpperCase()}`}
      item3={<span className="status">{payment.status}</span>}
      item4={truncateText(payment.description, 40)}
      item5={truncateText(payment.invoice, 20)}
      item6={payment.payment_method_types[0]}
      actions={
        <IconContainer
          icon="fas fa-link"
          iconSize={14}
          onClick={() => window.open(stripeCustomerPortalLink, '_blank')}
          dimensions={27}
        />
      }
    />
  })

  return payments ? (
    <div className="payments-content">
      <AppTable
        headers={[
          'Date Charged',
          'Amount',
          'Status',
          'Description',
          'Invoice',
          'Payment Method',
          'Actions'
        ]}
        rows={paymentsList}
      />
    </div>
  ) :
    <EmptyPage
      label="No Payments found"
      sublabel="No payments were found for this customer"
      btnLabel='New Payment'
      btnLink='/payments/new'
      btnIcon="fal fa-plus"
    />
}
