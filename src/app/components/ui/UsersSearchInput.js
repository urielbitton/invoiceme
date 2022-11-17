import React, { useEffect, useState } from 'react'
import './styles/UsersSearchInput.css'
import { usersSearchClient } from "app/algolia"
import { AppInput } from "./AppInputs"
import Avatar from "./Avatar"

export default function UsersSearchInput(props) {

  const { label, placeholder="Search users...", searchString, 
  setSearchString, selectedUsers, setSelectedUsers, existingMembers } = props
  const [searchResults, setSearchResults] = useState([])
  const usersIndex = usersSearchClient.initIndex('users_index')

  const searchResultsFiltered = searchResults?.filter(memberResult => {
    return memberResult.userID !== selectedUsers.find(user => user.userID === memberResult.userID)?.userID &&
    memberResult.userID !== existingMembers?.find(member => member.userID === memberResult?.userID)?.userID
  })

  const searchResultsRender = searchResultsFiltered?.map((userResult, i) => {
    return <div
      className="user-row-result"
      onClick={() => {
        setSelectedUsers([...selectedUsers, userResult])
        setSearchString('')
      }}
      key={i}
    >
      <Avatar
        img={userResult.photoURL}
        dimensions={30}
      />
      <h6>{userResult.firstName}&nbsp;{userResult.lastName}</h6>
    </div>
  })

  useEffect(() => {
    if(searchString.length) {
      usersIndex.search(searchString)
      .then((result) => {
        setSearchResults(result.hits)
      }) 
      .catch(err => console.log(err))
    }
  },[searchString])

  return (
    <div className="users-search-input-container">
      <AppInput
        label={label?.length && label}
        placeholder={placeholder}
        onChange={(e) => setSearchString(e.target.value)}
        value={searchString}
        iconright={
          !searchString.length ? 
          <i className="far fa-search"/> : 
          <i 
            className="fal fa-times"
            onClick={() => setSearchString('')}
          />
        }
      />
      {
        searchResults.length < 1 && searchString.length > 0 ?
        <h6>No Results.</h6> :
        <div className={`user-results-list ${!searchString.length ? 'hide' : ''}`}>
          {
            searchString.length ?
            searchResultsRender :
            null
          }
        </div>
      }
    </div>
  )
}
