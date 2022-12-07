import AppSelectBar from "app/components/ui/AppSelectBar"
import { StoreContext } from "app/store/store"
import React, { useContext, useEffect, useState } from 'react'
import './styles/InvoicesPage.css'
import noResultsImg from 'app/assets/images/no-results.png'
import HelmetTitle from "app/components/ui/HelmetTitle"
import AppButton from "app/components/ui/AppButton"
import { useEstimateYearOptions, useYearMonthOrAllEstimates } from "app/hooks/estimateHooks"
import EstimatesList from "app/components/estimates/EstimatesList"
import { useCurrentMonthEstimates } from "app/hooks/statsHooks"
import { monthSelectOptions } from "app/data/general"
import { getNumOfDaysInMonth } from "app/utils/dateUtils"
import EmptyPage from "app/components/ui/EmptyPage"

export default function EstimatesPage() {

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
  const [estimatesLimit, setEstimatesLimit] = useState(limitsNum)
  const date = new Date()
  const monthStart = `${date.getMonth() + 1}, 01, ${date.getFullYear()}`
  const monthEnd = `${date.getMonth() + 1}, ${getNumOfDaysInMonth(date)}, ${date.getFullYear()}`
  const dbEstimates = useYearMonthOrAllEstimates(myUserID, selectedYear, selectedMonth, estimatesLimit)
  const thisMonthEstimates = useCurrentMonthEstimates(monthStart, monthEnd)
  const yearSelectOptions = useEstimateYearOptions()
  const filters = `estimateOwnerID:${myUserID}`
  const showAll = false

  const labelText1 = query.length > 0 ?
    <>Showing <span className="bold">{hitsPerPage < numOfHits ? hitsPerPage : numOfHits}</span> of {numOfHits} estimates</> :
    <>Showing <span className="bold">
      {estimatesLimit <= dbEstimates?.length ? estimatesLimit : dbEstimates?.length}
    </span> of {dbEstimates?.length} estimates</>

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
    setNavItem1({ label: "Total Estimates", icon: 'fas fa-file-invoice', value: myUser?.estimatesNum })
    setNavItem2({ label: "This Month", icon: 'fas fa-calendar-alt', value: thisMonthEstimates?.length })
    setNavItemInfo({
      label: <AppButton
        label="Estimates Settings"
        buttonType="invertedBtn"
        leftIcon="fas fa-cog"
        url="/settings/estimates"
        className="nav-btn"
      />
    })
    return () => {
      setNavItem1(null)
      setNavItem2(null)
      setNavItemInfo(null)
    }
  }, [myUser, thisMonthEstimates])

  return (
    <div className="invoices-page">
      <HelmetTitle title="Estimates" />
      <AppSelectBar
        labelText1={labelText1}
        searchQuery={query}
        sortSelectOptions={[
          { value: 'date', label: 'Estimate Date' },
          { value: 'client', label: 'Client Name' },
          { value: 'amount', label: 'Estimate Total' },
        ]}
        rightComponent={query.length > 0 && <i className="fas fa-file-search search-mode-icon" />}
        searchValue={searchString}
        searchOnChange={(e) => handleOnChange(e)}
        handleOnKeyPress={(e) => executeSearch(e)}
        showAmountSelect
        amountSelectValue={estimatesLimit}
        amountSelectOnChange={(e) => {
          setEstimatesLimit(e.target.value)
          setHitsPerPage(e.target.value)
        }}
        searchPlaceholder="Search Estimates"
        yearSelectOptions={yearSelectOptions}
        monthSelectOptions={monthSelectOptions}
        yearValue={selectedYear}
        yearOnChange={(e) => setSelectedYear(e.target.value)}
        monthValue={selectedMonth}
        monthOnChange={(e) => setSelectedMonth(e.target.value)}
      />
      {
        dbEstimates?.length > 0 ?
          <div className="invoices-content">
            <EstimatesList
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
              dbEstimates={dbEstimates}
            />
            {
              estimatesLimit <= dbEstimates?.length &&
              <AppButton
                label="Show More"
                onClick={() => setEstimatesLimit(estimatesLimit + limitsNum)}
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
          </div> :
          <EmptyPage
            label="No estimates found."
            sublabel="Refine your search or create a new estimate."
            btnLink="/estimates/new"
            btnIcon="fal fa-plus"
          />
      }
    </div>
  )
}
