import React, { useContext } from 'react'
import './styles/AvatarUploader.css'
import { uploadFileLocal } from "app/utils/fileUtils"
import PreventTabClose from "./PreventTabClose"
import { StoreContext } from "app/store/store"

export default function AvatarUploader(props) {

  const { setToasts } = useContext(StoreContext)
  const { dimensions=140, className, imgOnClick, saveOnClick, src, alt, 
    editRights=true, setLoading, uploadedImg, setUploadedImg,
    directSaving } = props
  const maxFileUploadSize = 1024 * 1024 * 4

  const cancelOnClick = () => {
    setUploadedImg(null)
  }

  return (
    <div 
      className={`avatar-uploader ${className}`}
      style={{width: dimensions, height: dimensions}}
    >
      <img
        src={src || 'https://i.imgur.com/D4fLSKa.png'}
        onClick={imgOnClick}
        alt={alt || 'avatar'}
      />
      {
        editRights &&
        <>
          <label>
            <i className="fas fa-camera"></i>
            <input 
              type="file" 
              accept="image/*"
              hidden
              onChange={(e) => uploadFileLocal(e, maxFileUploadSize, setUploadedImg, setLoading, setToasts)}
            />
          </label>
          {
            directSaving && uploadedImg?.file && 
            <>
            <span 
              className="avatar-icon save-icon"
              onClick={saveOnClick}
            >
              <i className="far fa-check"/>
            </span>
            <span 
              className="avatar-icon cancel-icon"
              onClick={cancelOnClick}
            >
              <i className="far fa-times"/>
            </span>
            </>
          }
        </>
      }
      <PreventTabClose preventClose={uploadedImg?.file} />
    </div>
  )
}
