import AppButton from "app/components/ui/AppButton"
import { AppInput, AppSwitch, AppTextarea } from "app/components/ui/AppInputs"
import AvatarUploader from "app/components/ui/AvatarUploader"
import CountryStateCity from "app/components/ui/CountryStateCity"
import HelmetTitle from "app/components/ui/HelmetTitle"
import PageTitleBar from "app/components/ui/PageTitleBar"
import { errorToast, infoToast, successToast } from "app/data/toastsTemplates"
import { useContact } from "app/hooks/contactsHooks"
import { useUserNotifSettings } from "app/hooks/userHooks"
import { createContactService, deleteContactService, 
  updateContactService } from "app/services/contactsServices"
import { getRandomDocID } from "app/services/CrudDB"
import { uploadMultipleFilesToFireStorage } from "app/services/storageServices"
import { StoreContext } from "app/store/store"
import { validateEmail, validatePhone } from "app/utils/generalUtils"
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from "react-router-dom"
import '../pages/styles/NewInvoicePage.css'

export default function NewContactPage() {

  const { myUserID, setPageLoading, setToasts } = useContext(StoreContext)
  const [searchParams, setSearchParams] = useSearchParams()
  const editMode = searchParams.get('edit') === 'true'
  const editContactID = searchParams.get('contactID')
  const editContact = useContact(myUserID, editContactID)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [region, setRegion] = useState('')
  const [country, setCountry] = useState('')
  const [postcode, setPostcode] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [photoURL, setPhotoURL] = useState(null)
  const [notes, setNotes] = useState('')
  const [isFavorite, setIsFavorite] = useState(false)
  const [uploadedImg, setUploadedImg] = useState(null)
  const navigate = useNavigate()
  const contactStoragePath = `users/${myUserID}/contacts/${editContactID}`
  const notifSettings = useUserNotifSettings(myUserID)

  const allowSave = name && validateEmail(email) && address && 
    validatePhone(phone) && city && region && country && 
    postcode

  const createContact = () => {
    if(!!!allowSave) return setToasts(infoToast('Please fill all required fields'))
    setPageLoading(true)
    const storagePath = `users/${myUserID}/contacts`
    const storageDocID = getRandomDocID(storagePath)
    const contactStoragePath = `${storagePath}/${storageDocID}`
    uploadMultipleFilesToFireStorage(uploadedImg ? [uploadedImg.file] : null, contactStoragePath, ['photo-url'])
    .then(fileURLS => {
      createContactService(
        myUserID, 
        name, email, phone, address, city, region, country, postcode, 
        companyName, isFavorite, notes, uploadedImg ? fileURLS[0]?.downloadURL : null, 
        setPageLoading, setToasts, notifSettings.showContactsNotifs
      )
      .then(() => {
        navigate('/contacts')
      })
    })
    .catch(err => {
      setPageLoading(false)
      console.log(err)
      setToasts(errorToast('An error occured while creating the contact. Please try again.'))
    })
  }

  const updateContact = () => {
    if(!!!allowSave) return setToasts(infoToast('Please fill all the fields.'))
    setPageLoading(true)
    uploadMultipleFilesToFireStorage(uploadedImg ? [uploadedImg.file] : null, contactStoragePath, ['photo-url'])
    .then(fileURLS => {
      updateContactService(
        myUserID,
        editContactID,
        {
          name, email, phone, address, city, 
          region: region.split(',')[0], 
          country: country.split(',')[0], 
          regionCode: region.split(',')[1],
          countryCode: country.split(',')[1],
          postcode, companyName, isFavorite, notes,
          photoURL: uploadedImg ? fileURLS[0]?.downloadURL : editContact?.photoURL || null
        },
        setPageLoading,
        setToasts,
        notifSettings.showContactsNotifs
      )
      .then(() => {
        navigate(`/contacts/${editContactID}`)
      })
    })
    .catch(err => {
      setPageLoading(false)
      console.log(err)
      setToasts(errorToast('An error occured while updating the contact. Please try again.'))
    })
  }

  const deleteContact = () => {
    deleteContactService(
      myUserID, 
      editContactID, 
      contactStoragePath, 
      ['photo-url'], 
      setPageLoading,
      setToasts,
      notifSettings.showContactsNotifs
    )
    .then(() => {
      navigate('/contacts')
    })
  }

  useEffect(() => {
    if (editMode && editContact) {
      setName(editContact.name)
      setEmail(editContact.email)
      setAddress(editContact.address)
      setPhone(editContact.phone)
      setCity(editContact.city)
      setRegion(`${editContact.region},${editContact.regionCode}`)
      setCountry(`${editContact.country},${editContact.countryCode}`)
      setPostcode(editContact.postcode)
      setCompanyName(editContact.companyName)
      setPhotoURL(editContact.photoURL)
      setNotes(editContact.notes)
      setIsFavorite(editContact.isFavorite)
    }
  }, [editContact])

  return (
    <div className="new-contact-page new-invoice-page">
      <HelmetTitle title="Create New Contact" />
      <PageTitleBar
        title={!editMode ? 'Create A Contact' : 'Edit Contact'}
        hasBorder
      />
      <div className="page-content">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="avatar-row">
            <div className="left">
              <h6>Contact Photo</h6>
              <AvatarUploader
                src={uploadedImg?.src || photoURL}
                dimensions={130}
                setPageLoading={setPageLoading}
                uploadedImg={uploadedImg}
                setUploadedImg={setUploadedImg}
              />
            </div>
            <div className="right">
              {
                uploadedImg &&
                <AppButton
                  label="Remove"
                  buttonType="outlineBlueBtn"
                  onClick={() => setUploadedImg(null)}
                />
              }
            </div>
          </div>
          <AppInput
            label="Name"
            placeholder="James Troy"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <AppInput
            label="Email"
            placeholder="james@invoiceme.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <AppInput
            label="Address"
            placeholder="123 Main St"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <AppInput
            label="Phone"
            type="number"
            placeholder="123-456-7890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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
            label="Postal Code/Zip"
            placeholder="A1B 2C3"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
          />
          <AppInput
            label="Company Name"
            placeholder="Invoice Me Inc."
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <div className="switch-row">
            <h6>Favorite</h6>
            <AppSwitch
              label="Add Favorite"
              checked={isFavorite}
              onChange={() => setIsFavorite(!isFavorite)}
            />
          </div>
          <AppTextarea
            label="Contact Notes"
            placeholder="Add notes for this contact"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </form>
        <div className="btn-group">
          <AppButton
            label={!editMode ? 'Create Contact' : 'Update Contact'}
            onClick={() => !editMode ? createContact() : updateContact()}
          />
          {
            editMode &&
            <>
              <AppButton
                label="Delete Contact"
                buttonType="invertedRedBtn"
                onClick={() => deleteContact()}
              />
              <AppButton
                label="Cancel"
                buttonType="invertedBtn"
                onClick={() => navigate(-1)}
              />
            </>
          }
        </div>
      </div>
    </div>
  )
}
