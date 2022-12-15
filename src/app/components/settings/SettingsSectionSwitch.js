import { infoToast } from "app/data/toastsTemplates"
import { StoreContext } from "app/store/store"
import React, { useContext } from 'react'
import { AppSwitch } from "../ui/AppInputs"
import SettingsSection from "./SettingsSection"

export default function SettingsSectionSwitch(props) {
  
  const { myMemberType, setToasts } = useContext(StoreContext)
  const { label, sublabel='', badge='', value, setValue, 
    businessAccess=false, className='' } = props

  const handleSwitch = (e) => {
    if(myMemberType === 'business' || !businessAccess) {
      setValue(e.target.checked)
    }
    else {
      setToasts(infoToast('This feature is only available to business members.'))
    }
  }

  return (
    <SettingsSection
      label={label}
      sublabel={sublabel}
      badge={badge}
      className={className}
    >
      <AppSwitch
        checked={value}
        onChange={e => handleSwitch(e)}
      />
    </SettingsSection>
  )
}
