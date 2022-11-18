import { invoicesIndex } from "app/algolia"
import { useInstantSearch } from "app/hooks/searchHooks"
import { StoreContext } from "app/store/store"
import React, { useContext, useState } from 'react'
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
    console.log(invoice)
    return (
      <InvoiceRow
        key={index}
        invoice={invoice}
      />
    )
  })

  return (
    <div className="invoices-list">
      <div className="app-table">
        <div className="invoices-headers">
          <h5>Invoice #</h5>
          <h5>Title</h5>
          <h5>Client</h5>
          <h5>Items</h5>
          <h5>Total</h5>
          <h5>Invoice Date</h5>
          <h5>Paid</h5>
          <h5>Actions</h5>
        </div>
        {invoicesList}
      </div>
    </div>
  )
}
