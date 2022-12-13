export const iconSwitch = (index) => {
  if(index === 'contacts_index') return 'fas fa-address-book'
  if(index === 'invoices_index') return 'fas fa-file-invoice-dollar'
  if(index === 'estimates_index') return 'fas fa-file-invoice'
  if(index === 'payments_index') return 'fas fa-credit-card'
  if(index === 'emails_index') return 'fas fa-envelope'
  if(index === 'settings_index') return 'fas fa-cog'
}

export const titlePropSwitch = (index) => {
  if(index === 'contacts_index') return 'name'
  if(index === 'invoices_index') return 'title'
  if(index === 'estimates_index') return 'title'
  if(index === 'payments_index') return 'contactEmail'
  if(index === 'emails_index') return 'subject'
  if(index === 'settings_index') return 'sublabel'
}

export const badgeSwitch = (index) => {
  if(index === 'contacts_index') return 'contacts'
  if(index === 'invoices_index') return 'invoices'
  if(index === 'estimates_index') return 'estimates'
  if(index === 'payments_index') return 'payments'
  if(index === 'emails_index') return 'emails'
  if(index === 'settings_index') return 'settings'
}

export const linkSwitch = (index) => {
  if(index === 'contacts_index') return '/contacts'
  if(index === 'invoices_index') return '/invoices'
  if(index === 'estimates_index') return '/estimates'
  if(index === 'payments_index') return '/payments/sent-payments'
  if(index === 'emails_index') return '/emails'
  if(index === 'settings_index') return '/settings'
}

export const secondPathPropSwitch = (index) => {
  if(index === 'contacts_index') return 'contactID'
  if(index === 'invoices_index') return 'invoiceID'
  if(index === 'estimates_index') return 'estimateID'
  if(index === 'payments_index') return ''
  if(index === 'emails_index') return ''
  if(index === 'settings_index') return ''
}