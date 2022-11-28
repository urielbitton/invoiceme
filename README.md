InvoiceMe App

ToDos:

Settings Page
Let business members only users create a scheduled email that sends an invoice template to a client on nth day of the month. 
(create 3 max pubsub functions that run everyday and execute ibusiness user has times matching these.)
Let business users create a scheduled email that sends payment for an received invoice to client (using stripe or paypal)
Let users choose if they want to show invoice page titles, dates and numbers on printed invoice (can be hidden with this code):
{/* @page { size: auto;  margin: 0mm; }*/}

Others
- add in-app toasts (notifs instead of alerts)
- add contact events on contact page - shows all events for contact (invoices/estimates received, sent, payments, emails/SMS sent, etc.)
- create email subcollection for users, all emails they send on the app should be saved there.
- add page for users to see status of their sent invoices (try to get a read receipt from sendgrid, show other details about invoice)
- memberTypes (basic/business) business membership has access to more features (doesn't refer to a business type account - both basic and business can send out invoices as a business)
- create scheduled firebase functions that will generate automatically a pdf invoice for the current month and send it to the selected client by email
- add paypal/stripe integration for payout invoices
- Let client users create a scheduled email that sends an invoice template to a client on nth day of the month.
- Let business users create a scheduled email that sends payment for an received invoice to client (using stripe or paypal)
  | - the above requires a notification to the business user saying they received anew invoice, review upcoming automated payment details, in case they want to change payment method, change amount, etc.
- add SearchAddressInput for necessary address inputs
- create upgrade page
