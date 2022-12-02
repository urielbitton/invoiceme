const functions = require("firebase-functions")
const algoliasearch = require('algoliasearch')
const firebase = require("firebase-admin")
firebase.initializeApp()
const firestore = firebase.firestore()
const sgMail = require('@sendgrid/mail')

const APP_ID = functions.config().algolia.app
const API_KEY = functions.config().algolia.key
sgMail.setApiKey(functions.config().sendgrid.key)
const twilioSid = functions.config().twilio.sid
const twilioToken = functions.config().twilio.token
const twilio = require('twilio')(twilioSid, twilioToken)

// @ts-ignore
const client = algoliasearch(APP_ID, API_KEY)
const invoicesIndex = client.initIndex('invoices_index')
const estimatesIndex = client.initIndex('estimates_index')
const contactsIndex = client.initIndex('contacts_index')

//Algolia Search functions

//invoices collection
exports.addToIndexInvoice = functions
  .region('northamerica-northeast1')
  .firestore.document('users/{userID}/invoices/{invoiceID}').onCreate(snapshot => {
    const data = snapshot.data()
    const objectID = snapshot.id
    return invoicesIndex.saveObject({ ...data, objectID })
  })
exports.updateIndexInvoices = functions
  .region('northamerica-northeast1')
  .firestore.document('users/{userID}/invoices/{invoiceID}').onUpdate((change) => {
    const newData = change.after.data()
    const objectID = change.after.id
    return invoicesIndex.saveObject({ ...newData, objectID })
  })
exports.deleteFromIndexInvoices = functions
  .region('northamerica-northeast1')
  .firestore.document('users/{userID}/invoices/{invoiceID}').onDelete(snapshot => {
    invoicesIndex.deleteObject(snapshot.id)
  })

//contacts collection
exports.addToIndexContacts = functions
  .region('northamerica-northeast1')
  .firestore.document('users/{userID}/contacts/{contactID}').onCreate(snapshot => {
    const data = snapshot.data()
    const objectID = snapshot.id
    return contactsIndex.saveObject({ ...data, objectID })
  })
exports.updateIndexContacts = functions
  .region('northamerica-northeast1')
  .firestore.document('users/{userID}/contacts/{contactID}').onUpdate((change) => {
    const newData = change.after.data()
    const objectID = change.after.id
    return contactsIndex.saveObject({ ...newData, objectID })
  })
exports.deleteFromIndexContacts = functions
  .region('northamerica-northeast1')
  .firestore.document('users/{userID}/contacts/{contactID}').onDelete(snapshot => {
    contactsIndex.deleteObject(snapshot.id)
  })

//estimates collection
exports.addToIndexEstimates = functions
  .region('northamerica-northeast1')
  .firestore.document('users/{userID}/estimates/{estimateID}').onCreate(snapshot => {
    const data = snapshot.data()
    const objectID = snapshot.id
    return estimatesIndex.saveObject({ ...data, objectID })
  })
exports.updateIndexEstimates = functions
  .region('northamerica-northeast1')
  .firestore.document('users/{userID}/estimates/{estimateID}').onUpdate((change) => {
    const newData = change.after.data()
    const objectID = change.after.id
    return estimatesIndex.saveObject({ ...newData, objectID })
  })
exports.deleteFromIndexEstimates = functions
  .region('northamerica-northeast1')
  .firestore.document('users/{userID}/estimates/{estimateID}').onDelete(snapshot => {
    estimatesIndex.deleteObject(snapshot.id)
  })


// Sendgrid email with attachment
exports.sendEmailWithAttachment = functions
  .https.onCall((data, context) => {
    const msg = {
      from: data.from,
      to: data.to,
      subject: data.subject,
      html: data.html,
      attachments: data.attachments
    }
    return sgMail.send(msg)
      .catch(err => console.log(err))
  })

