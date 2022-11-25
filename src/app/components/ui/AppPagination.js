import React from 'react'
import { AppSelect } from "./AppInputs"
import './styles/AppPagination.css'

export default function AppPagination({pageNum, setPageNum, numOfPages, dimensions="35px"}) {

  const pagesNumRender = [...Array(numOfPages)]
  .map((num,i) => {
    return <div 
      className={`pagination-box number-box ${pageNum === i ? "active" : ""} ${i <= pageNum + 2 && i >= pageNum - 2 ? "" : "hidden"}`}
      style={{width: dimensions, height: dimensions}}
      onClick={() => setPageNum(i)}
      key={i}
    >
      <h6>{(i+1)}</h6>
    </div>
  })

  const selectOptions = [...Array(numOfPages)].map((_,i) => {
    return {label: (i+1), value: i}
  })

  return (
    <div className="app-pagination">
      <div className="pagination-row">
        <div 
          className={`pagination-box ${pageNum === 0 ? 'disabled' : 'enabled'}`}
          style={{width: dimensions, height: dimensions}}
          onClick={() => setPageNum(0)}
        >
          <i className="far fa-angle-double-left" />
        </div>
        <div 
          className={`pagination-box ${pageNum === 0 ? 'disabled' : 'enabled'}`}
          style={{width: dimensions, height: dimensions}}
          onClick={() => pageNum > 0 && setPageNum(pageNum-1)}
        >
          <i className="far fa-angle-left" />
        </div>
        {pagesNumRender}
        <div 
          className={`pagination-box ${pageNum === numOfPages-1 ? 'disabled' : 'enabled'}`}
          style={{width: dimensions, height: dimensions}}
          onClick={() => pageNum < numOfPages-1 && setPageNum(pageNum+1)}
        >
          <i className="far fa-angle-right" />
        </div>
        <div 
          className={`pagination-box ${pageNum === numOfPages-1 ? 'disabled' : 'enabled'}`}
          style={{width: dimensions, height: dimensions}}
          onClick={() => pageNum < numOfPages-1 && setPageNum(numOfPages-1)}
        >
          <i className="far fa-angle-double-right" />
        </div>
      </div>
      <AppSelect
        options={selectOptions}
        label="Jump to page"
        onChange={(e) => setPageNum(+e.target.value)}
        value={pageNum}
        containerStyles={{height: dimensions}}
      />
    </div>
  )
}
