import { contactsIndex } from "app/algolia"
import { infoToast } from "app/data/toastsTemplates"
import { useFavoriteContacts } from "app/hooks/contactsHooks"
import { useInstantSearch } from "app/hooks/searchHooks"
import { useUserContactSettings, useUserNotifSettings } from "app/hooks/userHooks"
import { addContactService, createContactService } from "app/services/contactsServices"
import { StoreContext } from "app/store/store"
import { validateEmail, validatePhone } from "app/utils/generalUtils"
import React, { useContext, useState } from 'react'
import AddContactModal from "../contacts/AddContactModal"
import ContactRowBasic from "../contacts/ContactRowBasic"
import AppButton from "../ui/AppButton"
import { AppInput } from "../ui/AppInputs"
import AppPagination from "../ui/AppPagination"
import IconContainer from "../ui/IconContainer"
import './styles/InvoiceContact.css'

export default function InvoiceContact(props) {

  const { myUserID, pageLoading, setPageLoading, setToasts } = useContext(StoreContext)
  const { contactName, setContactName, contactEmail, setContactEmail,
    contactPhone, setContactPhone, contactAddress, setContactAddress,
    contactCity, setContactCity, contactRegion, setContactRegion,
    contactPostcode, setContactPostcode, contactCountry, setContactCountry,
    invoiceContact, setInvoiceContact } = props
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [numOfPages, setNumOfPages] = useState(1)
  const [pageNum, setPageNum] = useState(0)
  const [numOfHits, setNumOfHits] = useState(0)
  const [hitsPerPage, setHitsPerPage] = useState(10)
  const [showContactModal, setShowContactModal] = useState(false)
  const [contactCompanyName, setContactCompanyName] = useState("")
  const [contactAddFavorite, setContactAddFavorite] = useState(false)
  const [addToContacts, setAddToContacts] = useState(false)
  const [contactsLoading, setContactsLoading] = useState(false)
  const favoriteContacts = useFavoriteContacts(myUserID)
  const filters = `ownerID: ${myUserID}`
  const contactSettings = useUserContactSettings(myUserID)
  const notifSettings = useUserNotifSettings(myUserID)

  const allowAddContact = contactName &&
    validateEmail(contactEmail) &&
    validatePhone(contactPhone) &&
    contactAddress &&
    contactCity &&
    contactRegion &&
    contactCountry &&
    contactPostcode

  const contacts = useInstantSearch(
    query,
    searchResults,
    setSearchResults,
    contactsIndex,
    filters,
    setNumOfHits,
    setNumOfPages,
    pageNum,
    hitsPerPage,
    setContactsLoading,
    false
  )

  const contactsList = contacts?.map((contact, index) => {
    return <ContactRowBasic
      key={index}
      contact={contact}
      actions={
        <AppButton
          label="Select"
          onClick={() => {
            setInvoiceContact({
              name: contact.name,
              email: contact.email,
              phone: contact.phone,
              address: contact.address,
              city: contact.city,
              region: contact.region,
              country: contact.country,
              postcode: contact.postcode,
              photoURL: contact.photoURL,
              dateCreated: new Date()
            })
            setQuery("")
            setSearchResults([])
          }}
        />
      }
    />
  })

  const favoritesList = favoriteContacts
  ?.slice(0,5)
  .map((contact, index) => {
    return <ContactRowBasic
      key={index}
      contact={contact}
      actions={
        <AppButton
          label="Select"
          onClick={() => {
            setInvoiceContact({
              name: contact.name,
              email: contact.email,
              phone: contact.phone,
              address: contact.address,
              city: contact.city,
              region: contact.region,
              country: contact.country,
              postcode: contact.postcode,
              dateCreated: new Date(),
              photoURL: contact.photoURL
            })
            setQuery("")
            setSearchResults([])
          }}
        />
      }
    />
  })

  const clearContactInfo = () => {
    setContactName("")
    setContactEmail("")
    setContactPhone("")
    setContactAddress("")
    setContactCity("")
    setContactRegion("")
    setContactCountry("")
    setContactPostcode("")
    setContactCompanyName("")
    setContactAddFavorite(false)
    setShowContactModal(false)
    setPageLoading(false)
  }

  const addContact = () => {
    if (!!!allowAddContact) return setToasts(infoToast('Please fill out all required fields'))
    if (addToContacts) {
      createContactService(myUserID, contactName, contactEmail, contactPhone, contactAddress,
        contactCity, contactRegion, contactCountry, contactPostcode, contactCompanyName,
        contactAddFavorite, '', null, setPageLoading, setToasts, notifSettings.showContactsNotifs
      )
        .then(() => {
          clearContactInfo()
        })
    }
    else {
      addContactService(myUserID, contactName, contactEmail, contactPhone, contactAddress,
        contactCity, contactRegion, contactCountry, contactPostcode, contactCompanyName,
        contactAddFavorite, setInvoiceContact
      )
      clearContactInfo()
    }
  }

  return (
    <div className="invoice-contact">
      <h4>Bill To Contact</h4>
      <AppInput
        placeholder="Search Contact"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        iconleft={contactsLoading ? <i className="fal fa-spinner fa-spin" /> :
          query.length ?
            <i
              className="fal fa-times"
              onClick={() => {
                setQuery('')
                setSearchResults([])
              }}
            /> :
            <i className="fal fa-search" />
        }
      />
      {
        invoiceContact &&
        <>
          <h5>Selected Contact</h5>
          <ContactRowBasic
            contact={{
              name: invoiceContact.name,
              email: invoiceContact.email,
              phone: invoiceContact.phone,
              address: invoiceContact.address,
              city: invoiceContact.city,
              region: invoiceContact.region,
              country: invoiceContact.country,
              photoURL: invoiceContact.photoURL,
            }}
            className="selected"
            actions={
              <IconContainer
                icon="fal fa-times"
                onClick={() => setInvoiceContact(null)}
                iconColor="var(--darkGrayText)"
                iconSize="17px"
                dimensions="30px"
              />
            }
          />
        </>
      }
      {
        query.length > 0 && searchResults.length > 0 ?
          <div className="contacts-search-results-container">
            <h5>My Contacts</h5>
            <div className="contacts-search-results">
              {contactsList}
            </div>
            <AppPagination
              pageNum={pageNum}
              setPageNum={setPageNum}
              numOfPages={numOfPages}
              dimensions="25px"
            />
          </div> :
          contactSettings?.showFavorites &&
          <div className="contacts-search-results-container">
            <h5>Favorite Contacts</h5>
            <div className="contacts-search-results favorite-contacts">
              {favoritesList}
            </div>
          </div>
      }
      <AppButton
        label="New Contact"
        onClick={() => setShowContactModal(true)}
        rightIcon="fal fa-plus"
      />
      <AddContactModal
        showModal={showContactModal}
        setShowModal={setShowContactModal}
        name={contactName}
        setName={setContactName}
        email={contactEmail}
        setEmail={setContactEmail}
        phone={contactPhone}
        setPhone={setContactPhone}
        address={contactAddress}
        setAddress={setContactAddress}
        city={contactCity}
        setCity={setContactCity}
        region={contactRegion}
        setRegion={setContactRegion}
        country={contactCountry}
        setCountry={setContactCountry}
        postcode={contactPostcode}
        setPostcode={setContactPostcode}
        companyName={contactCompanyName}
        setCompanyName={setContactCompanyName}
        addToContacts={addToContacts}
        setAddToContacts={setAddToContacts}
        createContact={addContact}
        loading={pageLoading}
      />
    </div>
  )
}
