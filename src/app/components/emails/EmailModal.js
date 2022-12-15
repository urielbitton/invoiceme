import { StoreContext } from "app/store/store"
import React, { useContext, useState } from 'react'
import ContactSearchDropdown from "../contacts/ContactSearchDropdown"
import AppButton from "../ui/AppButton"
import { AppInput } from "../ui/AppInputs"
import AppModal from "../ui/AppModal"
import FileUploader from "../ui/FileUploader"
import WysiwygEditor from "../ui/WysiwygEditor"
import './styles/EmailModal.css'

export default function EmailModal(props) {

  const { myUserID } = useContext(StoreContext)
  const { showModal, setShowModal, fromEmail, setFromEmail,
    sendEmail, loading, toEmail, setToEmail, subject, setSubject,
    message, setMessage, files, setFiles, disableFrom,
    disableTo } = props
  const [query, setQuery] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const filters = `ownerID: ${myUserID}`
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
        {
          !disableTo ?
            <div className={`to-row ${toEmail.length > 0 ? 'has-email' : ''}`}>
              <h6>To:</h6>
              {
                toEmail.length > 0 && 
                <span 
                  className="to-email"
                  style={{background: 'var(--extraLightPrimary)'}}
                >
                  {toEmail}
                  <i 
                    className="fal fa-times" 
                    onClick={() => {
                      setToEmail('')
                      setQuery('')
                    }} 
                  />
                </span>
              }
              {
                toEmail.length === 0 &&
                <ContactSearchDropdown
                  query={query}
                  setQuery={setQuery}
                  loading={searchLoading}
                  setLoading={setSearchLoading}
                  filters={filters}
                  onUserClick={(contact) => setToEmail(contact.email)}
                />
              }
            </div>
            :
            <AppInput
              label="To:"
              value={toEmail}
              onChange={e => setToEmail(e.target.value)}
              disabled={disableTo}
            />
        }
        <AppInput
          label="Subject:"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <WysiwygEditor
          html={message}
          setHtml={setMessage}
          placeholder="Message here..."
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
