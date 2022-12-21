import { settingsIndex } from "app/algolia"
import ContactsSettings from "app/components/settings/ContactsSettings"
import CreateScheduledInvoice from "app/components/settings/CreateScheduledInvoice"
import EmailsSettings from "app/components/settings/EmailsSettings"
import EstimatesSettings from "app/components/settings/EstimatesSettings"
import GeneralSettings from "app/components/settings/GeneralSettings"
import InvoicesSettings from "app/components/settings/InvoicesSettings"
import NotificationsSettings from "app/components/settings/NotificationsSettings"
import PaymentsSettings from "app/components/settings/PaymentsSettings"
import ScheduledInvoicesSettings from "app/components/settings/ScheduledInvoicesSettings"
import { AppInput } from "app/components/ui/AppInputs"
import AppTabsBar from "app/components/ui/AppTabsBar"
import HelmetTitle from "app/components/ui/HelmetTitle"
import PageTitleBar from "app/components/ui/PageTitleBar"
import { functions } from "app/firebase/fire"
import { useInstantSearch } from "app/hooks/searchHooks"
import { StoreContext } from "app/store/store"
import React, { useContext, useEffect, useState } from 'react'
import { NavLink, Route, Routes, 
  useLocation, useNavigate, useSearchParams } from "react-router-dom"
import './styles/SettingsPage.css'

export default function SettingsPage() {

  const { setCompactNav, setPageLoading } = useContext(StoreContext)
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [numOfPages, setNumOfPages] = useState(1)
  const [pageNum, setPageNum] = useState(0)
  const [numOfHits, setNumOfHits] = useState(0)
  const [hitsPerPage, setHitsPerPage] = useState(100)
  const [settingsLoading, setSettingsLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = ''
  const location = useLocation()
  const navigate = useNavigate()

  const settings = useInstantSearch(
    query,
    searchResults,
    setSearchResults,
    settingsIndex,
    filters,
    setNumOfHits,
    setNumOfPages,
    pageNum,
    hitsPerPage,
    setSettingsLoading,
    false
  )

  const settingsList = settings?.map((setting, index) => {
    return <div
      onClick={() => {
        setQuery('')
        navigate({ pathname: setting.pageURL, search: `goTo=${setting.settingID}` })
      }}
      key={index}
      className="settings-list-item"
    >
      <div className="left">
        <i className={setting.icon} />
      </div>
      <div className="right">
        <h5>{setting.label}</h5>
        <p>{setting.sublabel}</p>
      </div>
    </div>
  })

  useEffect(() => {
    setCompactNav(true)
    return () => setCompactNav(false)
  }, [])

  useEffect(() => {
    if (searchParams.get('goTo')) {
      const goTo = searchParams.get('goTo')
      const goToElement = document.querySelector(`.${goTo}`)
      goToElement?.scrollIntoView({ behavior: 'smooth' })
    }
  },[searchParams])

  return (
    <div className="settings-page">
      <HelmetTitle title="Settings" />
      <PageTitleBar
        title="Settings"
        rightComponent={
          <>
            <AppInput
              placeholder="Search settings..."
              onChange={e => setQuery(e.target.value)}
              value={query}
              type="search"
            />
            {
              query.length > 0 &&
              <div className="settings-results">
                {settingsList}
              </div>
            }
          </>
        }
      />
      <AppTabsBar
        noSpread
        spacedOut={15}
        sticky
      >
        <NavLink
          to=""
          className={location.pathname !== '/settings' ? 'not-active' : ''}
        >
          General
        </NavLink>
        <NavLink
          to="invoices"
        >
          Invoices
        </NavLink>
        <NavLink to="estimates">
          Estimates
        </NavLink>
        <NavLink to="contacts">
          Contacts
        </NavLink>
        <NavLink
          to="scheduled-invoices"
        >
          Scheduled Invoices
        </NavLink>
        <NavLink to="payments">
          Payments
        </NavLink>
        <NavLink to="notifications">
          Notifications
        </NavLink>
        <NavLink to="emails">
          Emails & SMS
        </NavLink>
      </AppTabsBar>
      <div className="settings-page-routes">
        <Routes>
          <Route path="" element={<GeneralSettings />} />
          <Route path="invoices" element={<InvoicesSettings />} />
          <Route path="estimates" element={<EstimatesSettings />} />
          <Route path="contacts" element={<ContactsSettings />} />
          <Route path="scheduled-invoices/*" element={<ScheduledInvoicesSettings />} />
          <Route path="payments" element={<PaymentsSettings />} />
          <Route path="notifications" element={<NotificationsSettings />} />
          <Route path="emails" element={<EmailsSettings />} />
          <Route path="scheduled-invoices/new/*" element={<CreateScheduledInvoice />} />
        </Routes>
      </div>
    </div>
  )
}
