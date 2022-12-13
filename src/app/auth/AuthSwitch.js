import UserManagement from "app/pages/UserManagement"
import React from 'react'
import { Route, Routes } from "react-router-dom"
import ForgotPassword from "./ForgotPassword"
import Login from "./Login"
import Register from "./Register"
import ResetPassword from "./ResetPassword"

export default function AuthSwitch() {
  return (
    <Routes>
      <Route path="*" element={<Login />} />
      <Route path="/register" element={<Register />}/>
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/user-management" element={<UserManagement />} />
    </Routes>
  )
}
