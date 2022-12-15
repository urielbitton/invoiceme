import AppToast from "app/components/ui/AppToast"
import { StoreContext } from "app/store/store"
import React, { useContext } from 'react'
import './styles/ToastsColumn.css'

export default function ToastsColumn() {

  const { toasts } = useContext(StoreContext)

  const toastsList = toasts?.map((toast, index) => {
    return <AppToast
      key={index}
      toast={toast}
    />
  })

  return (
    <div className="toasts-column">
      {toastsList}
    </div>
  )
}
