import React, { createContext, useEffect, useState } from 'react'
import { auth } from 'app/firebase/fire'
import { getUserByID } from "app/services/userServices"

// @ts-ignore
export const StoreContext = createContext()

const StoreContextProvider = ({children}) => {
 
  const user = auth.currentUser
  const [myUser, setMyUser] = useState(null) 
  const [loggingAuth, setLoggingAuth] = useState(false)
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkmode') === "true" ? true : false)
  const [contentScrollBottom, setContentScrollBottom] = useState(false)
  const [windowIsFocused, setWindowIsFocused] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(false)
  const myUserID = user?.uid
  const myUserImg = myUser?.photoURL
  const myUserName = `${myUser?.firstName} ${myUser?.lastName}`
  const photoURLPlaceholder = 'https://firebasestorage.googleapis.com/v0/b/familia-app-1f5a8.appspot.com/o/admin%2Fprofile-placeholder.png?alt=media'
  const percentFormat = new Intl.NumberFormat('en-CA', {style: 'percent'})

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if(user) {
        setLoggingAuth(false)
        getUserByID(user.uid, setMyUser)
      }
      else {
        setMyUser(undefined)
      }
    })
  },[user])

  useEffect(() => {
    localStorage.setItem('darkmode', !darkMode ? "false" : "true")  
  },[darkMode])  

  useEffect(() => {
    document.addEventListener('visibilitychange', () => {
      if(document.visibilityState === 'visible') {
        setWindowIsFocused(true)
      }
      else {
        setWindowIsFocused(false)
      }
    })
  },[])

  return <StoreContext.Provider value={{ 
    user, myUser, setMyUser, myUserID, myUserImg, myUserName,
    loggingAuth, setLoggingAuth, 
    isPageLoading, setIsPageLoading,
    darkMode, setDarkMode,
    percentFormat,
    contentScrollBottom, setContentScrollBottom, 
    photoURLPlaceholder,
    windowIsFocused,
  }}>
    {children}
  </StoreContext.Provider>
}
export default StoreContextProvider