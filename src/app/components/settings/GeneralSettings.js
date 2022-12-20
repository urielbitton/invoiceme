import { currencies, themeColors } from "app/data/general"
import { errorToast, infoToast, successToast } from "app/data/toastsTemplates"
import { useUserGeneralSettings } from "app/hooks/userHooks"
import { updateDB } from "app/services/CrudDB"
import { StoreContext } from "app/store/store"
import React, { useContext, useEffect, useState } from 'react'
import AppButton from "../ui/AppButton"
import { AppSelect, AppSwitch } from "../ui/AppInputs"
import SettingsSection from "./SettingsSection"
import SettingsTitles from "./SettingsTitles"

export default function GeneralSettings() {

  const { myUserID, myUser, themeColor, setThemeColor,
    darkMode, setDarkMode, setPageLoading, setToasts } = useContext(StoreContext)
  const [currency, setCurrency] = useState('CAD')
  const currencyObject = currencies.find(c => c.value === currency) || currencies[0]
  const myUserGeneralSettings = useUserGeneralSettings(myUserID)

  const allowSave = myUserGeneralSettings?.themeColor === undefined ||
  currency !== myUser?.currency?.value ||
    themeColor !== myUserGeneralSettings?.themeColor

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
            setToasts(successToast('Your settings have been saved.'))
          })
          .catch(err => {
            console.log(err)
            setPageLoading(false)
            setToasts(errorToast('There was an error while saving your settings. Please try again.'))
          })
      })
      .catch(err => {
        setPageLoading(false)
        console.log(err)
        setToasts(errorToast('There was an error while saving your settings. Please try again.'))
      })
  }

  useEffect(() => {
    setCurrency(myUser?.currency?.value || 'CAD')
  }, [myUser])

  useEffect(() => {
    if(myUserGeneralSettings?.themeColor !== undefined){
      setThemeColor(myUserGeneralSettings?.themeColor)
    }
  },[myUserGeneralSettings])
  

  return (
    <div className="settings-sub-page">
      <SettingsTitles
        label="General"
        sublabel="Fine tune your own experience on the app"
        icon="fas fa-cog"
        button={
          <AppButton
            label="Save Settings"
            onClick={saveSettings}
            disabled={!allowSave}
          />
        }
        isSticky
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
        <div style={{ display: 'flex', gap: 15 }}>
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
          onChange={() => {
            setDarkMode(prev => !prev)
            setToasts(infoToast(`Dark mode has been turned ${darkMode ? 'off' : 'on'}.`))
          }}
        />
      </SettingsSection>
    </div>
  )
}
