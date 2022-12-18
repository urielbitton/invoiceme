import { StoreContext } from "app/store/store"
import React, { useContext, useEffect } from 'react'

export default function HelpAndSupport() {

  const { setCompactNav } = useContext(StoreContext)

  useEffect(() => {
    setCompactNav(true)
    return () => setCompactNav(false)
  },[])

  return (
    <div>HelpAndSupport</div>
  )
}
