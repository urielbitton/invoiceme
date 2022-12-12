import { useSentPayments } from "app/hooks/paymentHooks"
import { StoreContext } from "app/store/store"
import React, { useContext, useState } from 'react'
import AppButton from "../ui/AppButton"
import AppItemRow from "../ui/AppItemRow"
import AppTable from "../ui/AppTable"
import EmptyPage from "../ui/EmptyPage"
import IconContainer from "../ui/IconContainer"

export default function PaymentsSent() {

  const { myUserID } = useContext(StoreContext)
  const [paymentsLimit, setPaymentsLimit] = useState(10)
  const payments = useSentPayments(myUserID, paymentsLimit)
  console.log(payments)

  const paymentsList = payments?.map((payment) => {
    return <AppItemRow
      key={payment.id}
      item1=""
      item2=""
      item3=""
      item4=""
      item5=""
      item6=""
      item7=""
      actions={<>
        <IconContainer
          icon="fas fa-eye"
          iconSize={14}
          onClick={() => console.log('View payment')}
          dimensions={27}
          tooltip="View Payment"
        />
      </>
      }
    />
  })

  return payments?.length ? (
    <div className="payments-content">
      <AppTable
        headers={[
          'Date Sent',
          'Amount',
          'Status',
          'Description',
          'Invoice',
          'Payment Method',
          'Actions'
        ]}
        rows={paymentsList}
      />
      {
        payments.length <= paymentsLimit &&
        <AppButton
          label="Load More"
          onClick={() => setPaymentsLimit(paymentsLimit + 10)}
        />
      }
    </div>
  ) :
    <EmptyPage
      label="No Sent payments found"
      sublabel="No sent payments were found for this customer"
      btnLabel='New Payment'
      btnLink='/payments/new'
      btnIcon="fal fa-plus"
    />
}
