import { getEstimateByID, getEstimatesByContactEmail, getEstimatesByUserID } from "app/services/estimatesServices"
import { useEffect, useState } from "react"

export const useEstimates = (userID, limit) => {

  const [estimates, setEstimates] = useState([])

  useEffect(() => {
    if (userID)
      getEstimatesByUserID(userID, setEstimates, limit)
  }, [userID, limit])
  return estimates
}

export const useEstimate = (userID, estimateID) => {

  const [invoice, setInvoice] = useState(null)

  useEffect(() => {
    if (userID && estimateID)
      getEstimateByID(userID, estimateID, setInvoice)
  }, [userID, estimateID])
  return invoice
} 

export const useContactEstimates = (userID, contactEmail, limit) => {

  const [estimates, setEstimates] = useState([])

  useEffect(() => {
    if (userID && contactEmail)
      getEstimatesByContactEmail(userID, contactEmail, setEstimates, limit)
  }, [userID, contactEmail, limit])

  return estimates
}