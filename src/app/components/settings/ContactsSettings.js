import { useUserContactSettings } from "app/hooks/userHooks"
import { StoreContext } from "app/store/store"
import React, { useContext, useState } from 'react'
import SettingsSectionSwitch from "./SettingsSectionSwitch"
import SettingsTitles from "./SettingsTitles"

export default function ContactsSettings() {

  const { myUserID } = useContext(StoreContext)
  const [showFavorites, setShowFavorites] = useState(true)
  const myUserContactSettings = useUserContactSettings(myUserID)

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
      />
    </div>
  )
}
