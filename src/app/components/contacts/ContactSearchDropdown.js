import { useContactsSearch } from "app/hooks/searchHooks"
import { StoreContext } from "app/store/store"
import React, { useContext } from 'react'
import AppButton from "../ui/AppButton"
import Avatar from "../ui/Avatar"
import './styles/ContactSearchDropdown.css'

export default function ContactSearchDropdown(props) {

  const { myUser } = useContext(StoreContext)
  const { query, setQuery, loading, setLoading, filters, 
    onUserClick } = props

  const contacts = useContactsSearch(query, setLoading, filters)

  const usersResults = contacts
    ?.filter(contact => contact.email !== myUser?.email)
    .map((contact, index) => {
      return (
        <div
          key={index}
          className="user-row"
          onClick={() => onUserClick(contact)}
        >
          <Avatar
            src={contact.photoURL}
            dimensions={30}
            alt="user"
          />
          <h6>{contact.name}</h6>
          -
          <span>{contact.email}</span>
        </div>
      )
    })

  return (
    <div className="contact-search-container">
      <input
        type="Search"
        placeholder="Enter a name or email"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        enterKeyHint="go"
      />
      <AppButton
        buttonType="iconBtn"
        rightIcon={!loading ? 'far fa-search' : 'fas fa-spinner fa-spin'}
      />
      {
        query.length > 0 &&
        <div className="results-dropdown">
          {usersResults}
        </div>
      }
    </div>
  )
}
