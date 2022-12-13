import { algoliaSearchClient, contactsIndex } from "app/algolia"
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

export const useMultipleQueries = (query, setTotalResults, queries, limit, setLoading) => {

  const [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    if (query?.length) {
      setLoading(true)
      algoliaSearchClient.multipleQueries(queries, {
        strategy: 'none',  
      })
        .then((results) => {
          setSearchResults(results.results)
          setTotalResults(results.results?.map(result => result.nbHits)?.reduce((a, b) => a + b, 0))
          setLoading(false)
        })
        .catch(err => {
          console.log(err)
          setLoading(false)
        })
    }
  }, [...limit, query])

  return searchResults
}

export function useContactsSearch(query, setLoading, filters) {

  const [results, setResults] = useState([])

  useEffect(() => {
    if (query?.length) {
      setLoading(true)
      contactsIndex.search(query, {
        filters,
      })
        .then((result) => {
          setLoading(false)
          setResults(result.hits)
        })
        .catch(err => {
          console.log(err)
          setLoading(false)
        })
    }
  }, [query, filters])

  return results
}