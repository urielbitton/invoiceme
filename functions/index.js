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
const stripeLiveKey = functions.config().stripe.key
const stripeTestKey = functions.config().stripe.testkey
const twilio = require('twilio')(twilioSid, twilioToken)
// @ts-ignore
const stripe = require('stripe')(stripeTestKey)

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
    return twilio.messages.create({
      body: data.message,
      to: data.phone,
      from: '+15087156100',
      mediaUrl: data.mediaUrl
    })
      .then(message => console.log(message.sid))
      .catch(err => console.log(err))
  })


//Stripe calls
exports.createStripeAccount = functions
.https.onCall(async(data, context) => {
  const account = await stripe.accounts.create({
    country: data.country,
    email: data.email,
    individual: {
      first_name: data.firstName,
      last_name: data.lastName,
      phone: data.phone,
      address: {
        city: data.city,
        state: data.state,
        country: data.country,
        line1: data.address,
        line2: '',
        postal_code: data.postcode
      }
    },
    type: 'express',
    capabilities: {card_payments: {requested: true}, transfers: {requested: true}},
    business_type: 'individual',
    business_profile: { url: 'https://invoiceme.pro' },
  })
  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: 'http://localhost:3000/my-account/payments',
    return_url: 'http://localhost:3000/my-account/payments?details_submitted=true',
    type: 'account_onboarding',
  })
  return {account, accountLink}
})

exports.retrieveStripeAccount = functions
.https.onCall(async(data, context) => {
  const account = await stripe.accounts.retrieve(data.accountID)
  return account
})

exports.deleteStripeAccount = functions
.https.onCall(async(data, context) => {
  const account = await stripe.accounts.del(data.accountID)
  return account
})

exports.createPaymentMethod = functions
.https.onCall(async(data, context) => {
  const paymentMethod = await stripe.paymentMethods.create({
    type: data.type,
    card: {
      number: data.cardNumber,
      exp_month: data.expiryMonth,
      exp_year: data.expiryYear,
      cvc: data.cvc,
    },
  })
  return paymentMethod
})

exports.createStripeCustomer = functions
.https.onCall(async(data, context) => {
  console.log(data)
  const customer = await stripe.customers.create({
    name: data.name,
    email: data.email,
    phone: data.phone,
    address: {
      city: data.city,
      state: data.state,
      country: data.country,
      line1: data.address,
      line2: '',
      postal_code: data.postcode
    },
    shipping: null
  })
  return customer
})

exports.attachPaymentMethod = functions
.https.onCall(async(data, context) => {
  const paymentMethod = await stripe.paymentMethods.attach(
    data.paymentMethodID,
    {customer: data.customerID}
  )
  stripe.customers.update(data.customerID, {
    invoice_settings: {
      default_payment_method: data.paymentMethodID,
    },
  })
  return paymentMethod
})

exports.createStripeSubscription = functions
.https.onCall(async(data, context) => {
  const subscription = await stripe.subscriptions.create({
    customer: data.customerID,
    items: [{ price: data.priceID, quantity: data.quantity }],
    default_payment_method: data.paymentMethodID,
    payment_settings: {
      payment_method_types: ['card'],
    },
  })
  return subscription
})

exports.getSubscriptionsByCustomerID = functions
.https.onCall(async(data, context) => {
  const subscriptions = await stripe.subscriptions.list({
    customer: data.customerID
  })
  return subscriptions
})

exports.retrievePaymentMethod = functions
.https.onCall(async(data, context) => {
  const paymentMethod = await stripe.paymentMethods.retrieve(data.paymentMethodID)
  return paymentMethod
})

exports.cancelStripeSubscription = functions
.https.onCall(async(data, context) => {
  const subscription = await stripe.subscriptions.update(
    data.subscriptionID,
    {cancel_at_period_end: true}
  )
  return subscription
})

exports.reactivateStripeSubscription = functions
.https.onCall(async(data, context) => {
  const subscription = await stripe.subscriptions.update(
    data.subscriptionID,
    {cancel_at_period_end: false},
  )
  return subscription
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

exports.checkExpiredSubscriptions = functions.pubsub
  .schedule('0 9 * * *')
  .onRun((context) => {
    const day = new Date().getDate()
    return firestore.collection('users')
      .where('stripe.businessPlanExpires.dayNumber', '==', day)
      .get()
      .then(users => {
        const batch = firestore.batch()
        users.forEach(user => {
          batch.update(user.ref, { 
            "stripe.businessPlanExpires": null,
            memberType: 'basic'
          })
        })
        return batch.commit()
      })
  })

