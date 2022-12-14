export const warningToast = (message) => {
  return prev => [...prev, {
    message,
    icon: 'fas fa-exclamation-circle',
    toastID: Date.now()
  }]
}
