export const infoToast = (message) => {
  return prev => [...prev, {
    message,
    icon: 'fas fa-exclamation-circle',
    toastID: Date.now()
  }]
}

export const errorToast = (message) => {
  return prev => [...prev, {
    message,
    icon: 'fas fa-times-circle',
    toastID: Date.now()
  }]
}

export const successToast = (message) => {
  return prev => [...prev, {
    message,
    icon: 'fas fa-check-circle',
    toastID: Date.now()
  }]
}
