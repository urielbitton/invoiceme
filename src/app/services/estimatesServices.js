import { successToast } from "app/data/toastsTemplates"
import { db } from "app/firebase/fire"
import { convertInputDateToDateAndTimeFormat, 
  dateToMonthName, 
  getYearsBetween} from "app/utils/dateUtils"
import { deleteDB, firebaseIncrement, getRandomDocID, setDB, updateDB } from "./CrudDB"
import { sendHtmlToEmailAsPDF } from "./emailServices"
import { createNotification } from "./notifServices"

const catchError = (err, setLoading) => {
  setLoading(false)
  console.log(err)
}

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

export const getYearEstimatesByUserID = (userID, year, setEstimates, limit) => {
  db.collection('users')
  .doc(userID)
  .collection('estimates')
  .where('dateCreated', '>=', new Date(year, 0, 1))
  .where('dateCreated', '<=', new Date(year, 11, 31))
  .orderBy('dateCreated', 'desc')
  .limit(limit)
  .onSnapshot(snapshot => {
    setEstimates(snapshot.docs.map(doc => doc.data()))
  })
}

export const getYearAndMonthEstimatesByUserID = (userID, year, month, setEstimates, limit) => {
  db.collection('users')
  .doc(userID)
  .collection('estimates')
  .where('dateCreated', '>=', new Date(year, month, 0))
  .where('dateCreated', '<=', new Date(year, month, 31))
  .orderBy('dateCreated', 'desc')
  .limit(limit)
  .onSnapshot(snapshot => {
    setEstimates(snapshot.docs.map(doc => doc.data()))
  })
}

export const getEstimatesByContactEmail = (userID, email, setEstimates) => {
  db.collection('users')
  .doc(userID)
  .collection('estimates')
  .where('estimateTo.email', '==', email)
  .orderBy('dateCreated', 'desc')
  .onSnapshot(snapshot => {
    setEstimates(snapshot.docs.map(doc => doc.data()))
  })
}

export const getEarliestYearEstimate = (userID) => {
  return db.collection('users')
  .doc(userID)
  .collection('estimates')
  .orderBy('dateCreated', 'asc')
  .limit(1)
  .get()
  .then(snap => {
    return snap.docs[0]?.data()?.dateCreated?.toDate()?.getFullYear()
  })
}

export const getEstimateYearOptions = (userID, setOptions) => {
  return getEarliestYearEstimate(userID)
  .then((year) => {
    setOptions(getYearsBetween(year, new Date().getFullYear()))
  })
}

export const createEstimateService = (userID, myBusiness, taxNumbers, estimateCurrency, estimateDate, estimateDueDate, 
  estimateNumber, estimateContact, estimateItems, estimateNotes, taxRate1, taxRate2, 
  calculatedSubtotal, calculatedTotal, estimateName
) => {
  const path = `users/${userID}/estimates`
  const docID = getRandomDocID(path)
  const estimateData = {
    currency: estimateCurrency,
    dateCreated: convertInputDateToDateAndTimeFormat(estimateDate),
    dateDue: convertInputDateToDateAndTimeFormat(estimateDueDate),
    estimateID: docID,
    estimateNumber: `EST-${estimateNumber}`,
    estimateOwnerID: userID,
    estimateTo: estimateContact,
    isSent: false,
    items: estimateItems,
    monthLabel: dateToMonthName(convertInputDateToDateAndTimeFormat(estimateDate)),
    myBusiness,
    notes: estimateNotes,
    taxNumbers,
    taxRate1,
    taxRate2,
    subtotal: calculatedSubtotal,
    total: calculatedTotal,
    title: estimateName
  }
  return setDB(path, docID, estimateData)
    .then(() => {
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
  .catch(err => catchError(err, setLoading))
}

export const deleteEstimateService = (myUserID, estimateID, setLoading) => {
  const confirm = window.confirm("Are you sure you want to delete this estimate?")
    if (confirm) {
      setLoading(true)
      return deleteDB(`users/${myUserID}/estimates`, estimateID)
      .then(() => setLoading(false))
      .catch(err => catchError(err, setLoading))
    }
}

export const sendEstimateService = (from, to, subject, emailHTML, pdfHTMLElement, estimateFilename, uploadedFiles,
  myUserID, estimateID, estimateNumber, setLoading, setToasts) => {
    const confirm = window.confirm("Send estimate to client?")
    if(confirm) {
      setLoading(true)
      return sendHtmlToEmailAsPDF(
        from,
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
          `/estimates/${estimateID}`
        )
        .catch(err => console.log(err))
        setLoading(false)
        setToasts(successToast("Estimate sent to client."))
      })
      .catch(err => catchError(err, setLoading))
    }
}
