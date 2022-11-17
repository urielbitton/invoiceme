import React, { useEffect, useState } from 'react'
import { doGetUserByID, getUserByID } from "app/services/userServices"

export default function useUser(userID) {

  const [appUser, setAppUser] = useState(null)

  useEffect(() => {
    if(userID) {
      getUserByID(userID, setAppUser)
    }
  },[userID])

  return appUser
}

export function useUsers(userIDs) {

  const [appUsers, setAppUsers] = useState(null)

  useEffect(() => {
    if(userIDs?.length) {
      const promises = userIDs.map(userID => doGetUserByID(userID))
      Promise.all(promises).then(users => {
        setAppUsers(users)
      })
    }
  },[userIDs])

  return appUsers
}
