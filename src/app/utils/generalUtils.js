// @ts-nocheck

export const addLeadingZeros = (number) => {
  return number < 10 ? "0" + number : number
}

export const truncateText = (text, charsNum) => {
  return text?.length > charsNum ? (text?.slice(0, charsNum) + "...") : text
}

export const formatPhoneNumber = (phoneNumberString) => {
  let cleaned = ('' + phoneNumberString).replace(/\D/g, '')
  let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3]
  }
  return null
}

export const formatCurrency = (number) => {
  return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export const formatCardNumber = (number) => {
  let numeric = number.replace(/\D/g, '')
  var v = numeric.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
  var matches = v.match(/\d{4,16}/g);
  var match = matches && matches[0] || ''
  var parts = []
  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4))
  }
  if (parts.length) {
    return parts.join(' ')
  }
  else {
    return numeric
  }
}

export const formatExpiryNum = (number) => {
  return number.replace(/\D/g, '')
} 

export const formatCvcNum = (number) => {
  return number.replace(/\D/g, '')
}

export const validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

export const validatePhone = (phone) => {
  const re = /^\d{10}$/
  return re.test(String(phone))
}

export const isExpiryInFuture = (expiryMonth, expiryYear) => {
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1
  const expiryYearNum = +(`20${expiryYear}`)
  const expiryMonthNum = +(expiryMonth)
  if (expiryYearNum > currentYear) {
    return true
  }
  else if (expiryYearNum === currentYear && expiryMonthNum >= currentMonth) {
    return true
  }
  return false
}

export const isEmptyObject = (obj) => {
  return obj !== null && Object.keys(obj).length === 0 && obj.constructor === Object
}

export const textHasURL = (text) => {
  const urlRegex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  return urlRegex.test(text)
}

export const extractLinkFromText = (text) => {
  const urlRegex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  let match = urlRegex.exec(text)
  if (match !== null) {
    if (!match[0].startsWith("http") && !match[0].startsWith("https")) {
      return "https://" + match[0]
    }
    return match[0]
  }
  return null
}

export const extractAllLinksFromText = (text) => {
  const links = []
  let match
  const urlRegex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  while ((match = urlRegex.exec(text)) !== null) {
    links.push(match[0])
  }
  return links
}

export const scrapeTitleFromLink = (fetchedLink) => {
  if (fetchedLink) {
    let title = null
    let titleRegex = new RegExp("<title>(.*?)</title>", "g")
    let match = titleRegex.exec(fetchedLink)
    if (match !== null) {
      title = match[1]
    }
    return title
  }
}

//keep only the domain from a link
export const extractDomainFromLink = (link) => {
  if (link) {
    let domain = null
    let domainRegex = new RegExp("(https?:\/\/)?(www\.)?([^\/]*)", "g")
    let match = domainRegex.exec(link)
    if (match !== null) {
      domain = match[3]
    }
    return domain
  }
}

export const scrapeImgFromLink = (fetchedLink, link) => {
  if (fetchedLink) {
    let img = null
    let imgRegex = new RegExp("<img.*?src=\"(.*?)\"", "g")
    let match = imgRegex.exec(fetchedLink)
    if (match !== null) {
      img = match[1]
    }
    if (img?.startsWith('/')) {
      return `https://${extractDomainFromLink(link)}${img}`
    }
    return img
  }
}

export const scrapeMetaDescriptionFromLink = (fetchedLink) => {
  if (fetchedLink) {
    let metaDescription = null
    let metaDescriptionRegex = new RegExp("<meta.*?name=\"description\".*?content=\"(.*?)\"", "g")
    let match = metaDescriptionRegex.exec(fetchedLink)
    if (match !== null) {
      metaDescription = match[1]
    }
    return metaDescription
  }
}

export const detectAndUnderlineAllLinksInText = (text) => {
  const links = extractAllLinksFromText(text)
  let newText = text
  links.forEach(link => {
    newText = newText.replace(link, `<a href="${link}" target="_blank">${link}</a>`)
  })
  return newText
}

export const isElementInView = (el) => {
  let rect = el.getBoundingClientRect()
  return rect.bottom > 0 && rect.top < (window.innerHeight || document.documentElement.clientHeight + 300)
}

export const isNumbersInRange = (number1, number2, range) => {
  return Math.abs(number1 - number2) <= range
}

export const toggleFullScreen = () => {
  const elem = document.documentElement
  if (elem.requestFullscreen) {
    elem.requestFullscreen()
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen()
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen()
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen()
  }
}

export const convertMetersPerSecondToKmPerHour = (metersPerSecond) => {
  return metersPerSecond * 3.6
}

export const divideRateByTime = (rate, time) => {
  if (time === 'Day')
    return +rate / 24
  else if (time === 'Week')
    return +rate / 168
  else if (time === 'Month')
    return +rate / 720
  else
    return +rate
}

export const shuffleString = (string) => {
  return string.split('').sort(() => 0.5 - Math.random()).join('')
}

export const generateOrderID = () => {
  const timestamp = Date.now().toString()
  const scrambledTimestamp = shuffleString(timestamp)
  const orderID = `${(scrambledTimestamp.slice(0, 4))}-` +
    `${(scrambledTimestamp.slice(4, 10))}` +
    `-${(scrambledTimestamp.slice(10, 13))}${Math.floor(Math.random() * 1000)}`
  return orderID
}

export const calculatePriceTotal = (subtotal, taxPercent, quantity) => {
  const tax = subtotal * taxPercent
  const total = (subtotal + tax) * quantity
  return total
}

export const printElement = (ref) => {
  console.log(ref.current)
  const elementToPrint = ref.current
  const newWin = window.open("")
  newWin.document.write(elementToPrint.outerHTML)
  newWin.print()
  newWin.close()
}

export const displayGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) {
    return 'Good morning'
  } else if (hour < 18) {
    return 'Good afternoon'
  } else {
    return 'Good evening'
  }
}

//convert object to array of objects with key as property
export const objectToArray = (obj, keyLabel) => {
  if (obj) {
    return Object.entries(obj).map(([key, value]) => ({ [keyLabel]: key, ...value }))
  }
}

export const sortArrayByProperty = (array, property, order) => {
  if (order === 'asc') {
    return array.sort((a, b) => a[property].toString() > b[property].toString() ? 1 : -1)
  } else {
    return array.sort((a, b) => b[property].toString() < a[property].toString() ? 1 : -1)
  }
}

export const cap = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const upper = (string) => {
  return string.toUpperCase()
}

export const cleanHtml = (html) => {
  return html.replace(/<[^>]*>?/gm, ' ')
}