import { successToast } from "app/data/toastsTemplates"
import { db, functions } from "app/firebase/fire"
import {
  convertInputDateToDateAndTimeFormat,
  dateToMonthName,
  getYearsBetween
} from "app/utils/dateUtils"
import { deleteDB, getRandomDocID, setDB, updateDB } from "./CrudDB"
import { sendHtmlToEmailAsPDF } from "./emailServices"
import { createNotification } from "./notifServices"

const catchError = (err, setLoading) => {
  setLoading(false)
  console.log(err)
}

export const getInvoicesByUserID = (userID, setInvoices, limit) => {
  db.collection('users')
    .doc(userID)
    .collection('invoices')
    .orderBy('dateCreated', 'desc')
    .limit(limit)
    .onSnapshot(snapshot => {
      setInvoices(snapshot.docs.map(doc => doc.data()))
    })
}

export const getInvoiceByID = (userID, invoiceID, setInvoice) => {
  db.collection('users')
    .doc(userID)
    .collection('invoices')
    .doc(invoiceID)
    .onSnapshot(snapshot => {
      setInvoice(snapshot.data())
    })
}

export const getYearInvoicesByUserID = (userID, year, setInvoices, limit) => {
  db.collection('users')
    .doc(userID)
    .collection('invoices')
    .where('dateCreated', '>=', new Date(year, 0, 1))
    .where('dateCreated', '<=', new Date(year, 11, 31))
    .orderBy('dateCreated', 'desc')
    .limit(limit)
    .onSnapshot(snapshot => {
      setInvoices(snapshot.docs.map(doc => doc.data()))
    })
}

export const getYearAndMonthInvoicesByUserID = (userID, year, month, setInvoices, limit) => {
  db.collection('users')
    .doc(userID)
    .collection('invoices')
    .where('dateCreated', '>=', new Date(year, month, 0))
    .where('dateCreated', '<=', new Date(year, month, 31))
    .orderBy('dateCreated', 'desc')
    .limit(limit)
    .onSnapshot(snapshot => {
      setInvoices(snapshot.docs.map(doc => doc.data()))
    })
}

export const getInvoicesByContactEmail = (userID, email, setInvoices) => {
  db.collection('users')
    .doc(userID)
    .collection('invoices')
    .where('invoiceTo.email', '==', email)
    .orderBy('dateCreated', 'desc')
    .onSnapshot(snapshot => {
      setInvoices(snapshot.docs.map(doc => doc.data()))
    })
}

export const getScheduledInvoicesByUserID = (userID, setInvoices) => {
  db.collection('scheduledInvoices')
    .where('ownerID', '==', userID)
    .orderBy('dateCreated', 'desc')
    .onSnapshot(snapshot => {
      setInvoices(snapshot.docs.map(doc => doc.data()))
    })
}

export const getScheduledInvoiceByUserID = (userID, scheduleID, setInvoice) => {
  db.collection('scheduledInvoices')
    .where('ownerID', '==', userID)
    .where('scheduleID', '==', scheduleID)
    .onSnapshot(snapshot => {
      setInvoice(snapshot.docs.map(doc => doc.data())[0])
    })
}

export const getEarliestYearInvoice = (userID) => {
  return db.collection('users')
    .doc(userID)
    .collection('invoices')
    .orderBy('dateCreated', 'asc')
    .limit(1)
    .get()
    .then(snap => {
      return snap.docs[0]?.data()?.dateCreated?.toDate()?.getFullYear()
    })
}

export const getInvoiceYearOptions = (userID, setOptions) => {
  return getEarliestYearInvoice(userID)
    .then((year) => {
      setOptions(getYearsBetween(year, new Date().getFullYear()))
    })
}

