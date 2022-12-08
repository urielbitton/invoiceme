InvoiceMe App


ToDos:
- fix scheduled invoices pubsub functions
- protect all business access pages with memberType check
- add notifications to all events on app (especiall payments)
- add search dropdown on email page when entering "to" field
- new payment page - send payout to contact you search for in input, detect if they have a donnected stripe account, and then use stripe to send payment to their account. Send user email with payment details, send app notification to user (quer firebase user by email, can't use userID)
- style all auth pages
- let users delete their account
- implement settings in settings page against user settings & implement settings throughout app
- add in-app toasts (notifs instead of alerts)
- find html to pdf npm that preserves text and css
- add AppModal for users to see status of their sent invoices (try to get a read receipt from sendgrid, show other details about invoice)
- add SearchAddressInput for necessary address inputs
- verifiy email to create account
- add google and facebook auth
- help and support page