import InvoicesList from "app/components/invoices/InvoicesList"
import NavItemsInit from "app/components/layout/NavItemsInit"
import SelectBar from "app/components/ui/SelectBar"
import { StoreContext } from "app/store/store"
import React, { useContext } from 'react'
import './styles/InvoicesPage.css'

export default function InvoicesPage() {

  const { myUser } = useContext(StoreContext)

  return (
    <div className="invoices-page">
      <NavItemsInit
        navItem1={{ label: "Total Invoices", icon: 'fas fa-file-invoice-dollar', value: myUser?.invoicesNum }}
        navItem2={{ label: "This Month", icon: 'fas fa-calendar-alt', value: 0 }}
      />
      <SelectBar

      />
      <div className="invoices-content">
        <InvoicesList />
      </div>
    </div>
  )
}