export const createInvoiceService = (userID, myBusiness, taxNumbers, invoiceCurrency, invoiceDate,
  invoiceDueDate, invoiceNumber, invoiceContact, invoiceItems, invoiceNotes, taxRate1, taxRate2,
  calculatedSubtotal, calculatedTotal, invoiceName, status, setToasts, notify) => {
  const path = `users/${userID}/invoices`
  const docID = getRandomDocID(path)
  const invoiceData = {
    currency: invoiceCurrency,
    dateCreated: convertInputDateToDateAndTimeFormat(invoiceDate),
    dateDue: convertInputDateToDateAndTimeFormat(invoiceDueDate),
    invoiceID: docID,
    invoiceNumber: `INV-${invoiceNumber}`,
    invoiceOwnerID: userID,
    invoiceTo: invoiceContact,
    isPaid: status === 'paid',
    isSent: false,
    items: invoiceItems,
    monthLabel: dateToMonthName(convertInputDateToDateAndTimeFormat(invoiceDate)),
    myBusiness,
    notes: invoiceNotes,
    status,
    taxNumbers,
    taxRate1,
    taxRate2,
    subtotal: calculatedSubtotal,
    total: calculatedTotal,
    title: invoiceName
  }
  return setDB(path, docID, invoiceData)
    .then(() => {
      notify && createNotification(
        userID,
        'Invoice Created',
        `Invoice ${invoiceName} (${invoiceData.invoiceNumber}) has been created for ${invoiceContact.name}.`,
        'fas fa-file-invoice-dollar',
        `/invoices/${docID}`
      )
      setToasts(successToast("Invoice created successfully"))
    })
    .catch(err => console.log(err))
}

export const updateInvoiceService = (myUserID, invoiceID, updatedProps, newTotalRevenue,
  setLoading, setToasts, notify) => {
  setLoading(true)
  return updateDB(`users/${myUserID}/invoices`, invoiceID, updatedProps)
    .then(() => {
      setLoading(false)
      return updateDB('users', myUserID, {
        totalRevenue: newTotalRevenue,
      })
        .then(() => {
          setLoading(false)
          notify && createNotification(
            myUserID,
            'Invoice Updated',
            `Invoice ${updatedProps.title} (${updatedProps.invoiceNumber}) has been updated.`,
            'fas fa-file-invoice-dollar',
            `/invoices/${invoiceID}`
          )
          setToasts(successToast("Invoice updated."))
        })
        .catch(err => catchError(err, setLoading))
    })
    .catch(err => catchError(err, setLoading))
}

export const deleteInvoiceService = (myUserID, invoiceID, setLoading, setToasts, notify) => {
  const confirm = window.confirm("Are you sure you want to delete this invoice?")
  if (confirm) {
    setLoading(true)
    return deleteDB(`users/${myUserID}/invoices`, invoiceID)
      .then(() => {
        setLoading(false)
        notify && createNotification(
          myUserID,
          'Invoice Deleted',
          `Invoice has been deleted.`,
          'fas fa-file-invoice-dollar',
          `/invoices`
        )
        setToasts(successToast("Invoice deleted"))
      })
      .catch(err => catchError(err, setLoading))
  }
}

export const sendInvoiceService = (from, to, subject, emailHTML, pdfHTMLElement, invoiceFilename, uploadedFiles,
  myUserID, invoiceID, invoiceNumber, setLoading, setToasts, notify) => {
  const confirm = window.confirm("Send invoice to client?")
  const isType = 'invoice'
  if (confirm) {
    setLoading(true)
    return sendHtmlToEmailAsPDF(
      from,
      to,
      subject,
      emailHTML,
      pdfHTMLElement,
      invoiceFilename,
      uploadedFiles.map(file => file.file),
      isType
    )
      .then(() => {
        updateDB(`users/${myUserID}/invoices`, invoiceID, {
          isSent: true,
        })
          .then(() => {
            setLoading(false)
            setToasts(successToast("Invoice sent to client."))
            notify && createNotification(
              myUserID,
              'Invoice sent to client',
              `Invoice ${invoiceNumber} has been sent to ${to}.`,
              'fas fa-paper-plane',
              `/invoices/${invoiceID}`
            )
              .catch(err => console.log(err))
          })
          .catch(err => console.log(err))
      })
      .catch(err => catchError(err, setLoading))
  }
}

