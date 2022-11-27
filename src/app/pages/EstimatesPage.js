import AppSelectBar from "app/components/ui/AppSelectBar"
import { StoreContext } from "app/store/store"
import React, { useContext, useEffect, useState } from 'react'
import './styles/InvoicesPage.css'
import noResultsImg from 'app/assets/images/no-results.png'
import HelmetTitle from "app/components/ui/HelmetTitle"
import AppButton from "app/components/ui/AppButton"
import { useEstimates } from "app/hooks/estimateHooks"
import EstimatesList from "app/components/estimates/EstimatesList"

export default function EstimatesPage() {

  const { myUser, myUserID, setNavItem1, setNavItem2 } = useContext(StoreContext)
  const [searchString, setSearchString] = useState("")
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [numOfPages, setNumOfPages] = useState(1)
  const [pageNum, setPageNum] = useState(0)
  const [numOfHits, setNumOfHits] = useState(0)
  const [hitsPerPage, setHitsPerPage] = useState(10)
  const limitsNum = 10
  const [estimatesLimit, setEstimatesLimit] = useState(limitsNum)
  const dbEstimates = useEstimates(myUserID, estimatesLimit)
  const filters = `estimateOwnerID:${myUserID}`
  const showAll = false

  const labelText1 = query.length > 0 ? 
    <>Showing <span className="bold">{hitsPerPage < numOfHits ? hitsPerPage : numOfHits}</span> of {numOfHits} estimates</> :
    <>Showing <span className="bold">
      {estimatesLimit <= myUser?.estimatesNum ? estimatesLimit : myUser?.estimatesNum}
    </span> of {myUser?.estimatesNum} estimates</>

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
    setNavItem1({ label: "Total Estimates", icon: 'fas fa-file-invoice', value: myUser?.estimatesNum })
    setNavItem2({ label: "This Month", icon: 'fas fa-calendar-alt', value: 0 })
    return () => {
      setNavItem1(null)
      setNavItem2(null)
    }
  },[myUser])

  return (
    <div className="invoices-page">
      <HelmetTitle title="Estimates" />
      <AppSelectBar
        labelText1={labelText1}
        sortSelectOptions={[
          { value: 'date', label: 'Estimate Date' },
          { value: 'client', label: 'Client Name' },
          { value: 'amount', label: 'Estimate Total' },
        ]}
        rightComponent={query.length > 0 && <i className="fas fa-file-search search-mode-icon"/>}
        searchValue={searchString}
        searchOnChange={(e) => handleOnChange(e)}
        handleOnKeyPress={(e) => executeSearch(e)}
        showAmountSelect
        amountSelectValue={estimatesLimit}
        amountSelectOnChange={(e) => setEstimatesLimit(e.target.value)}
        searchPlaceholder="Search Estimates"
      />
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
          estimatesLimit < myUser?.estimatesNum &&
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
      </div>
    </div>
  )
}
