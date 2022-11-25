import { deleteEstimateService } from "app/services/estimatesServices"
import { StoreContext } from "app/store/store"
import { convertAlgoliaDate, convertClassicDate } from "app/utils/dateUtils"
import { formatCurrency, truncateText } from "app/utils/generalUtils"
import React, { useContext } from 'react'
import { useNavigate } from "react-router-dom"
import AppItemRow from "../ui/AppItemRow"
import IconContainer from "../ui/IconContainer"

export default function EstimateRow(props) {

  const { myUserID, setPageLoading } = useContext(StoreContext)
  const { estimateID, title, estimateNumber, total, items, estimateTo,
    dateCreated, currency } = props.estimate
  const navigate = useNavigate()

  const deleteEstimate = () => {
    deleteEstimateService(myUserID, estimateID, setPageLoading)
  }

  return (
    <AppItemRow
      item1={`#${truncateText(estimateNumber, 14)}`}
      item2={truncateText(title, 16)}
      item3={truncateText(estimateTo.name, 16)}
      item4={items.length}
      item5={`${currency?.symbol}${formatCurrency(total)}`}
      item6={convertClassicDate(convertAlgoliaDate(dateCreated))}
      actions={
        <>
          <IconContainer
            icon="fas fa-eye"
            tooltip="View Estimate"
            dimensions="23px"
            inverted
            iconSize="13px"
            onClick={() => navigate(`/estimates/${estimateID}`)}
          />
          <IconContainer
            icon="fas fa-pen"
            tooltip="Edit Invoice"
            dimensions="23px"
            inverted
            iconSize="13px"
            onClick={() => navigate(`/estimates/new?estimateID=${estimateID}&edit=true`)}
          />
          <IconContainer
            icon="fas fa-trash"
            tooltip="Delete"
            dimensions="23px"
            inverted
            iconSize="13px"
            onClick={() => deleteEstimate()}
          />
        </>
      }
      onDoubleClick={() => navigate(`/estimates/${estimateID}`)}
    />
  )
}