// Twilio voice call
exports.callPhone = functions
  .https.onCall((data, context) => {
    const { phone } = data
    return twilio.calls.create({
      url: 'http://demo.twilio.com/docs/voice.xml',
      to: phone,
      from: '+15087156100'
    })
      .then(call => console.log(call.sid))
      .catch(err => console.log(err))
  })

// Twilio SMS
exports.sendSMS = functions
  .https.onCall((data, context) => {
    const { phone, message } = data
    return twilio.messages.create({
      body: message,
      to: phone,
      from: '+15087156100',
      mediaUrl: data.mediaUrl
    })
      .then(message => console.log(message.sid))
      .catch(err => console.log(err))
  })


//Scheduled functions

// 9am EST every day
exports.runScheduledInvoices9am = functions.pubsub
  .schedule('0 9 * * *')
  .onRun((context) => {
    const dayOfMonth = new Date().getDate()
    return firestore.collection('scheduledInvoices')
      .where('dayOfMonth', '==', dayOfMonth)
      .where('timeOfDay', '==', 9)
      .where('active', '==', true)
      .get()
      .then((scheduledInvoices) => {
        const now = firebase.firestore.Timestamp.now()
        const monthNum = new Date().getMonth()
        const year = new Date().getFullYear()
        const batch = firestore.batch()
        scheduledInvoices.forEach(schedule => {
          const data = schedule.data()
          const path = `users/${data.ownerID}/invoices`
          const docID = firestore.collection(path).doc().id
          const docRef = firestore.collection(path).doc(docID)
          batch.set(docRef, {
            currency: data.invoiceTemplate.invoiceCurrency,
            dateCreated: now,
            dateDue: data.invoiceTemplate.dateDue,
            invoiceID: data.invoiceTemplate.invoiceID,
            invoiceNumber: `${data.invoiceTemplate.invoiceNumber}-${monthNum}-${dayOfMonth}-${year}`,
            invoiceOwnerID: data.invoiceTemplate.invoiceOwnerID,
            invoiceTo: data.invoiceTemplate.invoiceTo,
            isPaid: false,
            isSent: false,
            items: data.invoiceTemplate.items,
            monthLabel: data.invoiceTemplate.monthLabel,
            myBusiness: data.invoiceTemplate.myBusiness,
            notes: data.invoiceTemplate.notes,
            status: data.invoiceTemplate.status,
            taxNumbers: data.invoiceTemplate.taxNumbers,
            taxRate1: data.invoiceTemplate.taxRate1,
            taxRate2: data.invoiceTemplate.taxRate2,
            subtotal: data.invoiceTemplate.subtotal,
            total: data.invoiceTemplate.total,
            title: data.invoiceTemplate.title,
          })
        })
        return batch.commit()
          .then(() => {
            scheduledInvoices.forEach(snapshot => {
              snapshot.ref.update({ lastSent: now })
              const data = snapshot.data()
              const msg = {
                to: data.invoiceTemplate.invoiceTo.email,
                from: 'info@atomicsdigital.com',
                subject: data.emailSubject,
                html: data.emailMessage,
                attachments: [{
                  content: data.invoicePaperHTML.toString('base64'),
                  filename: `${data.invoiceTemplate.invoiceNumber}-${monthNum}-${dayOfMonth}-${year}.pdf`,
                  type: 'application/pdf',
                  disposition: 'attachment'
                }]
              }
              return sgMail.send(msg)
            })
          })
      })
  })

