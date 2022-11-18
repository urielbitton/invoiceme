import { algoliaSearchClient } from "app/algolia"
import React, { useEffect, useState } from 'react'

export function useInstantSearch(query, searchResults, setSearchResults, indexName, filters, 
  setNumOfHits, setNumOfPages, page, hitsPerPage, setLoading, showAll) {

  useEffect(() => {
    if (query?.length || showAll) {
      setLoading(true)
      indexName.search(query, {
        filters,
        page,
        hitsPerPage
      })
      .then((result) => {
        setSearchResults(result.hits)
        setNumOfHits(result.nbHits)
        setNumOfPages(result.nbPages)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
    }
  }, [query, filters, page, hitsPerPage])

  return searchResults
}

export const useMultipleQueries = (multipleQueries, multipleQueriesLimit, allowFetch, setLoading) => {

  const [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    if (allowFetch) {
      setLoading(true)
      algoliaSearchClient.multipleQueries(multipleQueries, {
        strategy: 'stopIfEnoughMatches'
      })
      .then((results) => {
        setSearchResults(results.results)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
    }
  }, [allowFetch, multipleQueriesLimit])

  return searchResults
}