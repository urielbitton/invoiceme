// @ts-nocheck
import React from 'react'
import './styles/AddressSearchInput.css'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import Geocode from "react-geocode"
import { truncateText } from "app/utils/generalUtils"
import DotsLoader from "./DotsLoader"

Geocode.setApiKey(process.env.REACT_APP_GEOCODE_API_KEY)
Geocode.setLanguage("en")
Geocode.setLocationType("ROOFTOP") 

export default function AddressSearchInput(props) {

  const { address, setAddress, inputContainerClass='', 
    dropdownContainerClass='', setLat, setLng, label, disabled,
    showIcon, truncateNum=300, setCity, setRegion, setPostalCode,
    setCountry, setStreetAddress } = props
 
  const handleSelect = (address) => {
    setAddress(address)
    geocodeByAddress(address)
    .then(results => {
      console.log(results)
      setStreetAddress && setStreetAddress(results[0]?.formatted_address?.split(",")[0])
      setCity && setCity(results[0]?.address_components[results[0]?.address_components.length-4]?.long_name)
      setPostalCode && setPostalCode(results[0]?.address_components[results[0]?.address_components.length-1]?.long_name)
      setRegion && setRegion(results[0]?.address_components[results[0]?.address_components.length-3]?.long_name)
      setCountry && setCountry(results[0]?.address_components[results[0]?.address_components.length-2]?.long_name)
      return getLatLng(results[0])
    })
    .then(latLng => { 
      setLat(latLng.lat)
      setLng(latLng.lng)
      console.log('Success', latLng)
    })
    .catch(error => console.error(error))
  }

  return (
    <PlacesAutocomplete
      onChange={(address) => setAddress(address)}
      value={address}
      onSelect={handleSelect}
      disabled={disabled}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div className={`address-search-input ${inputContainerClass}`}>
          { label && <h6>{label}</h6>}
          <div className="input-row">
            <input
              {...getInputProps({
                placeholder: 'Enter an address...',
                className: 'location-search-input',
                disabled
              })}
            />
            { showIcon && <i className="fas fa-map-marker-alt map-icon"/>}
          </div>
          <div className={`dropdownContainer ${dropdownContainerClass}`}>
            {
              loading ? 
              <DotsLoader width={50} height={50} loading/> :
              suggestions?.map((suggestion,i) => {;
                return (
                  <div
                    key={i}
                    {...getSuggestionItemProps(suggestion)}
                  >
                    <div className="result-row">
                      <div className="icon-container">
                        <i className="fas fa-map-marker-alt"/>
                      </div>
                      <span>{truncateText(suggestion.description, truncateNum)}</span>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  )
}