// 12pm EST every day
exports.runScheduledInvoices12pm = functions.pubsub
  .schedule('0 12 * * *')
  .onRun((context) => {
    const dayOfMonth = new Date().getDate()
    return firestore.collection('scheduledInvoices')
      .where('dayOfMonth', '==', dayOfMonth)
      .where('timeOfDay', '==', 12)
      .where('active', '==', true)
      .get()
      .then(scheduledInvoices => {
        const now = firebase.firestore.Timestamp.now()
        const monthNum = new Date().getMonth()
        const year = new Date().getFullYear()
        const batch = firestore.batch()
        scheduledInvoices.forEach(schedule => {
          const data = schedule.data()
          const path = `users/${data.ownerID}/invoices`
          const docID = firestore.collection(path).doc().id
          const docRef = firestore.collection(path).doc(docID)
          batch.set(docRef, {
            currency: data.invoiceTemplate.invoiceCurrency,
            dateCreated: now,
            dateDue: data.invoiceTemplate.dateDue,
            invoiceID: data.invoiceTemplate.invoiceID,
            invoiceNumber: `${data.invoiceTemplate.invoiceNumber}-${monthNum}-${dayOfMonth}-${year}`,
            invoiceOwnerID: data.invoiceTemplate.invoiceOwnerID,
            invoiceTo: data.invoiceTemplate.invoiceTo,
            isPaid: false,
            isSent: false,
            items: data.invoiceTemplate.items,
            monthLabel: data.invoiceTemplate.monthLabel,
            myBusiness: data.invoiceTemplate.myBusiness,
            notes: data.invoiceTemplate.notes,
            status: data.invoiceTemplate.status,
            taxNumbers: data.invoiceTemplate.taxNumbers,
            taxRate1: data.invoiceTemplate.taxRate1,
            taxRate2: data.invoiceTemplate.taxRate2,
            subtotal: data.invoiceTemplate.subtotal,
            total: data.invoiceTemplate.total,
            title: data.invoiceTemplate.title,
          })
        })
        return batch.commit()
          .then(() => {
            scheduledInvoices.forEach(snapshot => {
              snapshot.ref.update({ lastSent: now })
              const data = snapshot.data()
              const msg = {
                to: data.invoiceTemplate.invoiceTo.email,
                from: 'info@atomicsdigital.com',
                subject: data.emailSubject,
                html: data.emailMessage,
                attachments: [{
                  content: data.invoicePaperHTML.toString('base64'),
                  filename: `${data.invoiceTemplate.invoiceNumber}-${monthNum}-${dayOfMonth}-${year}.pdf`,
                  type: 'application/pdf',
                  disposition: 'attachment'
                }]
              }
              return sgMail.send(msg)
            })
          })
      })
  })

// 3pm EST every day
exports.runScheduledInvoices3pm = functions.pubsub
  .schedule('0 15 * * *')
  .onRun((context) => {
    const dayOfMonth = new Date().getDate()
    return firestore.collection('scheduledInvoices')
      .where('dayOfMonth', '==', dayOfMonth)
      .where('timeOfDay', '==', 15)
      .where('active', '==', true)
      .get()
      .then(scheduledInvoices => {
        const now = firebase.firestore.Timestamp.now()
        const monthNum = new Date().getMonth()
        const year = new Date().getFullYear()
        const batch = firestore.batch()
        scheduledInvoices.forEach(schedule => {
          const data = schedule.data()
          const path = `users/${data.ownerID}/invoices`
          const docID = firestore.collection(path).doc().id
          const docRef = firestore.collection(path).doc(docID)
          batch.set(docRef, {
            currency: data.invoiceTemplate.invoiceCurrency,
            dateCreated: now,
            dateDue: data.invoiceTemplate.dateDue,
            invoiceID: data.invoiceTemplate.invoiceID,
            invoiceNumber: `${data.invoiceTemplate.invoiceNumber}-${monthNum}-${dayOfMonth}-${year}`,
            invoiceOwnerID: data.invoiceTemplate.invoiceOwnerID,
            invoiceTo: data.invoiceTemplate.invoiceTo,
            isPaid: false,
            isSent: false,
            items: data.invoiceTemplate.items,
            monthLabel: data.invoiceTemplate.monthLabel,
            myBusiness: data.invoiceTemplate.myBusiness,
            notes: data.invoiceTemplate.notes,
            status: data.invoiceTemplate.status,
            taxNumbers: data.invoiceTemplate.taxNumbers,
            taxRate1: data.invoiceTemplate.taxRate1,
            taxRate2: data.invoiceTemplate.taxRate2,
            subtotal: data.invoiceTemplate.subtotal,
            total: data.invoiceTemplate.total,
            title: data.invoiceTemplate.title,
          })
        })
        return batch.commit()
          .then(() => {
            scheduledInvoices.forEach(snapshot => {
              snapshot.ref.update({ lastSent: now })
              const data = snapshot.data()
              const msg = {
                to: data.invoiceTemplate.invoiceTo.email,
                from: 'info@atomicsdigital.com',
                subject: data.emailSubject,
                html: data.emailMessage,
                attachments: [{
                  content: data.invoicePaperHTML.toString('base64'),
                  filename: `${data.invoiceTemplate.invoiceNumber}-${monthNum}-${dayOfMonth}-${year}.pdf`,
                  type: 'application/pdf',
                  disposition: 'attachment'
                }]
              }
              return sgMail.send(msg)
            })
          })
      })
  })

