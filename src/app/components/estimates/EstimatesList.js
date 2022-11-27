import { estimatesIndex } from "app/algolia"
import { useInstantSearch } from "app/hooks/searchHooks"
import { StoreContext } from "app/store/store"
import React, { useContext } from 'react'
import AppPagination from "../ui/AppPagination"
import AppTable from "../ui/AppTable"
import EstimateRow from "./EstimateRow"

export default function EstimatesList(props) {

  const { setPageLoading } = useContext(StoreContext)
  const { query, searchResults, setSearchResults, filters, setNumOfHits,
    setNumOfPages, pageNum, setPageNum, numOfPages, hitsPerPage, showAll,
    dbEstimates } = props

  const estimates = useInstantSearch(
    query,
    searchResults,
    setSearchResults,
    estimatesIndex,
    filters,
    setNumOfHits,
    setNumOfPages,
    pageNum,
    hitsPerPage,
    setPageLoading,
    showAll
  )

  const estimatesList = estimates?.map((estimate, index) => {
    return (
      <EstimateRow
        key={index}
        estimate={estimate}
      />
    )
  })

  const dbEstimatesList = dbEstimates?.map((estimate, index) => {
    return (
      <EstimateRow
        key={index}
        estimate={estimate}
      />
    )
  })

  return (
    <div className="invoices-list">
      <AppTable
        headers={[
          "Estimate #",
          "Title",
          "Client",
          "Items",
          "Total",
          "Date Created",
          '',
          'Actions'
        ]}
        rows={query?.length ? estimatesList : dbEstimatesList}
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
