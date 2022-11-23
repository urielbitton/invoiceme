import React from 'react'
import './styles/AppTable.css'

export default function AppTable(props) {

  const { headers, rows, flexBasis="25%", 
    tableStyles=null, headerStyles, headerItemStyles,
    lastHeaderClassName } = props

  const headersRender = headers?.map((header, index) => {
    return <h5
      key={index}
      className={`header-item ${index === headers.length-1 ? lastHeaderClassName : ''}`}
      style={{ flexBasis, ...headerItemStyles }}
    >
      {header}
    </h5>
  })

  return (
    <div className="app-table-container">
      <div 
        className="app-table"
        style={tableStyles}
      >
        <div 
          className="headers"
          style={headerStyles}
        >
          {headersRender}
        </div>
        <div className="rows">
          {rows}
        </div>
      </div>
    </div>
  )
}
