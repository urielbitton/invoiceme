import { useUserContactSettings } from "app/hooks/userHooks"
import { updateDB } from "app/services/CrudDB"
import { StoreContext } from "app/store/store"
import React, { useContext, useState } from 'react'
import AppButton from "../ui/AppButton"
import SettingsSectionSwitch from "./SettingsSectionSwitch"
import SettingsTitles from "./SettingsTitles"

export default function ContactsSettings() {

  const { myUserID } = useContext(StoreContext)
  const [showFavorites, setShowFavorites] = useState(true)
  const myUserContactSettings = useUserContactSettings(myUserID)

  const saveSettings = () => {
    updateDB(`users/${myUserID}/settings`, 'contacts', {
      showFavorites
    })
  }

  return (
    <div className="settings-sub-page">
      <SettingsTitles
        label="Contacts"
        sublabel="Customize your contact creation experience."
        icon="fas fa-users"
      />
      <SettingsSectionSwitch
        label="Show Favorite Contacts"
        sublabel="Show favorite contacts on invoices and estimates creation pages."
        value={showFavorites}
        setValue={setShowFavorites}
        className="showFavoriteContacts"
      />
      <div className="btn-group">
        <AppButton
          label="Save"
          onClick={saveSettings}
        />
      </div>
    </div>
  )
}
