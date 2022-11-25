import InvoicesList from "app/components/invoices/InvoicesList"
import AppSelectBar from "app/components/ui/AppSelectBar"
import { StoreContext } from "app/store/store"
import React, { useContext, useEffect, useState } from 'react'
import './styles/InvoicesPage.css'
import noResultsImg from 'app/assets/images/no-results.png'
import { useInvoices } from "app/hooks/invoiceHooks"
import HelmetTitle from "app/components/ui/HelmetTitle"
import AppButton from "app/components/ui/AppButton"

export default function InvoicesPage() {

  const { myUser, myUserID, setNavItem1, setNavItem2,
    setNavItem3 } = useContext(StoreContext)
  const [searchString, setSearchString] = useState("")
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [numOfPages, setNumOfPages] = useState(1)
  const [pageNum, setPageNum] = useState(0)
  const [numOfHits, setNumOfHits] = useState(0)
  const [hitsPerPage, setHitsPerPage] = useState(10)
  const limitsNum = 10
  const [invoicesLimit, setInvoicesLimit] = useState(limitsNum)
  const dbInvoices = useInvoices(myUserID, invoicesLimit)
  const filters = `invoiceOwnerID:${myUserID}`
  const showAll = false

  const labelText1 = query.length > 0 ? 
    <>Showing <span className="bold">{hitsPerPage < numOfHits ? hitsPerPage : numOfHits}</span> of {numOfHits} invoices</> :
    <>Showing <span className="bold">
      {invoicesLimit <= myUser?.invoicesNum ? invoicesLimit : myUser?.invoicesNum}
    </span> of {myUser?.invoicesNum} invoices</>

  const executeSearch = (e) => {
    if (e.key === 'Enter') {
      setQuery(searchString)
    }
  }

  const handleOnChange = (e) => {
    if(e.target.value.length < 1) {
      setQuery('')
    }
    setSearchString(e.target.value)
  }

  useEffect(() => {
    setNavItem1({ label: "Total Invoices", icon: 'fas fa-file-invoice-dollar', value: myUser?.invoicesNum })
    setNavItem2({ label: "This Month", icon: 'fas fa-calendar-alt', value: 0 })
    setNavItem3({ label: "Invoices Paid", icon: 'fas fa-receipt', value: '0/1' })
    return () => {
      setNavItem1(null)
      setNavItem2(null)
      setNavItem3(null)
    }
  },[myUser])

  return (
    <div className="invoices-page">
      <HelmetTitle title="Invoices" />
      <AppSelectBar
        labelText1={labelText1}
        selectOptions={[
          { value: 'date', label: 'Invoice Date' },
          { value: 'client', label: 'Client Name' },
          { value: 'amount', label: 'Invoice Total' },
        ]}
        rightComponent={query.length > 0 && <i className="fas fa-file-search search-mode-icon"/>}
        searchValue={searchString}
        searchOnChange={(e) => handleOnChange(e)}
        handleOnKeyPress={(e) => executeSearch(e)}
        showAmountSelect
        amountSelectValue={invoicesLimit}
        amountSelectOnChange={(e) => setInvoicesLimit(e.target.value)}
      />
      <div className="invoices-content">
        <InvoicesList
          query={query}
          searchResults={searchResults}
          setSearchResults={setSearchResults}
          filters={filters}
          setNumOfHits={setNumOfHits}
          numOfPages={numOfPages}
          setNumOfPages={setNumOfPages}
          pageNum={pageNum}
          setPageNum={setPageNum}
          hitsPerPage={hitsPerPage}
          showAll={showAll}
          dbInvoices={dbInvoices}
        />
        {
          invoicesLimit < myUser?.invoicesNum &&
          <AppButton
            label="Show More"
            onClick={() => setInvoicesLimit(invoicesLimit + limitsNum)}
            className="show-more-btn"
          />
        }
        {
          query.length > 0 && searchResults.length === 0 &&
          <div className="no-results">
            <img src={noResultsImg} alt="no results" />
            <h5>No results found.</h5>
          </div>
        }
      </div>
    </div>
  )
}
