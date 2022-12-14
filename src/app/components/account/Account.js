import { successToast, warningToast } from "app/data/toastsTemplates"
import { saveAccountInfoService } from "app/services/userServices"
import { StoreContext } from "app/store/store"
import { validatePhone } from "app/utils/generalUtils"
import React, { useContext, useEffect, useState } from 'react'
import AppBadge from "../ui/AppBadge"
import AppButton from "../ui/AppButton"
import { AppInput } from "../ui/AppInputs"
import AvatarUploader from "../ui/AvatarUploader"
import CountryStateCity from "../ui/CountryStateCity"

export default function Account() {

  const { setPageLoading, myUser, myUserID, setToasts } = useContext(StoreContext)
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
  const [deleteConfirmation, setDeleteConfirmation] = useState('')

  const allowSave = (firstName !== myUser?.firstName ||
    lastName !== myUser?.lastName ||
    phone !== myUser?.phone ||
    address !== myUser?.address ||
    city !== myUser?.city ||
    region !== `${myUser?.region},${myUser?.regionCode}` ||
    country !== `${myUser?.country},${myUser?.countryCode}` ||
    postcode !== myUser?.postcode ||
    uploadedProfileImg !== null) &&
    !!(firstName &&
      lastName &&
      validatePhone(phone) &&
      address &&
      city &&
      region &&
      country &&
      postcode)

  const saveAccountInfo = () => {
    if (!!!myUser) return setToasts(warningToast('Please fill in all fields.'))
    setPageLoading(true)
    saveAccountInfoService(
      myUserID,
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
      `users/${myUserID}/account`
    )
      .then(() => {
        setPageLoading(false)
        setUploadedProfileImg(null)
        setToasts(successToast('Account info saved.'))
      })
      .catch(err => {
        setPageLoading(false)
        console.log(err)
      })
  }

  const deleteMyAccount = () => {
    const confirm = window.confirm('Are you sure you want to delete your account? This action cannot be undone.')
    if(!confirm) return alert('Account was not deleted.')
    
  }

  useEffect(() => {
    if (myUser) {
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
  }, [myUser])

  return (
    <div className="account-content">
      <div className="account-section">
        <h4>Account Information</h4>
        <div className="avatar-container">
          <AvatarUploader
            src={uploadedProfileImg?.src || photoURL}
            dimensions={110}
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
          type="number"
          onKeyDown={e => (e.key === 'e' || e.key === 'E') && e.preventDefault()}
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
        <div className="btn-group">
          <AppButton
            label="Save"
            onClick={() => saveAccountInfo()}
            disabled={!!!allowSave}
          />
        </div>
      </div>
      <div className="account-section">
        <h4>Account Type</h4>
        <div style={{display: 'flex'}}>
          <AppBadge
            label={myUser?.memberType}
            noIcon
          />
        </div>
      </div>
      <div className="account-section delete-account">
        <h4>Delete My Account</h4>
        <div className="form">
          <AppInput
            label="Type 'DELETE' to confirm"
            placeholder="Type DELETE to confirm"
            value={deleteConfirmation}
            onChange={e => setDeleteConfirmation(e.target.value)}
          />
          <AppButton
            label="Delete My Account"
            buttonType="outlineRedBtn"
            disabled={deleteConfirmation !== 'DELETE'}
            onClick={() => deleteMyAccount()}
          />
        </div>
      </div>
    </div>
  )
}
