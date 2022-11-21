import React, { useContext, useEffect } from 'react'
import './styles/AppContainer.css'
import { StoreContext } from "app/store/store"
import PageLoader from "app/components/ui/PageLoader"
import RoutesContainer from "./RoutesContainer"
import Sidebar from "app/components/layout/Sidebar"
import Navbar from "app/components/layout/Navbar"
import { useNavigate } from "react-router-dom"

export default function AppContainer() {

  const { darkMode, pageLoading } = useContext(StoreContext)
  const navigate = useNavigate()

  useEffect(() => {
    document.body.onkeyup = function(e) {
      if (e.ctrlKey && e.key === 'i') {
        navigate('/invoices/new')
      } 
    }
    return () => document.body.onkeyup = null
  },[])

  return (
    <div className={`app-container ${ darkMode ? "dark-app" : "" }`}>
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <RoutesContainer />
      </div>
      <PageLoader loading={pageLoading} />
    </div>
  )
}
