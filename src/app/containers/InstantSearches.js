import React from 'react'
import { InstantSearch } from "react-instantsearch-dom"
import { algoliaSearchClient } from "app/algolia"

export default function InstantSearches({ children }) {
  return (
    <>
      <InstantSearch
        indexName="invoices_index"
        searchClient={algoliaSearchClient}
      >
        {children}
      </InstantSearch>
    </>
  )
}
