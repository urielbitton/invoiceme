import React from 'react'
import { Helmet } from 'react-helmet-async'

export default function HelmetTitle(props) {

  const { title, meta, link, script } = props

  return (
    <Helmet>
      {meta}
      <title>
        {
          title ?
          `${title} | Invoice Me` :
          'Invoice Me - Send invoices, track payments, and get paid faster'
        }
      </title>
      {link}
      {script}
    </Helmet>
  )
}
