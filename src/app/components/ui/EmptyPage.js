import React from 'react'
import './styles/EmptyPage.css'
import emptyPage from 'app/assets/images/empty-page-img.png'
import AppButton from "./AppButton"
import PageLoader from "./PageLoader"

export default function EmptyPage(props) {

  const { img=emptyPage, label, sublabel, btnLabel='Add', btnLink,
  btnClick, btnIcon, object } = props

  return !object && object !== null ? (
    <div className="empty-page">
      <img src={img} alt="no-results" />
      <h5>{label}</h5>
      <p>{sublabel}</p>
      {
        (btnLink || btnClick) &&
        <AppButton
          label={btnLabel}
          url={btnLink}
          onClick={btnClick}
          buttonType="tabActiveBtn"
          rightIcon={btnIcon}
        />
      }
    </div>
  ) :
  <PageLoader loading={!object}/>
}
