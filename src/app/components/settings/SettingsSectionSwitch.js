import { StoreContext } from "app/store/store"
import React, { useContext } from 'react'
import { AppSwitch } from "../ui/AppInputs"
import SettingsSection from "./SettingsSection"

export default function SettingsSectionSwitch({label, sublabel, badge='', value, setValue, businessAccess=false}) {

  const { myMemberType } = useContext(StoreContext)

  const handleSwitch = (e) => {
    if(myMemberType === 'business' || !businessAccess) {
      setValue(e.target.checked)
    }
    else {
      alert('This feature is only available to business members.')
    }
  }

  return (
    <SettingsSection
      label={label}
      sublabel={sublabel}
      badge={badge}
    >
      <AppSwitch
        checked={value}
        onChange={e => handleSwitch(e)}
      />
    </SettingsSection>
  )
}
