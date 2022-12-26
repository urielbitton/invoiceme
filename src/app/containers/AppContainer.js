import React, { useContext, useEffect } from 'react'
import './styles/AppContainer.css'
import './styles/DarkMode.css'
import { StoreContext } from "app/store/store"
import PageLoader from "app/components/ui/PageLoader"
import RoutesContainer from "./RoutesContainer"
import Sidebar from "app/components/layout/Sidebar"
import Navbar from "app/components/layout/Navbar"
import { useNavigate, useSearchParams } from "react-router-dom"
import HelmetTitle from "app/components/ui/HelmetTitle"
import PreventTabClose from "app/components/ui/PreventTabClose"

export default function AppContainer() {

  const { darkMode, pageLoading } = useContext(StoreContext)
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    document.body.onkeyup = function(e) {
      if (e.ctrlKey && e.key === 'i') {
        setSearchParams({})
        navigate('/invoices/new')
      } 
    }
    return () => document.body.onkeyup = null
  },[])

  return (
    <div className={`app-container ${ darkMode ? "dark-app" : "" }`}>
      <HelmetTitle />
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <RoutesContainer />
      </div>
      <PageLoader loading={pageLoading} />
      <PreventTabClose preventClose={pageLoading} />
    </div>
  )
}
