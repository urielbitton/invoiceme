import InvoicesList from "app/components/invoices/InvoicesList"
import NavItemsInit from "app/components/layout/NavItemsInit"
import SelectBar from "app/components/ui/SelectBar"
import { StoreContext } from "app/store/store"
import React, { useContext, useState } from 'react'
import './styles/InvoicesPage.css'

export default function InvoicesPage() {

  const { myUser, myUserID } = useContext(StoreContext)
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [numOfPages, setNumOfPages] = useState(1)
  const [pageNum, setPageNum] = useState(0)
  const [numOfHits, setNumOfHits] = useState(0)
  const [hitsPerPage, setHitsPerPage] = useState(10)
  const filters = `invoiceOwnerID:${myUserID}`
  const showAll = true

  return (
    <div className="invoices-page">
      <NavItemsInit
        navItem1={{ label: "Total Invoices", icon: 'fas fa-file-invoice-dollar', value: myUser?.invoicesNum }}
        navItem2={{ label: "This Month", icon: 'fas fa-calendar-alt', value: 0 }}
        navItem3={{ label: "Invoices Paid", icon: 'fas fa-receipt', value: '0/1' }}
      />
      <SelectBar

      />
      <div className="invoices-content">
        <InvoicesList 
          query={query} 
          searchResults={searchResults}
          setSearchResults={setSearchResults}
          filters={filters} 
          setNumOfHits={setNumOfHits}
          setNumOfPages={setNumOfPages}
          pageNum={pageNum}
          hitsPerPage={hitsPerPage}
          showAll={showAll}
        />
      </div>
    </div>
  )
}
