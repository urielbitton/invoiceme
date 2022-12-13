import UnverifiedEmailPage from "app/pages/UnverifiedEmailPage"
import UserManagement from "app/pages/UserManagement"
import React from 'react'
import { Route, Routes } from "react-router-dom"

export default function VerifySwitcher() {
  return (
    <Routes>
      <Route path="user-management/*" element={<UserManagement />} />
      <Route path="*" element={<UnverifiedEmailPage />} />
    </Routes>
  )
}
