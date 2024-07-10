import { StoreContext } from "app/store/store"
import { convertClassicDate } from "app/utils/dateUtils"
import { formatCurrency, formatPhoneNumber } from "app/utils/generalUtils"
import React, { useContext } from 'react'
import AppTable from "../ui/AppTable"
import '../invoices/styles/InvoicePaper.css'
import { useUserEstimateSettings } from "app/hooks/userHooks"

export default function EstimatePaper(props) {

  const { myUser, myUserID } = useContext(StoreContext)
  const { estimate, myBusiness, taxNumbers, estimateItems,
    calculatedSubtotal, calculatedTaxRate, calculatedTotal,
    estimatePaperRef } = props
  const myTaxNumbers = taxNumbers || myUser?.taxNumbers
  const estSettings = useUserEstimateSettings(myUserID)

  const invoiceItemsList = estimateItems?.map((item, index) => {
    return <div
      className="invoice-item-row"
      key={index}
    >
      <h6>{(index + 1)}</h6>
      <h6>{item?.name}</h6>
      <h6>{estimate?.currency.symbol}{formatCurrency(item?.price?.toFixed(2))}</h6>
      <h6>{item?.quantity}</h6>
      <h6>{item?.taxRate}%</h6>
      <h6>{estimate?.currency.symbol}{item?.total?.toFixed(2)}</h6>
    </div>
  })

  const taxNumbersList = myTaxNumbers?.map((taxNum, index) => {
    return <h5
      key={index}
    >
      {taxNum.name}: {taxNum.number}
    </h5>
  })

  return (
    estSettings &&
    <div
      className="invoice-paper-container"
      ref={estimatePaperRef}
    >
      <header>
        {
          estSettings?.showMyLogo &&
          <img
            src={estimate?.myBusiness?.logo || myBusiness?.logo}
            alt="Logo"
          />
        }
        <div
          className="header-row"
        >
          <div
            className="left"
          >
            {estSettings?.showMyName && <h3>{estimate?.myBusiness?.name || myBusiness?.name}</h3>}
            {estSettings?.showMyAddress && <h5>{estimate?.myBusiness?.address || myBusiness?.address}</h5>}
            {estSettings?.showMyPhone && <h5>{formatPhoneNumber(estimate?.myBusiness?.phone || myBusiness?.phone)}</h5>}
            {estSettings?.showMyEmail && <h5>{estimate?.myBusiness?.email || myBusiness?.email}</h5>}
            <h5>
              {estimate?.myBusiness?.city || myBusiness?.city},&nbsp;
              {estimate?.myBusiness?.region || myBusiness?.region},&nbsp;
              {estSettings?.showMyCountry ? `${estimate?.myBusiness?.country || myBusiness?.country} ` : null}
              {estimate?.myBusiness?.postcode || myBusiness?.postcode}
            </h5>
            {estSettings?.showMyTaxNumbers && taxNumbersList}
          </div>
          <div
            className="right"
          >
            <h3>Estimate</h3>
            <h5>#{estimate?.estimateNumber}</h5>
            <h5>Estimate Date: {convertClassicDate(estimate?.dateCreated.toDate())}</h5>
            {
              estSettings?.showMyDueDate &&
              <h5>
                Date Due: <span>{convertClassicDate(estimate?.dateDue.toDate())}</span>
              </h5>
            }
          </div>
        </div>
      </header>
      <div
        className="billto-section"
      >
        <div className="side">
          <h4>Bill To</h4>
          { estSettings?.showClientName && <h5>{estimate?.estimateTo?.name}</h5>}
          { estSettings?.showClientAddress && <h5>{estimate?.estimateTo?.address}</h5>}
          { estSettings?.showClientPhone && <h5>{formatPhoneNumber(estimate?.estimateTo?.phone)}</h5>}
          { estSettings?.showClientEmail && <h5>{estimate?.estimateTo?.email}</h5>}
          <h5>
            {estimate?.estimateTo?.city}, {estimate?.estimateTo?.region},&nbsp;
            {estSettings?.showClientCountry && estimate?.estimateTo?.country} {estimate?.estimateTo?.postcode}
          </h5>
        </div>
        <div className="side" />
      </div>
      <div
        className="items-section"
      >
        <AppTable
          headers={[
            'Item #',
            'Service',
            'Price',
            'Quantity',
            'Tax Rate',
            'Total'
          ]}
          rows={invoiceItemsList}
        />
      </div>
      <div
        className="totals-section"
      >
        <h6>
          <span>Tax Rate</span>
          <span>${(calculatedSubtotal * (calculatedTaxRate/100)).toFixed(2)} ({calculatedTaxRate}%)</span>
        </h6>
        <h6>
          <span>Subtotal</span>
          <span>{estimate?.currency?.symbol}{formatCurrency(calculatedSubtotal)}</span>
        </h6>
        <h6
          className="totals"
        >
          <span>Total</span>
          <span>{estimate?.currency?.symbol}{formatCurrency(calculatedTotal)} {estimate?.currency?.value}</span>
        </h6>
      </div>
      {
        (estimate?.notes?.length > 0 || estSettings?.estimateNotes?.length) && estSettings?.showNotes && 
        <div
          className="notes-section"
        >
          <h4>Notes</h4>
          <p>{estimate?.notes || estSettings?.estimateNotes}</p>
        </div>
      }
      <div
        className="foot-notes"
      >
        <h6>{estSettings?.thankYouMessage}</h6>
        {
          estSettings?.showInvoiceMeTag && 
          <small>
          Estimate generated by&nbsp;
          <a
            href="https://invoiceme.pro"
          >
            Invoice Me
          </a>
        </small>
        }
      </div>
    </div>
  )
}
