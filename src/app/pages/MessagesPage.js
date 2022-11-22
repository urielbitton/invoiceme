import HelmetTitle from "app/components/ui/HelmetTitle"
import React from 'react'

export default function MessagesPage() {
  return (
    <div>
      <HelmetTitle title="Messages" />
      Display emails that are sent to the user on this page (use mail collection - filter by 'to' prop)
    </div>
  )
}
