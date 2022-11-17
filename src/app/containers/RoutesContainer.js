import React from 'react'
import './styles/RoutesContainer.css'
import ErrorPage from "app/pages/ErrorPage"
import HomePage from 'app/pages/HomePage'
import { Routes, Route } from "react-router"

export default function RoutesContainer() {

  return (
    <div className="routes-container">
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  )
}
