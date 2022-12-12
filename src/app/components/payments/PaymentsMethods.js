import { useAttachedPaymentMethods } from "app/hooks/paymentHooks"
import { StoreContext } from "app/store/store"
import { convertClassicUnixDate } from "app/utils/dateUtils"
import React, { useContext } from 'react'
import AppItemRow from "../ui/AppItemRow"
import AppTable from "../ui/AppTable"
import EmptyPage from "../ui/EmptyPage"
import IconContainer from "../ui/IconContainer"

export default function PaymentsMethods() {

  const { myUser, stripeCustomerPortalLink } = useContext(StoreContext)
  const paymentMethods = useAttachedPaymentMethods(myUser?.stripe?.stripeCustomerID)

  const paymentMethodsList = paymentMethods?.data?.map((method) => {
    return <AppItemRow
      key={method.id}
      item1={method.card.brand}
      item2={method.card.last4}
      item3={method.card.exp_month + '/' + method.card.exp_year}
      item4={method.card.funding}
      item5={method.type}
      item6={convertClassicUnixDate(method.created)}
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

  return paymentMethods?.data?.length ? (
    <div className="payments-content">
      <AppTable
        headers={[
          'Card Brand',
          'Last 4 digits',
          'Expiry Date',
          'Funding',
          'Method Type',
          'Date Created',
          'Actions'
        ]}
        rows={paymentMethodsList}
      />
    </div>
  ) :
    <EmptyPage
      label="No Payment methods found"
      sublabel="No payment methods were found for this customer"
    />
}
