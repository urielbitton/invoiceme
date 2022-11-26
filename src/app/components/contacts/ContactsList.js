import { contactsIndex } from "app/algolia"
import { useInstantSearch } from "app/hooks/searchHooks"
import { StoreContext } from "app/store/store"
import React, { useContext } from 'react'
import AppPagination from "../ui/AppPagination"
import AppTable from "../ui/AppTable"
import ContactRow from "./ContactRow"

export default function ContactsList(props) {

  const { setPageLoading } = useContext(StoreContext)
  const { query, searchResults, setSearchResults, filters, setNumOfHits,
    setNumOfPages, pageNum, setPageNum, numOfPages, hitsPerPage, showAll,
    dbContacts } = props

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
      />
    )
  })

  const dbContactsList = dbContacts?.map((contact, index) => {
    return (
      <ContactRow
        key={index}
        contact={contact}
      />
    )
  })

  return (
    <div className="invoices-list">
      <AppTable
        headers={[
          "Name",
          "Email",
          "Phone",
          "Address",
          "City, Region",
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
