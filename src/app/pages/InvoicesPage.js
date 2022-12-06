import InvoicesList from "app/components/invoices/InvoicesList"
import AppSelectBar from "app/components/ui/AppSelectBar"
import { StoreContext } from "app/store/store"
import React, { useContext, useEffect, useState } from 'react'
import './styles/InvoicesPage.css'
import noResultsImg from 'app/assets/images/no-results.png'
import { useInvoiceYearOptions, useYearMonthOrAllInvoices } from "app/hooks/invoiceHooks"
import HelmetTitle from "app/components/ui/HelmetTitle"
import AppButton from "app/components/ui/AppButton"
import { monthSelectOptions } from "app/data/general"
import { useCurrentMonthInvoices } from "app/hooks/statsHooks"
import { getNumOfDaysInMonth } from "app/utils/dateUtils"
import EmptyPage from "app/components/ui/EmptyPage"

export default function InvoicesPage() {

  const { myUser, myUserID, setNavItem1, setNavItem2,
    setNavItem3, setNavItemInfo } = useContext(StoreContext)
  const yearSelectOptions = useInvoiceYearOptions()
  const [searchString, setSearchString] = useState("")
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [numOfPages, setNumOfPages] = useState(1)
  const [pageNum, setPageNum] = useState(0)
  const [numOfHits, setNumOfHits] = useState(0)
  const [hitsPerPage, setHitsPerPage] = useState(10)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState('all')
  const limitsNum = 10
  const [invoicesLimit, setInvoicesLimit] = useState(limitsNum)
  const date = new Date()
  const monthStart = `${date.getMonth() + 1}, 01, ${date.getFullYear()}`
  const monthEnd = `${date.getMonth() + 1}, ${getNumOfDaysInMonth(date)}, ${date.getFullYear()}`
  const dbInvoices = useYearMonthOrAllInvoices(myUserID, selectedYear, selectedMonth, invoicesLimit)
  const thisMonthInvoices = useCurrentMonthInvoices(monthStart, monthEnd)
  const paidInvoices = dbInvoices?.filter(invoice => invoice?.isPaid)
  const filters = `invoiceOwnerID:${myUserID}`
  const showAll = false

  const labelText1 = query.length > 0 ?
    <>Showing <span className="bold">{hitsPerPage < numOfHits ? hitsPerPage :
      numOfHits}</span> of {numOfHits} invoices</> :
    <>Showing <span className="bold">
      {invoicesLimit <= dbInvoices?.length ? invoicesLimit : dbInvoices?.length}
    </span> of {dbInvoices?.length} invoices</>

  const executeSearch = (e) => {
    if (e.key === 'Enter') {
      setQuery(searchString)
    }
  }

  const handleOnChange = (e) => {
    if (e.target.value.length < 1) {
      setQuery('')
    }
    setSearchString(e.target.value)
  }

  useEffect(() => {
    setNavItem1({ label: "Total Invoices", icon: 'fas fa-file-invoice-dollar', value: myUser?.invoicesNum })
    setNavItem2({ label: "This Month", icon: 'fas fa-calendar-alt', value: thisMonthInvoices?.length })
    setNavItem3({ label: "Invoices Paid", icon: 'fas fa-receipt', value: `${paidInvoices?.length}/${dbInvoices?.length}` })
    setNavItemInfo({
      label: <AppButton
        label="Invoices Settings"
        buttonType="invertedBtn"
        leftIcon="fas fa-cog"
        url="/settings/invoices"
        className="nav-btn"
      />
    })
    return () => {
      setNavItem1(null)
      setNavItem2(null)
      setNavItem3(null)
      setNavItemInfo(null)
    }
  }, [myUser, thisMonthInvoices, invoicesLimit])

  return dbInvoices?.length > 0 ? (
    <div className="invoices-page">
      <HelmetTitle title="Invoices" />
      <AppSelectBar
        labelText1={labelText1}
        searchQuery={query}
        sortSelectOptions={[
          { value: 'date', label: 'Invoice Date' },
          { value: 'client', label: 'Client Name' },
          { value: 'amount', label: 'Invoice Total' },
        ]}
        rightComponent={query.length > 0 && <i className="fas fa-file-search search-mode-icon" />}
        searchValue={searchString}
        searchOnChange={(e) => handleOnChange(e)}
        handleOnKeyPress={(e) => executeSearch(e)}
        showAmountSelect
        amountSelectValue={invoicesLimit}
        amountSelectOnChange={(e) => {
          setInvoicesLimit(e.target.value)
          setHitsPerPage(e.target.value)
        }}
        searchPlaceholder="Search Invoices"
        yearSelectOptions={yearSelectOptions}
        monthSelectOptions={monthSelectOptions}
        yearValue={selectedYear}
        yearOnChange={(e) => setSelectedYear(e.target.value)}
        monthValue={selectedMonth}
        monthOnChange={(e) => setSelectedMonth(e.target.value)}
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
          invoicesLimit <= dbInvoices?.length &&
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
  ) :
    <EmptyPage
      label="You have no invoices yet."
      sublabel="Add your first invoice to view it here."
      btnLink="/invoices/new"
      btnIcon="fal fa-plus"
    />
}
