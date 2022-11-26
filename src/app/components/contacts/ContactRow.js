import { deleteContactService } from "app/services/contactsServices"
import { StoreContext } from "app/store/store"
import { convertAlgoliaDate, convertClassicDate } from "app/utils/dateUtils"
import { truncateText } from "app/utils/generalUtils"
import React, { useContext } from 'react'
import { useNavigate } from "react-router-dom"
import AppItemRow from "../ui/AppItemRow"
import IconContainer from "../ui/IconContainer"

export default function ContactRow(props) {

  const { myUserID, setPageLoading } = useContext(StoreContext)
  const { contactID, name, email, phone, address, 
    city, region, country, dateCreated } = props.contact
  const navigate = useNavigate()

  const deleteContact = () => {
    deleteContactService(myUserID, contactID, setPageLoading)
  }

  return (
    <AppItemRow
      item1={truncateText(name, 18)}
      item2={truncateText(email, 18)}
      item3={phone}
      item4={address}
      item5={`${city}, ${region}`}
      item6={country}
      item7={convertClassicDate(convertAlgoliaDate(dateCreated))}
      actions={
        <>
          <IconContainer
            icon="fas fa-eye"
            tooltip="View Contact"
            dimensions="23px"
            inverted
            iconSize="13px"
            onClick={() => navigate(`/contacts/${contactID}`)}
          />
          <IconContainer
            icon="fas fa-pen"
            tooltip="Edit Contact"
            dimensions="23px"
            inverted
            iconSize="13px"
            onClick={() => navigate(`/contacts/new?contactID=${contactID}&edit=true`)}
          />
          <IconContainer
            icon="fas fa-trash"
            tooltip="Delete"
            dimensions="23px"
            inverted
            iconSize="13px"
            onClick={() => deleteContact()}
          />
        </>
      }
      onDoubleClick={() => navigate(`/contacts/${contactID}`)}
    />
  )
}