export const createScheduledInvoiceService = (myUser, invoiceDate, invoiceDueDate, invoiceNumber,
  invoiceCurrency, invoiceContact, invoiceItems, invoiceNotes, calculatedSubtotal, taxRate1, taxRate2,
  invoiceTitle, calculatedTotal, dayOfMonth, timeOfDay, scheduleTitle, emailMessage, isActive, 
  invoicePaperHTML, notify
  ) => {
  const pathName = 'scheduledInvoices'
  const docID = getRandomDocID(pathName)
  const invoiceTemplate = {
    currency: invoiceCurrency || { name: 'Canadian Dollar', value: 'CAD', symbol: '$' },
    dateCreated: convertInputDateToDateAndTimeFormat(invoiceDate),
    dateDue: convertInputDateToDateAndTimeFormat(invoiceDueDate),
    invoiceNumber: `INV-${invoiceNumber}`,
    invoiceOwnerID: myUser.userID,
    invoiceTo: invoiceContact,
    isPaid: false,
    isSent: false,
    isScheduled: true,
    items: invoiceItems,
    monthLabel: dateToMonthName(new Date()),
    notes: invoiceNotes,
    partOfTotal: false,
    status: 'unpaid',
    subtotal: calculatedSubtotal,
    taxRate1: +taxRate1,
    taxRate2: +taxRate2,
    title: invoiceTitle,
    total: calculatedTotal
  }
  const data = {
    isActive,
    dateCreated: new Date(),
    dayOfMonth: +dayOfMonth,
    timeOfDay: +timeOfDay,
    lastRan: null,
    lastPaid: null,
    title: scheduleTitle,
    emailMessage,
    invoiceTemplate,
    invoicePaperHTML,
    scheduleID: docID,
    ownerID: myUser.userID,
  }
  return setDB(pathName, docID, data)
    .then(() => {
      notify && createNotification(
        myUser.userID,
        'Scheduled Invoice Created',
        `Scheduled invoice ${scheduleTitle} has been created.`,
        'fas fa-clock',
        `/settings/scheduled-invoices/new?scheduleID=${docID}&edit=true&mode=view`
      )
    })
    .catch(err => console.log(err))
}

export const updateScheduledInvoiceService = (scheduleID, updatedProps, setLoading, notify) => {
  setLoading(true)
  return updateDB(`scheduledInvoices`, scheduleID, updatedProps)
    .then(() => {
      setLoading(false)
      notify && createNotification(
        updatedProps.ownerID,
        'Scheduled Invoice Updated',
        `Scheduled invoice ${updatedProps.title} has been updated.`,
        'fas fa-clock',
        `/settings/scheduled-invoices/new?scheduleID=${scheduleID}&edit=true&mode=view`
      )
    })
    .catch(err => catchError(err, setLoading))
}

export const deleteScheduledInvoiceService = (myUserID, scheduleID, setLoading, setToasts, notify) => {
  const confirm = window.confirm("Are you sure you want to delete this scheduled invoice?")
  if (!confirm) return
  setLoading(true)
  return deleteDB(`scheduledInvoices`, scheduleID)
    .then(() => {
      setLoading(false)
      notify && createNotification(
        myUserID,
        'Scheduled Invoice Deleted',
        `Scheduled invoice has been deleted.`,
        'fas fa-clock',
        `/settings/scheduled-invoices`
      )
      setToasts(successToast("Scheduled invoice deleted."))
    })
    .catch(err => catchError(err, setLoading))
}

export const renderPdfToStringService = (htmlElement) => {
  return functions.httpsCallable('pdfRenderToString')({ htmlElement })
    .then(res => res.data)  
    .catch(err => console.log(err))
}