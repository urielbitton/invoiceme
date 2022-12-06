import AppSelectBar from "app/components/ui/AppSelectBar"
import { StoreContext } from "app/store/store"
import React, { useContext, useEffect, useState } from 'react'
import './styles/InvoicesPage.css'
import noResultsImg from 'app/assets/images/no-results.png'
import HelmetTitle from "app/components/ui/HelmetTitle"
import AppButton from "app/components/ui/AppButton"
import ContactsList from "app/components/contacts/ContactsList"
import { monthSelectOptions } from "app/data/general"
import { useCurrentMonthContacts } from "app/hooks/statsHooks"
import { useContactYearOptions, useYearMonthOrAllContacts } from "app/hooks/contactsHooks"
import { getNumOfDaysInMonth } from "app/utils/dateUtils"
import EmptyPage from "app/components/ui/EmptyPage"

export default function ContactsPage() {

  const { myUser, myUserID, setNavItem1, setNavItem2, setNavItemInfo } = useContext(StoreContext)
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
  const [contactsLimit, setContactsLimit] = useState(limitsNum)
  const date = new Date()
  const monthStart = `${date.getMonth() + 1}, 01, ${date.getFullYear()}`
  const monthEnd = `${date.getMonth() + 1}, ${getNumOfDaysInMonth(date)}, ${date.getFullYear()}`
  const dbContacts = useYearMonthOrAllContacts(myUserID, selectedYear, selectedMonth, contactsLimit)
  const thisMonthContacts = useCurrentMonthContacts(monthStart, monthEnd)
  const yearSelectOptions = useContactYearOptions()
  const filters = `ownerID:${myUserID}`
  const showAll = false

  const labelText1 = query.length > 0 ?
    <>Showing <span className="bold">{hitsPerPage < numOfHits ? hitsPerPage : numOfHits}</span> of {numOfHits} contacts</> :
    <>Showing <span className="bold">
      {contactsLimit <= dbContacts?.length ? contactsLimit : dbContacts?.length}
    </span> of {dbContacts?.length} contacts</>

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
    setNavItem1({ label: "Total Contacts", icon: 'fas fa-users', value: myUser?.contactsNum })
    setNavItem2({ label: "This Month", icon: 'fas fa-calendar-alt', value: thisMonthContacts?.length })
    setNavItemInfo({
      label: <AppButton
        label="Contacts Settings"
        buttonType="invertedBtn"
        leftIcon="fas fa-cog"
        url="/settings/contacts"
        className="nav-btn"
      />
    })
    return () => {
      setNavItem1(null)
      setNavItem2(null)
      setNavItemInfo(null)
    }
  }, [myUser, thisMonthContacts])

  return (
    dbContacts?.length > 0 ?
    <div className="invoices-page contacts-page">
      <HelmetTitle title="Contacts" />
      <AppSelectBar
        labelText1={labelText1}
        searchQuery={query}
        sortSelectOptions={[
          { value: 'date', label: 'Date Created' },
          { value: 'name', label: 'Contact Name' },
        ]}
        rightComponent={query.length > 0 && <i className="fas fa-file-search search-mode-icon" />}
        searchValue={searchString}
        searchOnChange={(e) => handleOnChange(e)}
        handleOnKeyPress={(e) => executeSearch(e)}
        showAmountSelect
        amountSelectValue={contactsLimit}
        amountSelectOnChange={(e) => {
          setContactsLimit(e.target.value)
          setHitsPerPage(e.target.value)
        }}
        searchPlaceholder="Search Contacts"
        yearSelectOptions={yearSelectOptions}
        monthSelectOptions={monthSelectOptions}
        yearValue={selectedYear}
        yearOnChange={(e) => setSelectedYear(e.target.value)}
        monthValue={selectedMonth}
        monthOnChange={(e) => setSelectedMonth(e.target.value)}
      />
      <div className="invoices-content">
        <ContactsList
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
          dbContacts={dbContacts}
        />
        {
          contactsLimit <= dbContacts?.length &&
          <AppButton
            label="Show More"
            onClick={() => setContactsLimit(contactsLimit + limitsNum)}
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
    </div> :
    <EmptyPage
      label="You have no contacts yet."
      sublabel="Add your first contact to view it here."
      btnLink="/contacts/new"
      btnIcon="fal fa-plus"
    />
  )
}
