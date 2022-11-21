import { invoicesIndex } from "app/algolia"
import { useInstantSearch } from "app/hooks/searchHooks"
import { StoreContext } from "app/store/store"
import React, { useContext, useState } from 'react'
import AppTable from "../ui/AppTable"
import InvoiceRow from "./InvoiceRow"

export default function InvoicesList(props) {

  const { setPageLoading } = useContext(StoreContext)
  const { query, searchResults, setSearchResults, filters, 
    setNumOfHits, setNumOfPages, pageNum, hitsPerPage, showAll, 
    dbInvoices } = props

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

  const dbInvoicesList = dbInvoices?.map((invoice, index) => {
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
          "Date Created", 
          "Paid", 
          'Actions'
        ]}
        rows={query.length ? invoicesList : dbInvoicesList}
      />
    </div>
  )
}
