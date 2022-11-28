import React from 'react'
import AppButton from "../ui/AppButton"
import { AppInput, AppSwitch } from "../ui/AppInputs"
import AppModal from "../ui/AppModal"
import CountryStateCity from "../ui/CountryStateCity"
import './styles/AddContactModal.css'

export default function AddContactModal(props) {

  const { showModal, setShowModal, name, setName, email, setEmail, 
    phone, setPhone, address, setAddress, city, setCity, region, 
    setRegion, country, setCountry, postcode, setPostcode, companyName, 
    setCompanyName, createContact, loading, addToContacts, 
    setAddToContacts } = props

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
          placeholder="Contact name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <AppInput
          label="Email"
          placeholder="Contact email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <AppInput
          label="Phone"
          placeholder="Contact phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <AppInput
          label="Address"
          placeholder="Contact address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
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
          label="Postal Code/Zip Code"
          placeholder="Postal Code/Zip Code"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
        />
        <AppInput
          label="Company Name"
          placeholder="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <div className="split-row">
          <AppSwitch
            label="Save to Contacts"
            checked={addToContacts}
            onChange={(e) => setAddToContacts(e.target.checked)}
          />
        </div>
      </form>
    </AppModal>
  )
}
