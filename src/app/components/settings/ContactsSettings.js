import { errorToast, successToast } from "app/data/toastsTemplates"
import { useUserContactSettings } from "app/hooks/userHooks"
import { updateDB } from "app/services/CrudDB"
import { StoreContext } from "app/store/store"
import { isEmptyObject } from "app/utils/generalUtils"
import React, { useContext, useEffect, useState } from 'react'
import AppButton from "../ui/AppButton"
import SettingsSectionSwitch from "./SettingsSectionSwitch"
import SettingsTitles from "./SettingsTitles"

export default function ContactsSettings() {

  const { myUserID, setPageLoading, setToasts } = useContext(StoreContext)
  const [showFavorites, setShowFavorites] = useState(true)
  const [showContactAvatar, setShowContactAvatar] = useState(true)
  const myUserContactSettings = useUserContactSettings(myUserID)

  const allowSave = myUserContactSettings?.showFavorites !== showFavorites || 
    myUserContactSettings?.showContactAvatar !== showContactAvatar

  const saveSettings = () => {
    setPageLoading(true)
    updateDB(`users/${myUserID}/settings`, 'contacts', {
      showFavorites,
      showContactAvatar
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
  }

  useEffect(() => {
    if (!isEmptyObject(myUserContactSettings)) {
      setShowFavorites(myUserContactSettings?.showFavorites ?? true)
      setShowContactAvatar(myUserContactSettings?.showContactAvatar ?? true)
    }
  },[myUserContactSettings])

  return (
    <div className="settings-sub-page">
      <SettingsTitles
        label="Contacts"
        sublabel="Customize your contact creation experience."
        icon="fas fa-users"
        button={
          <AppButton
            label="Save Settings"
            onClick={saveSettings}
            disabled={!allowSave}
          />
        }
        isSticky
      />
      <SettingsSectionSwitch
        label="Favorite Contacts"
        sublabel="Show favorite contacts on invoices and estimates creation pages."
        value={showFavorites}
        setValue={setShowFavorites}
        className="showFavoriteContacts"
      />
      <SettingsSectionSwitch
        label="Contact Avatar"
        sublabel="Show contact avatar on my contacts page."
        value={showContactAvatar}
        setValue={setShowContactAvatar}
        className="showContactAvatar"
      />
    </div>
  )
}
