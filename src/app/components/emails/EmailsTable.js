import React from 'react'
import AppItemRow from "../ui/AppItemRow"
import AppTable from "../ui/AppTable"

export default function EmailsTable(props) {

  const { emails } = props

  const emailsList = emails?.map((email, index) => {
    return <AppItemRow
      key={index}
      item1={email.from}
      item2={email.to}
      item3={email.subject}
      item4={email.message}
      item5={email.date}
      item6={<i className="fas fa-eye"/>}
    />
  })

  return (
    <AppTable
      headers={[
        'From',
        'To',
        'Subject',
        'Message',
        'Date',
        'View'
      ]}
      rows={emailsList}
    />
  )
}
