import { db } from "app/firebase/fire"
import { getRandomDocID } from "./CrudDB"

export const sendMultipleEmails = (members, emailData) => {
  const batch = db.batch()
  members.forEach(member => {
    const docID = getRandomDocID("mail")
    const docRef = db.collection(`mail`).doc(docID)
    batch.set(docRef, {
      to: member.email,
      message: {
        subject: `New Email`,
        html: emailData.text
      },
      replyTo: 'info@atomicsdigital.com',
      dateSent: new Date(),
      emailID: docID
    })
  })
  return batch.commit()
  .catch(err => console.log(err))
}