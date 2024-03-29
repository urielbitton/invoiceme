import { getEstimateByID, getEstimatesByContactEmail, 
  getEstimatesByUserID, getEstimateYearOptions, getYearAndMonthEstimatesByUserID, 
  getYearEstimatesByUserID } from "app/services/estimatesServices"
import { StoreContext } from "app/store/store"
import { useContext, useEffect, useState } from "react"

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

export const useYearMonthOrAllEstimates = (userID, year, month, limit) => {

  const [estimates, setEstimates] = useState([])

  useEffect(() => {
    if (userID) {
      if(year !== 'all' && month === 'all') {
        getYearEstimatesByUserID(userID, year, setEstimates, limit)
      }
      else if(year !== 'all' && month !== 'all') {
        getYearAndMonthEstimatesByUserID(userID, year, month, setEstimates, limit)
      }
      else {
        getEstimatesByUserID(userID, setEstimates, limit)
      }
    }
  }, [userID, year, month, limit])

  return estimates
}

export const useContactEstimates = (userID, contactEmail) => {

  const [estimates, setEstimates] = useState([])

  useEffect(() => {
    if (userID && contactEmail)
      getEstimatesByContactEmail(userID, contactEmail, setEstimates)
  }, [userID, contactEmail])

  return estimates
}

export const useEstimateYearOptions = () => {

  const { myUserID } = useContext(StoreContext)
  const [options, setOptions] = useState([])

  useEffect(() => {
    getEstimateYearOptions(myUserID, setOptions)
  }, [myUserID])

  return options?.length ? options :  [{label: new Date().getFullYear(), value: new Date().getFullYear()}]
}
