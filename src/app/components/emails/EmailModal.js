import React, { useState } from 'react'
import AppButton from "../ui/AppButton"
import { AppInput, AppTextarea } from "../ui/AppInputs"
import AppModal from "../ui/AppModal"
import FileUploader from "../ui/FileUploader"
import './styles/EmailModal.css'

export default function EmailModal(props) {

  const { showModal, setShowModal, fromEmail, setFromEmail,
    sendEmail, loading, toEmail, setToEmail, subject, setSubject,
    message, setMessage, files, setFiles, disableFrom,
    disableTo } = props
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
          onChange={e => setFromEmail(e.target.value)}
          disabled={disableFrom}
        />
        <AppInput
          label="To:"
          value={toEmail}
          onChange={e => setToEmail(e.target.value)}
          disabled={disableTo}
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
