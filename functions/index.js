const functions = require("firebase-functions")
const algoliasearch = require('algoliasearch')
const firebase = require("firebase-admin")
firebase.initializeApp()
const firestore = firebase.firestore()
firestore.settings({ ignoreUndefinedProperties: true })
const sgMail = require('@sendgrid/mail')
const puppeteer = require('puppeteer')

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

//Algolia functions

//invoices
exports.addToIndexInvoice = functions
  .region('northamerica-northeast1')
  .firestore.document('users/{userID}/invoices/{invoiceID}').onCreate((snapshot, context) => {
    const data = snapshot.data()
    const calculatedTotal = data?.items?.reduce((acc, item) => (acc + ((item.price + (item.price * item.taxRate / 100)) * item.quantity)), 0)
    return firestore.collection('users')
      .doc(context.params.userID)
      .update({
        invoicesNum: firebase.firestore.FieldValue.increment(1),
        ...(data.status === 'paid' && { totalRevenue: firebase.firestore.FieldValue.increment(calculatedTotal) })
      })
      .then(() => {
        return invoicesIndex.saveObject({ ...data, objectID: snapshot.id })
      })
  })

exports.updateIndexInvoices = functions
  .region('northamerica-northeast1')
  .firestore.document('users/{userID}/invoices/{invoiceID}').onUpdate((change) => {
    const newData = change.after.data()
    return invoicesIndex.saveObject({ ...newData, objectID: change.after.id })
  })

exports.deleteFromIndexInvoices = functions
  .region('northamerica-northeast1')
  .firestore.document('users/{userID}/invoices/{invoiceID}').onDelete((snapshot, context) => {
    const data = snapshot.data()
    return firestore.collection('users')
      .doc(context.params.userID)
      .update({
        invoicesNum: firebase.firestore.FieldValue.increment(-1),
        ...(data.status === 'paid' && { totalRevenue: firebase.firestore.FieldValue.increment(-data.total) })
      })
      .then(() => {
        return invoicesIndex.deleteObject(snapshot.id)
      })
  })

//Estimates
exports.addToIndexEstimates = functions
  .region('northamerica-northeast1')
  .firestore.document('users/{userID}/estimates/{estimateID}').onCreate((snapshot, context) => {
    const data = snapshot.data()
    return firestore.collection('users')
      .doc(context.params.userID)
      .update({ invoicesNum: firebase.firestore.FieldValue.increment(1) })
      .then(() => {
        return estimatesIndex.saveObject({ ...data, objectID: snapshot.id })
      })
  })

exports.updateIndexEstimates = functions
  .region('northamerica-northeast1')
  .firestore.document('users/{userID}/estimates/{estimateID}').onUpdate((change) => {
    const newData = change.after.data()
    return estimatesIndex.saveObject({ ...newData, objectID: change.after.id })
  })

exports.deleteFromIndexEstimates = functions
  .region('northamerica-northeast1')
  .firestore.document('users/{userID}/estimates/{estimateID}').onDelete((snapshot, context) => {
    return firestore.collection('users')
      .doc(context.params.userID)
      .update({ invoicesNum: firebase.firestore.FieldValue.increment(-1) })
      .then(() => {
        return estimatesIndex.deleteObject(snapshot.id)
      })
  })

//contacts
exports.addToIndexContacts = functions
  .region('northamerica-northeast1')
  .firestore.document('users/{userID}/contacts/{contactID}').onCreate((snapshot, context) => {
    const data = snapshot.data()
    return firestore.collection('users')
      .doc(context.params.userID)
      .update({ contactsNum: firebase.firestore.FieldValue.increment(1) })
      .then(() => {
        return contactsIndex.saveObject({ ...data, objectID: snapshot.id })
      })
  })

exports.updateIndexContacts = functions
  .region('northamerica-northeast1')
  .firestore.document('users/{userID}/contacts/{contactID}').onUpdate((change) => {
    const newData = change.after.data()
    return contactsIndex.saveObject({ ...newData, objectID: change.after.id })
  })

exports.deleteFromIndexContacts = functions
  .region('northamerica-northeast1')
  .firestore.document('users/{userID}/contacts/{contactID}').onDelete((snapshot, context) => {
    return firestore.collection('users')
      .doc(context.params.userID)
      .update({ contactsNum: firebase.firestore.FieldValue.increment(-1) })
      .then(() => {
        return contactsIndex.deleteObject(snapshot.id)
      })
  })



// Sendgrid functions

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


