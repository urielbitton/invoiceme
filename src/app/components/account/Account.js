import { saveAccountInfoService } from "app/services/userServices"
import { StoreContext } from "app/store/store"
import { cap, upper } from "app/utils/generalUtils"
import React, { useContext, useEffect, useState } from 'react'
import AppButton from "../ui/AppButton"
import { AppInput } from "../ui/AppInputs"
import AvatarUploader from "../ui/AvatarUploader"
import CountryStateCity from "../ui/CountryStateCity"

export default function Account() {

  const { setPageLoading, myUser } = useContext(StoreContext)
  const [photoURL, setPhotoURL] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [region, setRegion] = useState("")
  const [country, setCountry] = useState("")
  const [postcode, setPostcode] = useState("")
  const [uploadedProfileImg, setUploadedProfileImg] = useState(null)

  const saveAccount = () => {
    saveAccountInfoService(
      myUser, 
      {
        firstName,
        lastName, 
        phone,
        address,
        city,
        region: region.split(',')[0],
        regionCode: region.split(',')[1],
        country: country.split(',')[0],
        countryCode: country.split(',')[1],
        postcode
      }, 
      uploadedProfileImg, 
      `users/${myUser}/account`
    )
  }

  useEffect(() => {
    if(myUser) {
      setPhotoURL(myUser.photoURL)
      setFirstName(myUser.firstName)
      setLastName(myUser.lastName)
      setPhone(myUser.phone)
      setAddress(myUser.address)
      setCountry(`${myUser.country},${myUser.countryCode}`)
      setRegion(`${myUser.region},${myUser.regionCode}`)
      setCity(myUser.city)
      setPostcode(myUser.postcode)
    }
  },[myUser])

  return (
    <div className="account-content">
      <div className="account-section">
        <h4>Account Information</h4>
        <div className="avatar-container">
        <AvatarUploader
          src={uploadedProfileImg?.src || photoURL}
          dimensions={100}
          uploadedImg={uploadedProfileImg}
          setUploadedImg={setUploadedProfileImg}
          setPageLoading={setPageLoading}
        />
        {
            uploadedProfileImg &&
            <AppButton
              label="Remove"
              onClick={() => setUploadedProfileImg(null)}
              buttonType="outlineBlueBtn"
            />
          }
        </div>
        <AppInput
          label="First Name"
          placeholder="James"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
        <AppInput
          label="Last Name"
          placeholder="Carson"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
        <AppInput
          label="Email"
          placeholder="james@invoiceme.com"
          value={myUser?.email}
          disabled
        />
        <AppInput
          label="Phone"
          placeholder="(123)-456-7890"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
        <AppInput
          label="Address"
          placeholder="123 Main St."
          value={address}
          onChange={e => setAddress(e.target.value)}
        />
        <CountryStateCity
          country={country}
          setCountry={setCountry}
          region={region}
          setRegion={setRegion}
          city={city}
          setCity={setCity}
        />
        <AppInput
          label="Postal code/ZIP"
          placeholder="A1B 2C3"
          value={postcode}
          onChange={e => setPostcode(e.target.value)}
        />
      </div>
      <div className="btn-group">
        <AppButton
          label="Save"
          onClick={() => saveAccount()}
        />
      </div>
    </div>
  )
}
