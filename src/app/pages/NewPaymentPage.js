import AppButton from "app/components/ui/AppButton"
import HelmetTitle from "app/components/ui/HelmetTitle"
import { useContactsSearch } from "app/hooks/searchHooks"
import { StoreContext } from "app/store/store"
import React, { useContext, useState } from 'react'
import './styles/NewPaymentPage.css'

export default function NewPaymentPage() {

  const { myUserID } = useContext(StoreContext)
  const [searchString, setSearchString] = useState('')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const filters = `ownerID: ${myUserID}`

  const users = useContactsSearch(query, setLoading, filters)

  return (
    <div>
      <HelmetTitle title="New Payment" />
      <div className="new-payment-container">
        <h4>Send a Payment</h4>
        <div className="payment-options">
          <i className="fab fa-cc-visa"/>
          <i className="fab fa-cc-mastercard"/>
          <i className="fab fa-cc-amex"/>
          <i className="fab fa-cc-discover"/>
        </div>
        <div className="user-search-row">
          <input
            type="Search"
            placeholder="Enter a name or email"
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
          />
          <AppButton
            buttonType="iconBtn"
            rightIcon={!loading ? 'far fa-search' : 'fas fa-spinner fa-spin'}
            onClick={() => setQuery(searchString)}
          />
        </div>
      </div>
    </div>
  )
}
