import React, { createContext, useEffect, useState } from 'react'
import { auth } from 'app/firebase/fire'
import { getUserByID } from "app/services/userServices"
import { getNumOfDaysInMonth } from 'app/utils/dateUtils'

// @ts-ignore
export const StoreContext = createContext()

const StoreContextProvider = ({children}) => {
 
  const user = auth.currentUser
  const [myUser, setMyUser] = useState(null) 

  const date = new Date()
  const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
  const monthEnd = new Date(date.getFullYear(), date.getMonth(), getNumOfDaysInMonth(date))
  const yearStart = new Date(date.getFullYear(), 0, 1)
  const yearEnd = new Date(date.getFullYear(), 11, 31)

  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkmode') === "true" ? true : false)
  const [themeColor, setThemeColor] = useState(localStorage.getItem('themeColor') || "#178fff")
  const [contentScrollBottom, setContentScrollBottom] = useState(false)
  const [windowIsFocused, setWindowIsFocused] = useState(false)
  const [pageLoading, setPageLoading] = useState(false) 
  const myUserID = user?.uid
  const myUserImg = myUser?.photoURL
  const myUserName = `${myUser?.firstName} ${myUser?.lastName}`
  const myMemberType = myUser?.memberType
  const photoURLPlaceholder = 'https://firebasestorage.googleapis.com/v0/b/familia-app-1f5a8.appspot.com/o/admin%2Fprofile-placeholder.png?alt=media'
  const percentFormat = new Intl.NumberFormat('en-CA', {style: 'percent'})
  const [navItem1, setNavItem1] = useState(null)
  const [navItem2, setNavItem2] = useState(null)
  const [navItem3, setNavItem3] = useState(null)
  const [navItemInfo, setNavItemInfo] = useState(null)
  const [compactNav, setCompactNav] = useState(false)
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)
  const [toasts, setToasts] = useState([])
  const stripeCustomerPortalLink = 'https://billing.stripe.com/p/login/6oE9Da0qm0Sq8RGfYY'
  const businessMemberPlanID = 'price_1MBgssAp3OtccpN9TKmXnu5t'

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if(user) {
        getUserByID(user.uid, setMyUser)
      }
      else {
        setMyUser({})
      }
    })
  },[user])
  
  useEffect(() => {
    document.documentElement.style.setProperty('--primary', themeColor)
  },[])

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
    user, myUser, setMyUser, myUserID, myUserImg, myUserName, myMemberType,
    pageLoading, setPageLoading,
    darkMode, setDarkMode,
    percentFormat,
    contentScrollBottom, setContentScrollBottom, 
    photoURLPlaceholder,
    windowIsFocused,
    navItem1, setNavItem1, navItem2, setNavItem2, navItemInfo, 
    navItem3, setNavItem3, setNavItemInfo,
    compactNav, setCompactNav,
    themeColor, setThemeColor,
    showMobileSidebar, setShowMobileSidebar,
    stripeCustomerPortalLink, businessMemberPlanID,
    toasts, setToasts,
    monthStart, monthEnd, yearStart, yearEnd
  }}>
    {children}
  </StoreContext.Provider>
}
export default StoreContextProvider