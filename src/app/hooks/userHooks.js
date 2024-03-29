import React, { useEffect, useState } from 'react'
import { doGetUserByID, getScheduledEventsByUserID, getUserByID, getUserContactSettingsByID, 
  getUserEmailSettingsByID, 
  getUserEstimateSettingsByID, getUserGeneralSettingsByID, getUserInvoiceSettingsByID, getUserNotifSettingsByID } from "app/services/userServices"

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

export const useUserInvoiceSettings = (userID) => {

  const [userSettings, setUserSettings] = useState(null)

  useEffect(() => {
    if(userID) {
      getUserInvoiceSettingsByID(userID, setUserSettings)
    }
  },[userID])

  return userSettings
}

export const useUserEstimateSettings = (userID) => {

  const [userSettings, setUserSettings] = useState(null)

  useEffect(() => {
    if(userID) {
      getUserEstimateSettingsByID(userID, setUserSettings)
    }
  },[userID])

  return userSettings
}

export const useUserContactSettings = (userID) => {

  const [userSettings, setUserSettings] = useState(null)

  useEffect(() => {
    if(userID) {
      getUserContactSettingsByID(userID, setUserSettings)
    }
  },[userID])

  return userSettings
}

export const useUserNotifSettings = (userID) => {

  const [userSettings, setUserSettings] = useState(null)

  useEffect(() => {
    if(userID) {
      getUserNotifSettingsByID(userID, setUserSettings)
    }
  },[userID])

  return userSettings
}

export const useUserGeneralSettings = (userID) => {

  const [userSettings, setUserSettings] = useState(null)

  useEffect(() => {
    if(userID) {
      getUserGeneralSettingsByID(userID, setUserSettings)
    }
  },[userID])

  return userSettings
}

export const useUserEmailSettings = (userID) => {

  const [userSettings, setUserSettings] = useState(null)

  useEffect(() => {
    if(userID) {
      getUserEmailSettingsByID(userID, setUserSettings)
    }
  },[userID])

  return userSettings
}

export const useScheduledEvents = (userID, limit) => {

  const [scheduledEvents, setScheduledEvents] = useState(null)

  useEffect(() => {
    if(userID) {
      getScheduledEventsByUserID(userID, setScheduledEvents, limit)
    }
  },[userID, limit])

  return scheduledEvents
}