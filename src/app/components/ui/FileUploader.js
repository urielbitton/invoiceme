import React, { useState } from 'react'
import './styles/FileUploader.css'
import { convertBytesToKbMbGb, fileTypeConverter, uploadMultipleFilesLocal } from "app/utils/fileUtils"
import DotsLoader from "./DotsLoader"
import PreventTabClose from "./PreventTabClose"
import IconContainer from "./IconContainer"
import { truncateText } from "app/utils/generalUtils"

export default function FileUploader(props) {

  const { inputRef, isDragging, setIsDragging, uploadedFiles, setUploadedFiles,
    maxFileSize, icon, text } = props
  const [loading, setLoading] = useState(false)
  const preventClose = !!uploadedFiles?.length || loading

  const uploadedFilesRender = uploadedFiles?.map((file, i) => {
    return <div 
      className="file-item"
      key={i}
    >
      {
        file?.file?.type.includes("image") ?
        <img src={file?.src} /> :
        file?.file?.type.includes('video') ?
        <video autoPlay src={file?.src} controls loop /> :
        <div className="text">
          <IconContainer
            icon={fileTypeConverter(file?.file?.type)?.icon}
            iconColor={fileTypeConverter(file?.file?.type)?.color}
            bgColor="#fff"
            dimensions="30px"
            round={false}
            style={{border: "1px solid var(--inputBorderColor)"}}
          />
          <h6 title={file?.file?.name}>
            {truncateText(file?.file?.name, 25)}&emsp;{convertBytesToKbMbGb(file?.file?.size,0)}
          </h6>
        </div>
      }
      <i 
        className="fal fa-times remove-icon"
        onClick={() => setUploadedFiles(uploadedFiles?.filter((_, j) => j !== i))}
      />
    </div>
  })

  return (
    <div className="app-file-uploader">
      <label className={`upload-container ${isDragging ? 'dragging' : ''}`}>
        <input 
          type="file" 
          multiple 
          accept="image/*, application/*"
          ref={inputRef}
          onChange={(e) => uploadMultipleFilesLocal(e, maxFileSize, setUploadedFiles, setLoading)}
          onDragEnter={() => setIsDragging(true)}
          onDrop={() => setIsDragging(false)}
          onDragLeave={() => setIsDragging(false)}
          onDragEnd={() => setIsDragging(false)}
        />
        <i className={icon}></i>
        <h5>{text}</h5>
        <DotsLoader 
          dimensions="30px" 
          loading={loading} 
        />
      </label>
      {
        uploadedFiles?.length > 0 &&
        <div className="uploaded-files-container">
          {uploadedFilesRender}
        </div>
      }
      <PreventTabClose preventClose={preventClose} />
    </div>
  )
}
