import React from 'react'
import './styles/AppSelectBar.css'
import { AppInput, AppSelect } from "./AppInputs"
import { showXResultsOptions } from "app/data/general"

export default function AppSelectBar(props) {

  const { labelText1, selectOptions, searchValue, searchOnChange,
    handleOnKeyPress, showAmountSelect, rightComponent,
    amountSelectValue, amountSelectOnChange, searchPlaceholder } = props

  return (
    <div className="app-select-bar">
      <div className="select-item">
        <h6>{labelText1}</h6>
      </div>
      <div className="select-item">
        <AppInput
          placeholder={searchPlaceholder}
          iconleft={<i className="fal fa-search" />}
          iconright={searchValue.length > 0 && 
            <i 
              className="fal fa-times" 
              onClick={() => searchOnChange({target: {value: ''}})}
            />
          }
          onKeyPress={handleOnKeyPress}
          value={searchValue}
          onChange={searchOnChange}
          className="commonInput"
        />
      </div>
      <div className="select-item">
        <AppSelect
          label="Sort by:"
          options={selectOptions}
          className="commonInput"
        />
      </div>
      {
        showAmountSelect &&
        <div className="select-item">
          <AppSelect
            label="Show:"
            options={showXResultsOptions}
            onChange={amountSelectOnChange}
            value={amountSelectValue}
            className="commonInput"
          />
        </div>
      }
      { rightComponent }
    </div>
  )
}
