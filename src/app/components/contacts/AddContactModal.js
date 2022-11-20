import React from 'react'
import AppButton from "../ui/AppButton"
import { AppInput, AppSwitch } from "../ui/AppInputs"
import AppModal from "../ui/AppModal"
import './styles/AddContactModal.css'

export default function AddContactModal(props) {

  const { showModal, setShowModal, name,
    setName, email, setEmail, phone, setPhone, address, setAddress,
    city, setCity, region, setRegion, country, setCountry, postcode,
    setPostcode, addToFavorites, setAddToFavorites, createContact,
    loading } = props

  return (
    <AppModal
      showModal={showModal}
      setShowModal={setShowModal}
      label="Add New Contact"
      portalClassName="add-contact-modal"
      actions={
        <>
          <AppButton
            label="Create Contact"
            onClick={createContact}
            rightIcon={loading && "far fa-spin fa-spinner"}
          />
          <AppButton
            label="Cancel"
            onClick={() => setShowModal(false)}
            buttonType="invertedBtn"
          />
        </>
      }
    >
      <form onSubmit={(e) => e.preventDefault()}>
        <AppInput
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <AppInput
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <AppInput
          label="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <AppInput
          label="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <AppInput
          label="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <AppInput
          label="Region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        />
        <AppInput
          label="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        <AppInput
          label="Postal Code/Zip Code"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
        />
        <AppSwitch
          label="Add to Favorites"
          checked={addToFavorites}
          onChange={(e) => setAddToFavorites(e.target.checked)}
        />
      </form>
    </AppModal>
  )
}
