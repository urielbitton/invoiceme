import { errorToast, infoToast, successToast } from "app/data/toastsTemplates"
import { saveMyBusinessInfoService } from "app/services/userServices"
import { StoreContext } from "app/store/store"
import React, { useContext, useEffect, useState } from 'react'
import AppButton from "../ui/AppButton"
import { AppInput } from "../ui/AppInputs"
import AvatarUploader from "../ui/AvatarUploader"
import CountryStateCity from "../ui/CountryStateCity"

export default function AccountBusiness() {

  const { setPageLoading, myUser, myUserID, setToasts } = useContext(StoreContext)
  const [businessAddress, setBusinessAddress] = useState("")
  const [businessCity, setBusinessCity] = useState("")
  const [businessCountry, setBusinessCountry] = useState("")
  const [businessLogo, setBusinessLogo] = useState(null)
  const [businessName, setBusinessName] = useState("")
  const [businessPhone, setBusinessPhone] = useState("")
  const [businessPostcode, setBusinessPostcode] = useState("")
  const [businessRegion, setBusinessRegion] = useState("")
  const [businessEmail, setBusinessEmail] = useState("")
  const [uploadedBusinessLogo, setUploadedBusinessLogo] = useState(null)
  const myBusiness = myUser?.myBusiness

  const allowSave = (businessAddress !== myBusiness?.address ||
  businessCity !== myBusiness?.city ||
  businessCountry !== `${myBusiness?.country},${myBusiness?.countryCode}` ||
  businessRegion !== `${myBusiness?.region},${myBusiness?.regionCode}` ||
  businessLogo !== myBusiness?.logo ||
  businessName !== myBusiness?.name ||
  businessPhone !== myBusiness?.phone ||
  businessPostcode !== myBusiness?.postcode ||
  businessEmail !== myBusiness?.email ||
  uploadedBusinessLogo !== null) &&
  !!(businessAddress &&
    businessCity &&
    businessCountry &&
    businessRegion &&
    businessName &&
    businessPhone &&
    businessPostcode &&
    businessEmail)

  const saveBusinessAccountInfo = () => {
    if(!!!allowSave) return setToasts(infoToast('Please fill out all fields.'))
    setPageLoading(true)
    saveMyBusinessInfoService(
      myUserID, 
      myUser,
      {
        name: businessName,
        phone: businessPhone,
        email: businessEmail,
        address: businessAddress,
        city: businessCity,
        region: businessRegion.split(',')[0],
        regionCode: businessRegion.split(',')[1],
        country: businessCountry.split(',')[0],
        countryCode: businessCountry.split(',')[1],
      }, 
      uploadedBusinessLogo, 
      `users/${myUserID}/myBusiness`
    )
    .then(() => {
      setPageLoading(false)
      setUploadedBusinessLogo(null)
      setToasts(successToast('Business info saved.'))
    })
    .catch(err => {
      setPageLoading(false)
      console.log(err)
      setToasts(errorToast('An error occured. Please try again.'))
    })
  }

  useEffect(() => {
    if(myBusiness) {
      setBusinessAddress(myBusiness?.address)
      setBusinessLogo(myBusiness?.logo)
      setBusinessName(myBusiness?.name)
      setBusinessPhone(myBusiness?.phone)
      setBusinessRegion(`${myUser?.region},${myUser?.regionCode}`)
      setBusinessCountry(`${myUser.country},${myUser?.countryCode}`)
      setBusinessCity(myBusiness?.city)
      setBusinessPostcode(myBusiness?.postcode)
      setBusinessEmail(myBusiness?.email)
    }
  },[myBusiness])

  return (
    <div className="account-content">
      <div className="account-section">
        <h4>Business Information</h4>
        <div className="avatar-container">
          <AvatarUploader
            src={uploadedBusinessLogo?.src || businessLogo}
            dimensions={110}
            uploadedImg={uploadedBusinessLogo}
            setUploadedImg={setUploadedBusinessLogo}
            setPageLoading={setPageLoading}
          />
          {
            uploadedBusinessLogo &&
            <AppButton
              label="Remove"
              onClick={() => setUploadedBusinessLogo(null)}
              buttonType="outlineBlueBtn"
            />
          }
        </div>
        <AppInput
          label={
            <>
              Business Name 
              <i 
                className="fas fa-info-circle"
                title="This is the name that will appear on your invoices under your logo"
              />
            </>
          }
          placeholder="InvoiceMe"
          value={businessName}
          onChange={e => setBusinessName(e.target.value)}
        />
        <AppInput
          label="Business Email"
          placeholder="info@invoiceme.com"
          value={businessEmail}
          onChange={e => setBusinessEmail(e.target.value)}
        />
        <AppInput
          label="Business Phone"
          placeholder="(123)-456-7890"
          type="number"
          onKeyDown={e => (e.key === 'e' || e.key === 'E') && e.preventDefault()}
          value={businessPhone}
          onChange={e => setBusinessPhone(e.target.value)}
        />
        <AppInput
          label="Business Address"
          placeholder="123 Main St."
          value={businessAddress}
          onChange={e => setBusinessAddress(e.target.value)}
        />
        <CountryStateCity
          country={businessCountry}
          setCountry={setBusinessCountry}
          region={businessRegion}
          setRegion={setBusinessRegion}
          city={businessCity}
          setCity={setBusinessCity}
        />
        <AppInput
          label="Business Postal code/ZIP"
          placeholder="A1B 2C3"
          value={businessPostcode}
          onChange={e => setBusinessPostcode(e.target.value)}
        />
      </div>
      <div className="btn-group">
        <AppButton
          label="Save"
          onClick={() => saveBusinessAccountInfo()}
          disabled={!!!allowSave}
        />
      </div>
    </div>
  )
}
