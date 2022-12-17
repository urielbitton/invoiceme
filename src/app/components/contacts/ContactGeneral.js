import { useUserNotifSettings } from "app/hooks/userHooks"
import { deleteContactService } from "app/services/contactsServices"
import { StoreContext } from "app/store/store"
import { formatCurrency } from "app/utils/generalUtils"
import React, { useContext } from 'react'
import { useNavigate } from "react-router-dom"
import AppButton from "../ui/AppButton"

export default function ContactGeneral({ contact, invoices, estimates, payments }) {

  const { myUser, myUserID, setPageLoading, setToasts } = useContext(StoreContext)
  const totalBilled = invoices?.reduce((acc, invoice) => acc + invoice.total, 0)
  const highestBilled = invoices?.reduce((acc, invoice) => acc > invoice.total ? acc : invoice.total, 0)
  const lowestBilled = invoices?.reduce((acc, invoice) => acc.total < invoice.total ? acc : invoice.total, 0)
  const averageBilled = invoices.length ? totalBilled / invoices.length : 0
  const totalRevenue = invoices?.reduce((acc, invoice) => acc + (invoice.isPaid ? invoice.total : 0), 0)
  const symbol = myUser?.currency?.symbol || '$'
  const code = myUser?.currency?.value || 'CAD'
  const navigate = useNavigate()
  const contactStoragePath = `users/${myUserID}/contacts`
  const notifSettings = useUserNotifSettings(myUserID)

  const deleteContact = () => {
    deleteContactService(
      myUserID, 
      contact?.contactID, 
      contactStoragePath, 
      ['photo-url'], 
      setPageLoading,
      setToasts,
      notifSettings.showContactsNotifs
    )
    .then(() => {
      navigate('/contacts')
    })
  }

  return (
    contact ?
    <div className="contact-general contact-content">
      <div className="section">
        <h5>Contact Stats</h5>
        <h6>
          <span>Total Invoices:</span>
          <span>{invoices?.length}</span>
        </h6>
        <h6>
          <span>Total Estimates:</span>
          <span>{estimates?.length}</span>
        </h6>
        <h6>
          <span>Total Billed:</span>
          <span>{symbol}{formatCurrency(totalBilled)}{code}</span>
        </h6>
        <h6>
          <span>Highest Billed:</span>
          <span>{symbol}{formatCurrency(highestBilled)}{code}</span>
        </h6>
        <h6>
          <span>Lowest Billed:</span>
          <span>{symbol}{formatCurrency(lowestBilled)}{code}</span>
        </h6>
        <h6>
          <span>Average Billed:</span>
          <span>{symbol}{formatCurrency(averageBilled)}{code}</span>
        </h6>
        <h6>
          <span>Total Revenue:</span>
          <span>{symbol}{formatCurrency(totalRevenue)}{code}</span>
        </h6>
      </div>
      <div className="section">
        <h5>Contact Notes</h5>
        <p>{contact?.notes || 'No notes yet for this contact.'}</p>
      </div>
      <div className="btn-group">
        <AppButton
          label="Edit Contact"
          onClick={() => navigate(`/contacts/new?contactID=${contact.contactID}&edit=true`)}
          buttonType="outlineBlueBtn"
        />
        <AppButton
          label="Delete Contact"
          onClick={() => deleteContact()}
          buttonType="invertedRedBtn"
        />
      </div>
    </div> :
    null
  )
}
