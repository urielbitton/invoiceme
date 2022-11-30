import React from 'react'
import './styles/AppItemRow.css'

export default function AppItemRow(props) {

  const { item1, item2, item3, item4, item5, item6, item7, actions,
    onDoubleClick, handleCheckChange, className } = props

  const itemsArray = [item1, item2, item3, item4, item5, item6, item7]

  const itemsRender = itemsArray
  ?.filter(item => item !== undefined && item !== null)
  .map((item, index) => {
    return <div
      key={index}
      className="row-item"
    >
      {
        typeof item === 'boolean' ?
          <input
            type="checkbox"
            checked={item}
            onChange={handleCheckChange}
          /> :
          <h6>{item}</h6>
      }
    </div>
  })

  return (
    <div
      className={`app-item-row ${className}`}
      onDoubleClick={onDoubleClick}
    >
      {itemsRender}
      <div className="actions-row row-item">
        {actions}
      </div>
    </div>
  )
}
