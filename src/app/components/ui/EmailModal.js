import React, { useState } from 'react'
import AppButton from "./AppButton"
import { AppInput, AppTextarea } from "./AppInputs"
import AppModal from "./AppModal"
import FileUploader from "./FileUploader"
import './styles/EmailModal.css'

export default function EmailModal(props) {

  const { showModal, setShowModal, fromEmail, sendEmail,
    loading, toEmail, subject, setSubject,
    message, setMessage, files, setFiles } = props
  const [isDragging, setIsDragging] = useState(false)
  const maxFileSize = 1024 * 1024 * 5

  return (
    <AppModal
      showModal={showModal}
      setShowModal={setShowModal}
      label="New Email"
      portalClassName="new-email-modal"
      actions={
        <>
          <AppButton
            label="Send"
            buttonType="black"
            onClick={() => sendEmail()}
            rightIcon={loading ? 'fas fa-spinner fa-spin' : 'far fa-paper-plane'}
          />
          <AppButton
            label="Cancel"
            onClick={() => setShowModal(false)}
            buttonType="invertedBtn"
          />
        </>
      }
    >
      <form onSubmit={(e) => e.preventDefault()}>
        <AppInput
          label="From:"
          value={fromEmail}
          disabled
        />
        <AppInput
          label="To:"
          value={toEmail}
          disabled
        />
        <AppInput
          label="Subject:"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <AppTextarea
          placeholder="Message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <FileUploader
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          uploadedFiles={files}
          setUploadedFiles={setFiles}
          maxFileSize={maxFileSize}
          icon="fas fa-paperclip"
          text="Attach Files"
          truncateFilenameAmpount={60}
        />
      </form>
    </AppModal>
  )
}
