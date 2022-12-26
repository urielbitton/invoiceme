import { errorToast, successToast } from "app/data/toastsTemplates"
import { useScheduledEvents } from "app/hooks/userHooks"
import { deleteDB } from "app/services/CrudDB"
import { StoreContext } from "app/store/store"
import { convertClassicDate, convertClassicDateAndTime, convertClassicTime } from "app/utils/dateUtils"
import React, { useContext, useState } from 'react'
import { useNavigate } from "react-router-dom"
import AppButton from "../ui/AppButton"
import AppItemRow from "../ui/AppItemRow"
import AppTable from "../ui/AppTable"
import EmptyPage from "../ui/EmptyPage"
import IconContainer from "../ui/IconContainer"
import "./styles/ScheduledEvents.css"

export default function ScheduledEvents() {

  const { myUserID, setToasts } = useContext(StoreContext)
  const [eventsLimit, setEventsLimit] = useState(10)
  const events = useScheduledEvents(myUserID, eventsLimit)
  const navigate = useNavigate()

  const eventsList = events?.map((event, index) => {
    return <AppItemRow
      key={index}
      item1={<span title={convertClassicDateAndTime(event?.dateRan?.toDate())}>{convertClassicDate(event?.dateRan?.toDate())}</span>}
      item2={convertClassicTime(event?.dateRan?.toDate())}
      item3={event.scheduleID}
      item4={event.name}
      item5={event.status || 'N/A'}
      item6={event.type}
      actions={<>
        <IconContainer
          icon="fas fa-eye"
          tooltip="View Scheduled Invoice"
          dimensions="23px"
          inverted
          iconSize="13px"
          onClick={() => navigate(`/settings/scheduled-invoices/new?scheduleID=${event.scheduleID}&edit=true&mode=view`)}
        />
        <IconContainer
          icon="fas fa-trash"
          tooltip="Delete Event"
          dimensions="23px"
          inverted
          iconSize="13px"
          onClick={() => deleteEvent(event.eventID)}
        />
      </> 
      }
    />
  })

  const deleteEvent = (eventID) => {
    const confirm = window.confirm("Are you sure you want to delete this event? This action cannot be undone.")
    if(!confirm) return
    deleteDB(`users/${myUserID}/scheduledEvents`, eventID)
    .then(() => {
      setToasts(successToast("Event deleted."))
    })
    .catch(err => {
      console.log(err)
      setToasts(errorToast("There was an error deleting event. Please try again."))
    })
  }

  return events?.length ? (
    <div className="scheduled-events-content">
      <AppTable
        headers={[
          'Date Ran',
          'Time Ran',
          'Schedule ID',
          'Name',
          'Status',
          'Type',
          'Actions'
        ]}
        rows={eventsList}
      />
      {
        events.length >= eventsLimit &&
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
