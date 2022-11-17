import React from 'react'
import './styles/AvatarUploader.css'
import { uploadMultipleFilesLocal } from "app/utils/fileUtils"
import PreventTabClose from "./PreventTabClose"

export default function AvatarUploader(props) {

  const { className, imgOnClick, saveOnClick, src, alt, 
    editRights, inputRef, uploadedImg, setUploadedImg } = props

  const cancelOnClick = () => {
    setUploadedImg(null)
  }

  return (
    <div className={`avatar-uploader ${className}`}>
      <img
        src={src}
        onClick={imgOnClick}
        alt={alt}
      />
      {
        editRights &&
        <>
          <label>
            <i className="fas fa-camera"></i>
            <input 
              type="file" 
              accept="image/*"
              style={{"display": "none"}}
              ref={inputRef}
              onChange={(e) => uploadMultipleFilesLocal(e, 2097152, setUploadedImg, inputRef)}
            />
          </label>
          {
            uploadedImg?.file &&
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
