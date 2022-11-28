import { showXResultsOptions } from "app/data/general"
import React, { useState } from 'react'
import EstimateRow from "../estimates/EstimateRow"
import AppButton from "../ui/AppButton"
import { AppSelect } from "../ui/AppInputs"
import AppTable from "../ui/AppTable"

export default function ContactEstimates({estimates}) {

  const [showAmount, setShowAmount] = useState(showXResultsOptions[0].value)

  const estimatesList = estimates
  ?.slice(0, showAmount)
  .map((estimate, index) => {
    return <EstimateRow
      key={index}
      estimate={estimate}
    />
  })

  return (
    <div className="contact-invoices-content contact-content">
      <div className="header">
        <h5>Showing {estimates?.length} estimates</h5>
        <AppSelect
          label="Show:"
          options={showXResultsOptions}
          value={showAmount}
          onChange={(e) => setShowAmount(e.target.value)}
        />
      </div>
      <AppTable
        headers={[
          "Estimate #",
          "Title",
          "Client",
          "Items",
          "Total",
          "Date Created",
          '',
          'Actions'
        ]}
        rows={estimatesList}
      />
      <div className="btn-group">
        {
          showAmount <= estimates?.length &&
          <AppButton
            label="Show More"
            onClick={() => setShowAmount(showAmount + showXResultsOptions[0].value)}
          />
        }
      </div>
    </div>
  )
}
