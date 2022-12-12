import { useScheduledEvents } from "app/hooks/userHooks"
import { StoreContext } from "app/store/store"
import { convertClassicDate, convertClassicDateAndTime } from "app/utils/dateUtils"
import React, { useContext, useState } from 'react'
import AppButton from "../ui/AppButton"
import AppItemRow from "../ui/AppItemRow"
import AppTable from "../ui/AppTable"
import EmptyPage from "../ui/EmptyPage"

export default function ScheduledEvents() {

  const { myUserID, stripeCustomerPortalLink } = useContext(StoreContext)
  const [eventsLimit, setEventsLimit] = useState(10)
  const events = useScheduledEvents(myUserID, eventsLimit)

  const paymentsList = events?.map((event) => {
    return <AppItemRow
      key={event.scheduleID}
      item1={<span title={convertClassicDateAndTime(event?.dateRan?.toDate())}>{convertClassicDate(event?.dateRan?.toDate())}</span>}
      item2={event.scheduleID}
      item3={event.name}
      item4={event.status || 'N/A'}
      item5={event.type}
      actions={<>
        
      </>
      }
    />
  })

  return events?.length ? (
    <div className="payments-content">
      <AppTable
        headers={[
          'Date Ran',
          'Schedule ID',
          'Name',
          'Status',
          'Type',
          'Actions'
        ]}
        rows={paymentsList}
      />
      {
        events.length <= eventsLimit &&
        <AppButton
          label="Load More"
          onClick={() => setEventsLimit(prev => prev + 10)}
        />
      }
    </div>
  ) :
    <EmptyPage
      label="No scheduled events found"
      sublabel="No scheduled events were found for this customer"
    />
}
