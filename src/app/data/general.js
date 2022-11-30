export const showXResultsOptions = [
  { name: '10 results', value: 10 },
  { name: '15 results', value: 15 },
  { name: '20 results', value: 20 },
  { name: '25 results', value: 25 },
  { name: '30 results', value: 30 },
  { name: '40 results', value: 40 },
]

export const currencies = [
  { name: 'Canadian Dollar', value: 'CAD', symbol: '$' },
  { name: 'U.S. Dollar', value: 'USD', symbol: '$' },
  { name: 'Euro', value: 'EUR', symbol: '€' },
  { name: 'Great Britain Pound', value: 'GBP', symbol: '£' },
  { name: 'Japanese Yen', value: 'JPY', symbol: '¥' },
  { name: 'Chinese Yen', value: 'CNY', symbol: '¥' },
  { name: 'Indian Rupee', value: 'INR', symbol: '₹' },
  { name: 'Australian Dollar', value: 'AUD', symbol: '$' }
]

export const recentsListOptions = [
  {
    label: 'View Invoices',
    value: 'invoices',
  },
  {
    label: 'View Estimates',
    value: 'estimates',
  },
  {
    label: 'View Contacts',
    value: 'contacts',
  },
]

export const yearSelectOptions = [
  { value: 'all', label: 'All' },
  { value: 2022, label: '2022' },
  { value: 2021, label: '2021' },
  //get oldest invoice from user and set its date created as the oldest year
]

export const monthSelectOptions = [
  { label: 'All', value: 'all' },
  { label: 'January', value: 0 },
  { label: 'February', value: 1 },
  { label: 'March', value: 2 },
  { label: 'April', value: 3 },
  { label: 'May', value: 4 },
  { label: 'June', value: 5 },
  { label: 'July', value: 6 },
  { label: 'August', value: 7 },
  { label: 'September', value: 8 },
  { label: 'October', value: 9 },
  { label: 'November', value: 10 },
  { label: 'December', value: 11 },
]

export const themeColors = [
  { label: 'Default', value: '#178fff' },
  { label: 'Midnight', value: '#253752' },
  { label: 'Gold', value: '#c28b32' },
  { label: 'Royal', value: '#6432c2' },
  { label: 'Clouds', value: '#7092c4' },
  { label: 'Leaf', value: '#8cb36d' }
]

export const timeOfDaysOptions = [
  { label: '9:00 AM', value: 9 },
  { label: '12:00 PM', value: 12 },
  { label: '3:00 PM', value: 15 },
  { label: '6:00 PM', value: 18 }
]