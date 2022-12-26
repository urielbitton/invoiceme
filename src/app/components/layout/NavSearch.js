import {
  badgeSwitch, iconSwitch, titlePropSwitch,
  linkSwitch,
  secondPathPropSwitch
} from "app/data/searchSwitches"
import { useMultipleQueries } from "app/hooks/searchHooks"
import { StoreContext } from "app/store/store"
import React, { useContext, useState } from 'react'
import { Link } from "react-router-dom"
import AppBadge from "../ui/AppBadge"
import AppButton from "../ui/AppButton"
import { AppInput } from "../ui/AppInputs"
import IconContainer from "../ui/IconContainer"

export default function NavSearch() {

  const { myUserID, myUser } = useContext(StoreContext)
  const [searchString, setSearchString] = useState('')
  const [query, setQuery] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [totalResults, setTotalResults] = useState(0)
  const limitsNum = 5
  const [invoicesLimit, setInvoicesLimit] = useState(limitsNum)
  const [estimatesLimit, setEstimatesLimit] = useState(limitsNum)
  const [contactsLimit, setContactsLimit] = useState(limitsNum)
  const [paymentsLimit, setPaymentsLimit] = useState(limitsNum)
  const [emailsLimit, setEmailsLimit] = useState(limitsNum)
  const [settingsLimit, setSettingsLimit] = useState(limitsNum)
  const indexTrio = 'invoices_index estimates_index contacts_index'

  const loadMoreSwitch = (index) => {
    if (index === 'invoices_index') setInvoicesLimit(prev => prev + 5)
    if (index === 'estimates_index') setEstimatesLimit(prev => prev + 5)
    if (index === 'contacts_index') setContactsLimit(prev => prev + 5)
    if (index === 'payments_index') setPaymentsLimit(prev => prev + 5)
    if (index === 'emails_index') setEmailsLimit(prev => prev + 5)
    if (index === 'settings_index') setSettingsLimit(prev => prev + 5)
  }

  const limitsSwitch = (index) => {
    if (index === 'contacts_index') return contactsLimit
    if (index === 'invoices_index') return invoicesLimit
    if (index === 'estimates_index') return estimatesLimit
    if (index === 'payments_index') return paymentsLimit
    if (index === 'emails_index') return emailsLimit
    if (index === 'settings_index') return settingsLimit
  }

  const multipleQueries = [
    {
      indexName: 'invoices_index',
      query,
      params: {
        hitsPerPage: invoicesLimit,
        filters: `invoiceOwnerID: ${myUserID}`
      }
    },
    {
      indexName: 'estimates_index',
      query,
      params: {
        hitsPerPage: estimatesLimit,
        filters: `estimateOwnerID: ${myUserID}`
      }
    },
    {
      indexName: 'contacts_index',
      query,
      params: {
        hitsPerPage: contactsLimit,
        filters: `ownerID: ${myUserID}`
      }
    },
    {
      indexName: 'payments_index',
      query,
      params: {
        hitsPerPage: paymentsLimit,
        filters: `ownerID: ${myUserID}`
      }
    },
    {
      indexName: 'emails_index',
      query,
      params: {
        hitsPerPage: emailsLimit,
        filters: `from: ${myUser?.email} OR to: ${myUser?.email}}`
      }
    },
    {
      indexName: 'settings_index',
      query,
      params: {
        hitsPerPage: settingsLimit,
        filters: ''
      }
    }
  ]

  const bundledLimits = [invoicesLimit, estimatesLimit, contactsLimit, paymentsLimit, emailsLimit, settingsLimit]

  const resultsQueries = useMultipleQueries(
    query,
    setTotalResults,
    multipleQueries,
    bundledLimits,
    setSearchLoading
  )
  const allResults = [...resultsQueries?.map(query => query.hits)?.flat()]

  const allResultsList = resultsQueries
    ?.filter(result => result.hits?.length > 0)
    .map((result, i) => {
      return <div 
        className="nav-search-dropdown-section"
        key={i}
      >
        <h5 className="capitalize">{badgeSwitch(result.index)}</h5>
        {
          result.hits?.map((hit, i) => {
            return <div
              key={`${result.index}-${i}`}
              className="nav-search-dropdown-item"
            >
              <Link 
                to={`${result.index === 'settings_index' ? hit.pageURL : linkSwitch(result.index)}/${indexTrio.includes(result.index) ? hit[secondPathPropSwitch(result.index)] : ''}`}
                onClick={() => resetSearch()}
              >
                <div className="side">
                  <IconContainer
                    icon={iconSwitch(result.index)}
                    dimensions="25px"
                    bgColor="var(--darkGrayText)"
                    iconColor="#fff"
                    iconSize="15px"
                    round={false}
                  />
                  <h6>{hit[titlePropSwitch(result.index)]}</h6>
                </div>
                <div className="side">
                  <AppBadge
                    label={badgeSwitch(result.index)}
                    noIcon
                  />
                </div>
              </Link>
            </div>
          })
        }
        {
          result?.nbHits > limitsSwitch(result.index) &&
          <AppButton
            buttonType="tabBlueBtn"
            label="Load More"
            onClick={() => loadMoreSwitch(result.index)}
          />
        }
      </div>
    })

  const resetSearch = () => {
    setSearchString('')
    setQuery('')
  }

  return (
    <div className="nav-search">
      <AppInput
        placeholder="Search"
        iconright={!searchLoading ? searchString.length > 0 ?
          <i
            className="fal fa-times"
            onClick={(e) => {
              e.preventDefault()
              resetSearch()
            }}
          /> :
          <i className="fal fa-search" /> :
          <i className="fal fa-spinner fa-spin" />
        }
        onChange={(e) => setSearchString(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && setQuery(searchString)}
        value={searchString}
        enterKeyHint="go"
      />
      <div className={`nav-search-dropdown ${query?.length > 0 && searchString.length > 0 ? 'show' : ''}`}>
        <h4>
          <span>Showing {allResults?.length} of {totalResults} results.</span>
          <i 
            className="fal fa-times" 
            onClick={() => resetSearch()} 
          />
        </h4>
        {
          allResults?.length > 0 && query?.length > 0 ?
          allResultsList :
          <p>No results found.</p>
        }
      </div>
    </div>
  )
}