//Stripe functions
exports.createStripeAccount = functions
  .https.onCall(async (data, context) => {
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
      capabilities: { card_payments: { requested: true }, transfers: { requested: true } },
      business_type: 'individual',
      business_profile: { url: 'https://invoiceme.pro' },
    })
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: 'http://localhost:3000/my-account/payments',
      return_url: 'http://localhost:3000/my-account/payments?details_submitted=true',
      type: 'account_onboarding',
    })
    return { account, accountLink }
  })

exports.retrieveStripeAccount = functions
  .https.onCall(async (data, context) => {
    const account = await stripe.accounts.retrieve(data.accountID)
    return account
  })

exports.deleteStripeAccount = functions
  .https.onCall(async (data, context) => {
    const account = await stripe.accounts.del(data.accountID)
    return account
  })

exports.createPaymentMethod = functions
  .https.onCall(async (data, context) => {
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
  .https.onCall(async (data, context) => {
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
  .https.onCall(async (data, context) => {
    const paymentMethod = await stripe.paymentMethods.attach(
      data.paymentMethodID,
      { customer: data.customerID }
    )
    stripe.customers.update(data.customerID, {
      invoice_settings: {
        default_payment_method: data.paymentMethodID,
      },
    })
    return paymentMethod
  })

exports.createStripeSubscription = functions
  .https.onCall(async (data, context) => {
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
  .https.onCall(async (data, context) => {
    const subscriptions = await stripe.subscriptions.list({
      customer: data.customerID
    })
    return subscriptions
  })

exports.retrievePaymentMethod = functions
  .https.onCall(async (data, context) => {
    const paymentMethod = await stripe.paymentMethods.retrieve(data.paymentMethodID)
    return paymentMethod
  })

exports.cancelStripeSubscription = functions
  .https.onCall(async (data, context) => {
    const subscription = await stripe.subscriptions.update(
      data.subscriptionID,
      { cancel_at_period_end: true }
    )
    return subscription
  })

exports.reactivateStripeSubscription = functions
  .https.onCall(async (data, context) => {
    const subscription = await stripe.subscriptions.update(
      data.subscriptionID,
      { cancel_at_period_end: false },
    )
    return subscription
  })

exports.retrievePaymentsByCustomer = functions
  .https.onCall(async (data, context) => {
    const payments = await stripe.paymentIntents.list({
      customer: data.customerID,
      limit: data.limit,
    })
    return payments
  })

exports.retrieveAttachmentPaymentMethods = functions
  .https.onCall(async (data, context) => {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: data.customerID,
      type: 'card',
    })
    return paymentMethods
  })

exports.retrieveInvoicesByCustomer = functions
  .https.onCall(async (data, context) => {
    const invoices = await stripe.invoices.list({
      customer: data.customerID,
      limit: data.limit,
    })
    return invoices
  })

exports.retrieveCustomer = functions
  .https.onCall(async (data, context) => {
    const customer = await stripe.customers.retrieve(data.customerID)
    return customer
  })

exports.createCharge = functions
  .https.onCall(async (data, context) => {
    const charge = await stripe.charges.create({
      amount: data.amount,
      currency: data.currency,
      customer: data.customerID,
      receipt_email: data.contactEmail,
      source: data.paymentMethodID
    })
    return firestore.collection('users')
    .where('email', '==', data.contactEmail)
    .get()
    .then((users) => {
      if (users.empty) return charge
      const user = users.docs[0].data()
      createNotification(
        user.userID, 
        'New Payment', 
        `You received a payment from ${data.myName} for $${formatCurrency((data.amount/100).toFixed(2))} ${data.currency || 'CAD'}.`, 
        'fas fa-credit-card',
        '/payments'
      )
      .then(() => {
        const msg = {
          from: 'info@atomicsdigital.com',
          to: data.contactEmail,
          subject: 'New Payment',
          html: `Hi.<br/><br/>You received a payment from ${data.myName} for $${formatCurrency((data.amount/100).toFixed(2))} ${data.currency || 'CAD'}.<br/><br/> View your payments here: https://atomicsdigital.com/payments<br/><br/>Invoice Me`,
        }
        return sgMail.send(msg)
        .then(() => {
          console.log('Email sent')
          return charge
        })
        .catch((error) => {
          console.error(error)
          return charge
        })
      })
      .catch((error) => {
        console.log(error)
        return charge
      })
    })
  })



//Scheduled functions

function runScheduledInvoices(dayOfMonth, timeOfDay) {
  return firestore.collection('scheduledInvoices')
    .where('dayOfMonth', '==', dayOfMonth)
    .where('timeOfDay', '==', timeOfDay)
    .where('active', '==', true)
    .get()
    .then((scheduledInvoices) => {
      if (scheduledInvoices.empty) return null
      const now = firebase.firestore.Timestamp.now()
      const monthNum = new Date().getUTCMonth() + 1
      const year = new Date().getUTCFullYear()
      const invoicesBatch = firestore.batch()
      const schedulesBatch = firestore.batch()
      scheduledInvoices.forEach(schedule => {
        const data = schedule.data()
        const path = `users/${data.ownerID}/invoices`
        const docID = firestore.collection(path).doc().id
        const docRef = firestore.collection(path).doc(docID)
        const eventsDocID = firestore.collection('scheduledEvents').doc().id
        const eventsDocRef = firestore.collection('scheduledEvents').doc(eventsDocID)
        invoicesBatch.set(docRef, {
          currency: data.invoiceTemplate.currency,
          dateCreated: new Date(),
          dateDue: new Date(),
          invoiceID: docID,
          invoiceNumber: `${data.invoiceTemplate.invoiceNumber}-${monthNum}-${dayOfMonth}-${year}`,
          invoiceOwnerID: data.invoiceTemplate.invoiceOwnerID,
          invoiceTo: data.invoiceTemplate.invoiceTo,
          isPaid: false,
          isSent: true,
          items: data.invoiceTemplate.items,
          monthLabel: new Date().toLocaleString('en-CA', { month: 'long' }),
          myBusiness: data.invoiceTemplate.myBusiness,
          notes: data.invoiceTemplate.notes,
          partOfTotal: false,
          status: data.invoiceTemplate.status,
          taxNumbers: data.invoiceTemplate.taxNumbers,
          taxRate1: data.invoiceTemplate.taxRate1,
          taxRate2: data.invoiceTemplate.taxRate2,
          subtotal: data.invoiceTemplate.subtotal,
          total: data.invoiceTemplate.total,
          title: data.invoiceTemplate.title,
          isScheduled: true,
        })
        schedulesBatch.set(eventsDocRef, {
          dateRan: now,
          name: 'Scheduled Invoice',
          scheduleID: data.scheduleID,
          type: 'scheduledInvoice',
          ownerID: data.ownerID,
        })
      })
      return invoicesBatch.commit()
        .then(() => {
          return schedulesBatch.commit()
            .then(() => {
              const invoicesBatch = firestore.batch()
              scheduledInvoices.forEach(schedule => {
                const data = schedule.data()
                const docRef = firestore.collection('scheduledInvoices').doc(data.scheduleID)
                invoicesBatch.update(docRef, {
                  lastRan: now,
                })
              })
              return invoicesBatch.commit()
                .then(() => {
                  return Promise.all(scheduledInvoices.docs.map((doc) => {
                    const data = doc.data()
                    const msg = {
                      to: data.invoiceTemplate.invoiceTo.email,
                      from: 'info@atomicsdigital.com',
                      subject: data.emailSubject,
                      html: data.emailMessage,
                      attachments: [{
                        content: Buffer.from(data.invoicePaperHTML, 'utf8').toString('base64'),
                        filename: `${data.invoiceTemplate.invoiceNumber}-${monthNum}-${dayOfMonth}-${year}.pdf`,
                        type: 'application/pdf',
                        disposition: 'attachment'
                      }]
                    }
                    return sgMail.send(msg)
                      .then(() => console.log('Email sent to all users.'))
                      .catch((error) => console.error(error.toString()))
                  }))
                })
                .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))
        })
        .catch((err) => console.log(err))
    })
    .catch((err) => console.log(err))
}


//Schedules Options

// Every hour between 7am and 9pm
// exports.runScheduledInvoicesHourly = functions.pubsub
//   .schedule('5 7-21 * * *')
//   .onRun((context) => {
//     const dayOfMonth = new Date().getUTCDate()
//     const timeOfDay = new Date().getUTCHours()
//     return runScheduledInvoices(dayOfMonth, timeOfDay)
//       .then(() => console.log('Scheduled invoices ran successfully.'))
//       .catch((err) => console.log('Scheduled invoice error', err))
//   })


exports.checkExpiredSubscriptions = functions.pubsub
  .schedule('0 9 * * *')
  .onRun((context) => {
    const day = new Date().getUTCDate()
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


//utility functions
function createNotification(userID, title, text, icon, url) {
  const notifPath = `users/${userID}/notifications`
  const docID = firestore.collection(notifPath).doc().id
  return firestore.collection(notifPath)
  .doc(docID)
  .set({
    notificationID: docID,
    dateCreated: new Date(),
    isRead: false,
    title: title,
    text: text,
    icon: icon,
    url: url,
  })
}

function formatCurrency(number) {
  return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}