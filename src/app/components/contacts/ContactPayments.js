import { useContactSentPayments } from "app/hooks/paymentHooks"
import { StoreContext } from "app/store/store"
import { convertClassicDate, convertClassicDateAndTime } from "app/utils/dateUtils"
import { formatCurrency, truncateText } from "app/utils/generalUtils"
import React, { useContext, useState } from 'react'
import AppButton from "../ui/AppButton"
import AppItemRow from "../ui/AppItemRow"
import AppTable from "../ui/AppTable"
import EmptyPage from "../ui/EmptyPage"
import IconContainer from "../ui/IconContainer"

export default function ContactPayments(props) {

  const { myUserID, stripeCustomerPortalLink } = useContext(StoreContext)
  const { contactEmail } = props
  const [paymentsLimit, setPaymentsLimit] = useState(10)
  const payments = useContactSentPayments(myUserID, contactEmail, paymentsLimit)

  const paymentsList = payments?.map((payment) => {
    return <AppItemRow
      key={payment.id}
      item1={<span title={convertClassicDateAndTime(payment?.dateCreated?.toDate())}>{convertClassicDate(payment?.dateCreated?.toDate())}</span>}
      item2={<span className="lowercase">{payment?.contactEmail}</span>}
      item3={`$${formatCurrency((payment?.amount / 100).toFixed(2))} ${payment?.currency?.toUpperCase()}`}
      item4={<span className="status">{payment?.status}</span>}
      item5={truncateText(payment?.paymentMethodID, 20) || 'N/A'}
      actions={<>
        <IconContainer
          icon="fas fa-eye"
          iconSize={14}
          onClick={() => window.open(stripeCustomerPortalLink, '_blank')}
          dimensions={27}
          tooltip="View Payment"
        />
      </>
      }
    />
  })

  return (
    <div className="contact-payments-content contact-content">
      {
        payments?.length ?
          <div className="payments-content">
            <AppTable
              headers={[
                'Date Sent',
                'Sent To',
                'Amount',
                'Status',
                'Payment Method',
                'Actions'
              ]}
              rows={paymentsList}
            />
            {
              payments.length >= paymentsLimit &&
              <AppButton
                label="Load More"
                onClick={() => setPaymentsLimit(paymentsLimit + 10)}
              />
            }
          </div> :
          <EmptyPage
            label="No Sent payments found"
            sublabel="No sent payments were found for this contact"
            btnLabel='New Payment'
            btnLink='/payments/new'
            btnIcon="fal fa-plus"
          />
      }
    </div>
  )
}
