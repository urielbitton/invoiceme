import React, { useEffect, useState } from 'react'
import { Country, State, City } from 'country-state-city'
import { AppSelect } from "./AppInputs"

export default function CountryStateCity(props) {

  const { country, setCountry, region, setRegion, city, setCity } = props
  const [regionsList, setRegionsList] = useState([])
  const [citiesList, setCitiesList] = useState([])
  const countriesList = Country.getAllCountries()

  useEffect(() => { 
    setRegionsList(State.getStatesOfCountry(country?.split(',')[1]))
  },[country]) 

  useEffect(() => {
    setCitiesList(City.getCitiesOfState(country?.split(',')[1], region?.split(',')[1]))
  },[country, region])

  return (
    <>
      <AppSelect 
        label="Country" 
        options={[{name:'Choose a Country', value:''}, ...countriesList]} 
        onChange={(e) => setCountry(e.target.value)} 
        value={country} 
        customValues={['name', 'isoCode']}
      />
      <AppSelect 
        label="Province/State" 
        options={[{name:'Choose a Province/State', value:''}, ...regionsList]} 
        onChange={(e) => setRegion(e.target.value)} 
        value={region} 
        customValues={['name', 'isoCode']}
      />
      <AppSelect
        label="City"
        options={[{name:'Choose a City', value:''}, ...citiesList]}
        onChange={(e) => setCity(e.target.value)}
        value={city}
      />
    </>
  )
}