// 6pm EST every day
exports.runScheduledInvoices6pm = functions.pubsub
  .schedule('0 18 * * *')
  .onRun((context) => {
    const dayOfMonth = new Date().getDate()
    return firestore.collection('scheduledInvoices')
      .where('dayOfMonth', '==', dayOfMonth)
      .where('timeOfDay', '==', 18)
      .where('active', '==', true)
      .get()
      .then(scheduledInvoices => {
        const now = firebase.firestore.Timestamp.now()
        const monthNum = new Date().getMonth()
        const year = new Date().getFullYear()
        const batch = firestore.batch()
        scheduledInvoices.forEach(schedule => {
          const data = schedule.data()
          const path = `users/${data.ownerID}/invoices`
          const docID = firestore.collection(path).doc().id
          const docRef = firestore.collection(path).doc(docID)
          batch.set(docRef, {
            currency: data.invoiceTemplate.invoiceCurrency,
            dateCreated: now,
            dateDue: data.invoiceTemplate.dateDue,
            invoiceID: data.invoiceTemplate.invoiceID,
            invoiceNumber: `${data.invoiceTemplate.invoiceNumber}-${monthNum}-${dayOfMonth}-${year}`,
            invoiceOwnerID: data.invoiceTemplate.invoiceOwnerID,
            invoiceTo: data.invoiceTemplate.invoiceTo,
            isPaid: false,
            isSent: false,
            items: data.invoiceTemplate.items,
            monthLabel: data.invoiceTemplate.monthLabel,
            myBusiness: data.invoiceTemplate.myBusiness,
            notes: data.invoiceTemplate.notes,
            status: data.invoiceTemplate.status,
            taxNumbers: data.invoiceTemplate.taxNumbers,
            taxRate1: data.invoiceTemplate.taxRate1,
            taxRate2: data.invoiceTemplate.taxRate2,
            subtotal: data.invoiceTemplate.subtotal,
            total: data.invoiceTemplate.total,
            title: data.invoiceTemplate.title,
          })
        })
        return batch.commit()
          .then(() => {
            scheduledInvoices.forEach(snapshot => {
              snapshot.ref.update({ lastSent: now })
              const data = snapshot.data()
              const msg = {
                to: data.invoiceTemplate.invoiceTo.email,
                from: 'info@atomicsdigital.com',
                subject: data.emailSubject,
                html: data.emailMessage,
                attachments: [{
                  content: data.invoicePaperHTML.toString('base64'),
                  filename: `${data.invoiceTemplate.invoiceNumber}-${monthNum}-${dayOfMonth}-${year}.pdf`,
                  type: 'application/pdf',
                  disposition: 'attachment'
                }]
              }
              return sgMail.send(msg)
            })
          })
      })
  })
