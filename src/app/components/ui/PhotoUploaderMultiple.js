import React from 'react'
import './styles/PhotoUploaderMultiple.css'
import { uploadMultipleFilesLocal } from "app/utils/fileUtils"
import { useState } from "react"
import DotsLoader from "./DotsLoader"
import PreventTabClose from "./PreventTabClose"

export default function PhotoUploaderMultiple(props) {

  const { inputRef, isDragging, setIsDragging, uploadedImgs, setUploadedImgs,
    maxImgUploadSize, icon, text, largePreviews } = props
  const [loading, setLoading] = useState(false)
  const preventClose = !!uploadedImgs?.length || loading

  const uploadedImgsRender = uploadedImgs?.map((img, i) => {
    return <div 
      className={`img-item ${largePreviews ? 'large' : ''}`}
      key={i}
    >
      {
        img?.file?.type.includes("image") ?
        <img src={img?.img} /> :
        <video autoPlay src={img?.img} controls loop />
      }
      <div 
        className="icon-container"
        onClick={() => setUploadedImgs(uploadedImgs?.filter((_, j) => j !== i))}
      >
        <i className="fas fa-times"/>
      </div>
    </div>
  })

  return (
    <div className="photo-upload-comp">
      <label className={`upload-container ${isDragging ? 'dragging' : ''}`}>
        <input 
          type="file" 
          multiple 
          accept="image/*, video/*"
          ref={inputRef}
          onChange={(e) => uploadMultipleFilesLocal(e, maxImgUploadSize, setUploadedImgs, inputRef, setLoading)}
          onDragEnter={(e) => setIsDragging(true)}
          onDrop={() => setIsDragging(false)}
          onDragLeave={() => setIsDragging(false)}
          onDragEnd={() => setIsDragging(false)}
        />
        <i className={icon}></i>
        <h5>{text}</h5>
        <DotsLoader width={60} height={60} loading={loading} />
      </label>
      {
        uploadedImgs?.length > 0 &&
        <div className="uploaded-imgs-container">
          <h4>Uploaded Images ({uploadedImgs?.length})</h4>
          <div className="uploaded-imgs-flex">
            {uploadedImgsRender}
          </div>
        </div>
      }
      <PreventTabClose preventClose={preventClose} />
    </div>
  )
}
