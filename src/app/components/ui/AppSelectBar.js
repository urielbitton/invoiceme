import React from 'react'
import './styles/AppSelectBar.css'
import { AppInput, AppSelect } from "./AppInputs"
import { showXResultsOptions } from "app/data/general"

export default function AppSelectBar(props) {

  const { labelText1, sortSelectOptions, searchValue, searchOnChange,
    handleOnKeyPress, showAmountSelect, rightComponent, searchQuery,
    amountSelectValue, amountSelectOnChange, searchPlaceholder, yearSelectOptions,
    monthSelectOptions, yearValue, monthValue, yearOnChange, monthOnChange } = props

  return (
    <div className="app-select-bar">
      <div className="select-item">
        <h6>{labelText1}</h6>
      </div>
      <div className="select-item">
        <AppInput
          placeholder={searchPlaceholder}
          enterKeyHint="go"
          iconleft={<i className="fal fa-search" />}
          iconright={searchValue.length > 0 &&
            <i
              className="fal fa-times"
              onClick={() => searchOnChange({ target: { value: '' } })}
            />
          }
          onKeyPress={handleOnKeyPress}
          value={searchValue}
          onChange={searchOnChange}
        />
      </div>
      {
        sortSelectOptions &&
        <div className="select-item">
          <AppSelect
            label="Sort by:"
            options={sortSelectOptions}
          />
        </div>
      }
      {
        showAmountSelect &&
        <div className="select-item">
          <AppSelect
            label="Show:"
            options={showXResultsOptions}
            onChange={amountSelectOnChange}
            value={amountSelectValue}
          />
        </div>
      }
      {
        yearSelectOptions?.length > 0 && searchQuery?.length < 1 &&
        <div className="select-item">
          <AppSelect
            label="Year:"
            options={yearSelectOptions}
            onChange={yearOnChange}
            value={yearValue}
          />
        </div>
      }
      {
        monthSelectOptions?.length > 0 && yearValue !== 'all' && searchQuery?.length < 1 &&
        <div className="select-item">
          <AppSelect
            label="Month:"
            options={monthSelectOptions}
            onChange={monthOnChange}
            value={monthValue}
          />
        </div>
      }
      {rightComponent}
    </div>
  )
}
