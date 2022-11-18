import { StoreContext } from "app/store/store"
import React, { useContext, useEffect } from 'react'

export default function NavItemsInit(props) {

  const { setNavItem1, setNavItem2, setNavItem3, setNavItemInfo } = useContext(StoreContext)
  const { navItem1, navItem2, navItem3, navItemInfo } = props
  
  useEffect(() => {
    setNavItem1(navItem1 ? { 
      label: navItem1?.label, 
      icon: navItem1?.icon,
      value: navItem1?.value,
    } : null)
    setNavItem2(navItem2 ? {
      label: navItem2?.label,
      icon: navItem2?.icon,
      value: navItem2?.value,
    } : null)
    setNavItem3(navItem3 ? {
      label: navItem3?.label,
      icon: navItem3?.icon,
      value: navItem3?.value,
    } : null)
    setNavItemInfo(navItemInfo ? {
      label: navItemInfo?.label,
      sublabel: navItemInfo?.sublabel,
      value: navItemInfo?.value,
    } : null)
    return () => {
      setNavItem1(null)
      setNavItem2(null)
      setNavItem3(null)
      setNavItemInfo(null)
    }
  },[])

  return null
}
