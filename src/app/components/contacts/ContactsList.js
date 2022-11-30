import { contactsIndex } from "app/algolia"
import { useInstantSearch } from "app/hooks/searchHooks"
import { StoreContext } from "app/store/store"
import React, { useContext } from 'react'
import { useNavigate } from "react-router-dom"
import AppPagination from "../ui/AppPagination"
import AppTable from "../ui/AppTable"
import ContactRow from "./ContactRow"

export default function ContactsList(props) {

  const { setPageLoading } = useContext(StoreContext)
  const { query, searchResults, setSearchResults, filters, setNumOfHits,
    setNumOfPages, pageNum, setPageNum, numOfPages, hitsPerPage, showAll,
    dbContacts } = props
  const navigate = useNavigate()

  const contacts = useInstantSearch(
    query,
    searchResults,
    setSearchResults,
    contactsIndex,
    filters,
    setNumOfHits,
    setNumOfPages,
    pageNum,
    hitsPerPage,
    setPageLoading,
    showAll
  )

  const contactsList = contacts?.map((contact, index) => {
    return (
      <ContactRow
        key={index}
        contact={contact}
        onDoubleClick={() => navigate(`/contacts/${contact.contactID}`)}
      />
    )
  })

  const dbContactsList = dbContacts?.map((contact, index) => {
    return (
      <ContactRow
        key={index}
        contact={contact}
        onDoubleClick={() => navigate(`/contacts/${contact.contactID}`)}
      />
    )
  })

  return (
    <div className="invoices-list contacts-list">
      <AppTable
        headers={[
          "Name",
          "Email",
          "Phone",
          "Address",
          "City",
          "Country",
          "Date Created",
          'Actions'
        ]}
        rows={query?.length ? contactsList : dbContactsList}
      />
      {
        query?.length > 0 &&
        <div className="pagination-section">
          <AppPagination
            pageNum={pageNum}
            setPageNum={setPageNum}
            numOfPages={numOfPages}
            dimensions="30px"
          />
        </div>
      }
    </div>
  )
}
