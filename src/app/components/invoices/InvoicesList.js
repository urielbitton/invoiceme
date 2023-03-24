import { invoicesIndex } from "app/algolia"
import { useInstantSearch } from "app/hooks/searchHooks"
import { useUserNotifSettings } from "app/hooks/userHooks"
import { StoreContext } from "app/store/store"
import React, { useContext } from 'react'
import AppPagination from "../ui/AppPagination"
import AppTable from "../ui/AppTable"
import InvoiceRow from "./InvoiceRow"

export default function InvoicesList(props) {

  const { setPageLoading, myUserID } = useContext(StoreContext)
  const { query, searchResults, setSearchResults, filters, setNumOfHits,
    setNumOfPages, pageNum, setPageNum, numOfPages, hitsPerPage, showAll,
    dbInvoices } = props
  const notifSettings = useUserNotifSettings(myUserID)

  const invoices = useInstantSearch(
    query,
    searchResults,
    setSearchResults,
    invoicesIndex,
    filters,
    setNumOfHits,
    setNumOfPages,
    pageNum,
    hitsPerPage,
    setPageLoading,
    showAll
  )

  const invoicesList = invoices?.map((invoice, index) => {
    return (
      <InvoiceRow
        key={index}
        invoice={invoice}
        notifSettings={notifSettings}
      />
    )
  })

  const dbInvoicesList = dbInvoices?.map((invoice, index) => {
    return (
      <InvoiceRow
        key={index}
        invoice={invoice}
        notifSettings={notifSettings}
      />
    )
  })

  return (
    <div className="invoices-list">
      <AppTable
        headers={[
          "Invoice #",
          "Title",
          "Client",
          "Items",
          "Total",
          "Date Created",
          "Paid",
          'Actions'
        ]}
        rows={query?.length ? invoicesList : dbInvoicesList}
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
