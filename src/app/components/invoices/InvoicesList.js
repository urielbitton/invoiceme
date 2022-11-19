import { invoicesIndex } from "app/algolia"
import { useInstantSearch } from "app/hooks/searchHooks"
import { StoreContext } from "app/store/store"
import React, { useContext, useState } from 'react'
import AppTable from "../ui/AppTable"
import InvoiceRow from "./InvoiceRow"

export default function InvoicesList() {

  const { myUserID, setPageLoading } = useContext(StoreContext)
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [numOfPages, setNumOfPages] = useState(1)
  const [pageNum, setPageNum] = useState(0)
  const [numOfHits, setNumOfHits] = useState(0)
  const [hitsPerPage, setHitsPerPage] = useState(10)
  const filters = `invoiceOwnerID:${myUserID}`
  const showAll = true

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
          "Invoice Date", 
          "Paid", 
          'Actions'
        ]}
        rows={invoicesList}
      />
    </div>
  )
}
