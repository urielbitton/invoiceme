import { errorToast, successToast } from "app/data/toastsTemplates"
import { useCustomerPayments } from "app/hooks/paymentHooks"
import { capturePaymentIntentService } from "app/services/paymentsServices"
import { StoreContext } from "app/store/store"
import { convertClassicUnixDate, convertClassicUnixDateAndTime } from "app/utils/dateUtils"
import { formatCurrency, truncateText } from "app/utils/generalUtils"
import React, { useContext, useState } from 'react'
import AppButton from "../ui/AppButton"
import AppItemRow from "../ui/AppItemRow"
import AppTable from "../ui/AppTable"
import EmptyPage from "../ui/EmptyPage"
import IconContainer from "../ui/IconContainer"

export default function PaymentsGeneral() {

  const { myUser, stripeCustomerPortalLink, setPageLoading,
    setToasts } = useContext(StoreContext)
  const [paymentsLimit, setPaymentsLimit] = useState(10)
  const [loading, setLoading] = useState(false)
  const payments = useCustomerPayments(myUser?.stripe.stripeCustomerID, setLoading, paymentsLimit)

  const paymentsList = payments?.data?.map((payment) => {
    return <AppItemRow
      key={payment.id}
      item1={<span title={convertClassicUnixDateAndTime(payment.created)}>{convertClassicUnixDate(payment.created)}</span>}
      item2={`$${formatCurrency((payment.amount / 100).toFixed(2))} ${payment.currency.toUpperCase()}`}
      item3={<span className="status">{payment.status}</span>}
      item4={<span title={payment.description}>{truncateText(payment.description, 40) || 'N/A'}</span>}
      item5={truncateText(payment.invoice, 20) || 'N/A'}
      item6={payment.payment_method_types[0]}
      actions={<>
        {
          payment.amount_received < payment.amount &&
          <IconContainer
            icon="fas fa-wallet"
            iconSize={14}
            onClick={() => capturePayment(payment.id)}
            dimensions={27}
            tooltip="Withdraw Funds"
          />
        }
        <IconContainer
          icon="fas fa-link"
          iconSize={14}
          onClick={() => window.open(stripeCustomerPortalLink, '_blank')}
          dimensions={27}
          tooltip="View Payment"
        />
      </>
      }
    />
  })

  const capturePayment = (paymentIntentID) => {
    setPageLoading(true)
    capturePaymentIntentService({ paymentIntentID  })
    .then((data) => {
      console.log(data)
      setToasts(successToast('Payment captured successfully'))
      setPageLoading(false)
    })
    .catch((err) => {
      console.log(err)
      setToasts(errorToast('Error capturing payment'))
      setPageLoading(false)
    })
  }

  return !loading ?
  payments?.data?.length ? (
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
      {
        payments?.has_more &&
        <AppButton
          label="Load More"
          onClick={() => setPaymentsLimit(paymentsLimit + 10)}
        />
      }
    </div>
  ) :
    <EmptyPage
      label="No Payments found"
      sublabel="No payments were found for this customer"
      btnLabel='New Payment'
      btnLink='/payments/new'
      btnIcon="fal fa-plus"
    /> :
    <div className="payments-loading">
      <i className="fas fa-spinner fa-spin" />
      <h6>Loading payment information</h6>
    </div>
}
