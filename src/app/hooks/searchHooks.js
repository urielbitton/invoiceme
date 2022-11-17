import React, { useEffect } from 'react'

export function useInstantSearch(query, searchResults, setSearchResults, indexName, filters, 
  setNumOfHits, setNumOfPages, page, hitsPerPage, setLoading) {

  useEffect(() => {
    if(query?.length) {
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
  },[query, filters, page, hitsPerPage])

  return searchResults
}

