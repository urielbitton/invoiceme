import React from 'react'
import { AppSwitch } from "../ui/AppInputs"
import SettingsSection from "./SettingsSection"

export default function SettingsSectionSwitch({label, sublabel, value, setValue}) {
  return (
    <SettingsSection
      label={label}
      sublabel={sublabel}
    >
      <AppSwitch
        checked={value}
        onChange={e => setValue(e.target.checked)}
      />
    </SettingsSection>
  )
}
