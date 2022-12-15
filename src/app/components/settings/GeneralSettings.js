import { currencies, themeColors } from "app/data/general"
import { infoToast } from "app/data/toastsTemplates"
import { updateDB } from "app/services/CrudDB"
import { StoreContext } from "app/store/store"
import React, { useContext, useEffect, useState } from 'react'
import AppButton from "../ui/AppButton"
import { AppSelect, AppSwitch } from "../ui/AppInputs"
import SettingsSection from "./SettingsSection"
import SettingsTitles from "./SettingsTitles"

export default function GeneralSettings() {

  const { myUserID, myUser, themeColor, setThemeColor,
    darkMode, setDarkMode, setPageLoading } = useContext(StoreContext)
  const [currency, setCurrency] = useState('CAD')
  const currencyObject = currencies.find(c => c.value === currency) || currencies[0]

  const saveSettings = () => {
    setPageLoading(true)
    document.documentElement.style.setProperty('--primary', themeColor)
    localStorage.setItem('themeColor', themeColor)
    updateDB('users', myUserID, {
      currency: currencyObject
    })
      .then(() => {
        updateDB(`users/${myUserID}/settings`, 'general', {
          themeColor,
        })
          .then(() => {
            setPageLoading(false)
          })
          .catch(err => {
            console.log(err)
            setPageLoading(false)
          })
      })
      .catch(err => {
        setPageLoading(false)
        console.log(err)
      })
  }

  useEffect(() => {
    setCurrency(myUser?.currency?.value || 'CAD')
  }, [myUser])

  return (
    <div className="settings-sub-page">
      <SettingsTitles
        label="General"
        sublabel="Fine tune your own experience on the app"
        icon="fas fa-cog"
      />
      <SettingsSection
        label="Language"
        sublabel="Choose your preferred language"
        className="language"
      >
        <AppSelect
          options={[
            { value: 'en', label: 'English' },
          ]}
        />
      </SettingsSection>
      <SettingsSection
        label="Currency"
        sublabel="Set your preferred currency"
        className="currency"
      >
        <AppSelect
          options={currencies}
          value={currency}
          onChange={e => setCurrency(e.target.value)}
        />
      </SettingsSection>
      <SettingsSection
        label="Theme"
        sublabel="Choose your preferred theme"
        flexStart
        className="theme"
      >
        <AppSelect
          options={themeColors}
          value={themeColor}
          onChange={e => setThemeColor(e.target.value)}
        />
        <div style={{display:'flex', gap:15}}>
          <AppButton
            label="Preview"
            onClick={() => document.documentElement.style.setProperty('--primary', themeColor)}
            leftIcon="far fa-eye"
            disabled={themeColor === '#178fff'}
          />
          <AppButton
            label="Reset"
            onClick={() => {
              document.documentElement.style.setProperty('--primary', '#178fff')
              setThemeColor('#178fff')
            }}
            leftIcon="far fa-undo"
            disabled={themeColor === '#178fff'}
          />
        </div>
      </SettingsSection>
      <SettingsSection
        label="Dark Mode"
        sublabel="Toggle dark mode"
        className="darkMode"
      >
        <AppSwitch
          checked={darkMode}
          onChange={() => setDarkMode(prev => !prev)}
        />
      </SettingsSection>
      <div className="btn-group">
        <AppButton
          label="Save"
          onClick={saveSettings}
        />
      </div>
    </div>
  )
}
