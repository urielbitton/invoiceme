import React, { useContext } from 'react'
import './styles/AppContainer.css'
import { StoreContext } from "app/store/store"
import PageLoader from "app/components/ui/PageLoader"
import RoutesContainer from "./RoutesContainer"
import Sidebar from "app/components/layout/Sidebar"
import Navbar from "app/components/layout/Navbar"

export default function AppContainer() {

  const { darkMode, pageLoading } = useContext(StoreContext)

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
