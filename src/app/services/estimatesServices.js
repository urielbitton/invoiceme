import { db } from "app/firebase/fire"
import { dateToMonthName } from "app/utils/dateUtils"
import { deleteDB, firebaseIncrement, getRandomDocID, setDB, updateDB } from "./CrudDB"
import { sendHtmlToEmailAsPDF } from "./emailServices"
import { createNotification } from "./notifServices"

export const getEstimatesByUserID = (userID, setEstimates, limit) => {
  db.collection('users')
    .doc(userID)
    .collection('estimates')
    .orderBy('dateCreated', 'desc')
    .limit(limit)
    .onSnapshot(snapshot => {
      setEstimates(snapshot.docs.map(doc => doc.data()))
    })
}

export const getEstimateByID = (userID, estimateID, setEstimate) => {
  db.collection('users')
    .doc(userID)
    .collection('estimates')
    .doc(estimateID)
    .onSnapshot(snapshot => {
      setEstimate(snapshot.data())
    })
}

export const createEstimateService = (userID, estimateCurrency, estimateDate, estimateDueDate, estimateNumber, estimateContact,
  estimateItems, estimateNotes, taxRate1, taxRate2, calculatedSubtotal,
  calculatedTotal, estimateName) => {
  const path = `users/${userID}/estimates`
  const docID = getRandomDocID(path)
  const estimateData = {
    currency: estimateCurrency,
    dateCreated: new Date(estimateDate),
    dateDue: new Date(estimateDueDate),
    estimateID: docID,
    estimateNumber: `EST-${estimateNumber}`,
    estimateOwnerID: userID,
    estimateTo: estimateContact,
    isSent: false,
    items: estimateItems,
    monthLabel: dateToMonthName(new Date(estimateDate)),
    notes: estimateNotes,
    taxRate1,
    taxRate2,
    subtotal: calculatedSubtotal,
    total: calculatedTotal,
    title: estimateName
  }
  return setDB(path, docID, estimateData)
    .then(() => {
      updateDB('users', userID, {
        estimatesNum: firebaseIncrement(1)
      })
      createNotification(
        userID,
        'Estimate Created',
        `Estimate ${estimateName} (${estimateData.estimateNumber}) has been created for ${estimateContact.name}.`,
        'fas fa-file-invoice',
        `/estimates/${docID}`
      )
    })
    .catch(err => console.log(err))
}

export const updateEstimateService = (userID, estimateID, updatedProps, setLoading) => {
  setLoading(true)
  return updateDB(`users/${userID}/estimates`, estimateID, updatedProps)
  .then(() => {
    setLoading(false)
  })
  .catch(err => {
    console.log(err)
    setLoading(false)
  })
}

export const deleteEstimateService = (myUserID, estimateID, setLoading) => {
  const confirm = window.confirm("Are you sure you want to delete this estimate?")
    if (confirm) {
      setLoading(true)
      return deleteDB(`users/${myUserID}/estimates`, estimateID)
      .then(() => {
        return updateDB('users', myUserID, {
          estimatesNum: firebaseIncrement(-1),
        })
        .then(() => {
          setLoading(false)
        })
        .catch(err => {
          console.log(err)
          setLoading(false)
        })
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
    }
}

export const sendEstimateService = (to, subject, emailHTML, pdfHTMLElement, estimateFilename, uploadedFiles,
  myUserID, estimateID, estimateNumber, setPageLoading) => {
    const confirm = window.confirm("Send estimate to client?")
    if(confirm) {
      setPageLoading(true)
      return sendHtmlToEmailAsPDF(
        to,
        subject,
        emailHTML,
        pdfHTMLElement,
        estimateFilename,
        uploadedFiles.map(file => file.file)
      )
      .then(() => {
        updateDB(`users/${myUserID}/estimates`, estimateID, {
          isSent: true, 
        })
        .catch(err => console.log(err))
        createNotification(
          myUserID,
          'Estimate sent to client',
          `Estimate ${estimateNumber} has been sent to ${to}.`,
          'fas fa-paper-plane',
          `/invoices/${estimateID}`
        )
        .catch(err => console.log(err))
        setPageLoading(false)
        alert("Estimate sent to client.")
      })
      .catch((error) => {
        setPageLoading(false)
        alert(error)
      })
    }
}