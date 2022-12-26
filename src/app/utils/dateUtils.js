// @ts-nocheck
export const msToDays = (ms) => {
  return (ms / (60*60*24*1000))
}

export const convertClassicDate = (date, withTime) => {
  return date?.toLocaleDateString('en-CA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...(withTime && {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    })
  })
}

export const convertClassicTime = (date) => {
  return date?.toLocaleTimeString('en-CA', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  })
}

export const convertClassicDateAndTime = (date) => {
  return `${convertClassicDate(date)}, ${convertClassicTime(date)}`
}

export const reformatDateToMonthDayYear = (date) => {
  return new Date(`${date?.toISOString().split('T')[0].split('-')[1]}-${date?.toISOString().split('T')[0].split('-')[2]}-${date?.toISOString().split('T')[0].split('-')[0]}`)
}

export const convertDateToInputFormat = (date) => {
  const year = date?.getFullYear()
  const month = date?.getMonth() + 1
  const day = date?.getDate()
  return `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`
}

export const convertInputDateToDateFormat = (string) => {
  return new Date(`${string.split('-')[1]}-${string.split('-')[2]}-${string.split('-')[0]}`)
}

export const convertInputDateToDateAndTimeFormat = (string) => {
  return new Date(`${string.split('-')[1]}-${string.split('-')[2]}-${string.split('-')[0]} ${getTimeFromDate(new Date(string))}`)
}

export const convertDateToTimeInputFormat = (date) => {
  return reformatDateToMonthDayYear(date)?.toISOString().split('T')[1].split('.')[0]
}

export const convertDateToTimeString = (date) => {
  return convertClassicTime(reformatDateToMonthDayYear(date))
}

export const getDateTimeString = (date) => {
  if(date?.toLocaleTimeString().length > 10) {
    return date?.toLocaleTimeString().slice(0,5)
  }
  return date?.toLocaleTimeString().slice(0,4)
}

export const getTimeStringIn24h = (date) => {
  return date?.toTimeString().slice(0,5)
}

export const getTimeFromDate = (date) => {
  return date?.toTimeString().slice(0,5)
}

export const getNearestTimeToQuarterHour = (date) => {
  const minutes = date.getMinutes()
  const nearestQuarterHour = Math.round(minutes / 15) * 15
  if (nearestQuarterHour <= minutes) {
    date.setMinutes(nearestQuarterHour + 15)
  } 
  else {
    date.setMinutes(nearestQuarterHour)
  }
  return new Date(date)
}

export const addAMPM = (time) => {
  const [hours, minutes] = time?.split(':')
  const hoursIn12H = hours % 12 || 12
  const ampm = hours < 12 || hours === 24 ? 'AM' : 'PM'
  return `${hoursIn12H}:${minutes} ${ampm}`
}

export const isDateLessThanXTimeAgo = (date, time) => {
  const now = new Date()
  const then = new Date(date)
  const diff = now.getTime() - then.getTime()
  return diff < time
}

export const isDateGreaterThanXTimeAgo = (date, time) => {
  const now = new Date()
  const then = new Date(date)
  const diff = now.getTime() - then.getTime()
  return diff > time
}

export const convertDateObjectToInputFormat = (date) => {
  return date?.toISOString().split('T')[0]
}

export const extractYear = (date) => {
  return date.getFullYear()
}

export const extractMonthNameAndYear = (date, shortName) => {
  return `${date.toLocaleString('en-CA', { month: shortName })} ${date.getFullYear()}`
}

export const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'
]

export const shortMonthNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
  'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

export const shortAndLongMonthNames = [
  { shortName: 'Jan', longName: 'January' },
  { shortName: 'Feb', longName: 'February' },
  { shortName: 'Mar', longName: 'March' },
  { shortName: 'Apr', longName: 'April' },
  { shortName: 'May', longName: 'May' },
  { shortName: 'Jun', longName: 'June' },
  { shortName: 'Jul', longName: 'July' },
  { shortName: 'Aug', longName: 'August' },
  { shortName: 'Sep', longName: 'September' },
  { shortName: 'Oct', longName: 'October' },
  { shortName: 'Nov', longName: 'November' },
  { shortName: 'Dec', longName: 'December' }
]

export const msToTime = (ms) => {
    let seconds = Math.floor((ms / 1000) % 60),
    minutes = Math.floor((ms / (1000 * 60)) % 60),
    hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    return hours + ":" + minutes + ":" + seconds
}

export const getDaysAgo = (date) => {
  return Math.round(msToDays(Date.now()) - msToDays(date))
}

export const getTimeAgo = (date) => {
  const seconds = Math.floor((Date.now() - date) / 1000)
  if(seconds < 1)
    return 'Just now'
  else if(seconds < 60)
    return seconds + 's'
  else if(seconds < 3600)
    return Math.floor(seconds / 60) + 'm'
  else if(seconds < 86400)
    return Math.floor(seconds / 3600) + 'h'
  else if(seconds < 259200) //if less than 3 days
    return Math.floor(seconds / 86400) + 'd'
  else
    return convertClassicDate(date)
  }

export const militaryTimeToAMPM = (time) => {
  const [hours, minutes] = time.split(':')
  const hoursIn12H = hours % 12 || 12
  const ampm = hours < 12 || hours === 24 ? 'AM' : 'PM'
  return `${hoursIn12H}:${minutes} ${ampm}`
}

export const convertAlgoliaDate = (date) => {
  return date?._seconds ? new Date(date?._seconds * 1000) : date?.toDate()
}

export const convertUnixDate = (date) => {
  return new Date(date * 1000)
}

export const convertClassicUnixDate = (date) => {
  return convertClassicDate(convertUnixDate(date))
}

export const convertClassicUnixDateAndTime = (date) => {
  return convertClassicDateAndTime(convertUnixDate(date))
}

export const getNameDayOfTheWeekFromDate = (date) => {
  return date.toLocaleString('en-CA', { weekday: 'long' })
}

export const getDatesBetweenInclusive = (startDate, endDate) => {
  const dates = []
  const theDate = new Date(startDate)
  while (theDate < endDate) {
    dates.push(new Date(theDate))
    theDate.setDate(theDate.getDate() + 1)
  }
  dates.push(endDate)
  return dates
}

export const getDatesBetweenExclusive = (startDate, endDate) => {
  const dates = []
  const theDate = new Date(startDate)
  while (theDate < endDate) {
    dates.push(new Date(theDate))
    theDate.setDate(theDate.getDate() + 1)
  }
  return dates
}

export const getFirstDayOfMonthAsDate = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export const getLastDayOfMonthAsDate = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

export const getFirstDayOfYearAsDate = (year) => {
  return new Date(year, 0, 1)
}

export const getLastDayOfYearAsDate = (year) => {
  return new Date(year, 11, 31)
}

export const monthNameToDate = (monthName) => {
  return new Date(`${monthName} 01, ${new Date().getFullYear()}`)
}

export const datesAreInSameMonth = (date1, date2) => {
  return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear()
}

export const dateToMonthName = (date, length='long') => {
  return date.toLocaleString('en-CA', { month: length })
}

export const getNumOfDaysInMonth = (date) => {
  return new Date(new Date(date).getFullYear(), new Date(date).getMonth() + 1, 0).getDate()
}

export const getWeekOfMonth = (date) => {
  const firstDayOfMonth = getFirstDayOfMonthAsDate(date)
  const firstDayOfMonthWeekday = firstDayOfMonth.getDay()
  const firstWeekLength = 7 - firstDayOfMonthWeekday
  const dayOfMonth = date.getDate()
  if(dayOfMonth <= firstWeekLength)
    return `week1`
  else
    return `week${Math.ceil((dayOfMonth - firstWeekLength) / 7) + 1}`
}

//get number of days in given month from date and create array of dates
export const getDatesInMonthIterate = (date) => {
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const dates = []
  for(let i = 1; i <= daysInMonth; i++) {
    dates.push(i)
  }
  return dates
}

export const splitDocsIntoMonths = (docs, dateKey) => {
  const months = {}
  docs && docs.forEach(doc => {
    const docDate = new Date(doc[dateKey]?.toDate())
    monthNames.forEach(monthName => {
      const monthDate = monthNameToDate(monthName)
      if(datesAreInSameMonth(docDate, monthDate)) {
        if(months[monthName]) {
          months[monthName].push(doc)
        }
        else {
          months[monthName] = [doc]
        }
      }
    })
  })
  monthNames.forEach(monthName => {
    if(!months[monthName]) {
      months[monthName] = []
    }
  })
  return months
}

export const splitDocsIntoWeeksOfMonth = (docs, dateKey) => {
  const weeks = {}
  docs && docs.forEach(doc => {
    const docDate = new Date(doc[dateKey]?.toDate())
    const weekOfMonth = getWeekOfMonth(docDate)
    if(weeks[weekOfMonth]) {
      weeks[weekOfMonth].push(doc)
    }
    else {
      weeks[weekOfMonth] = [doc]
    }
  })
  const weeksArr = ['week1','week2','week3','week4']
  weeksArr.forEach(weekNum => {
    if(!weeks[weekNum]) {
      weeks[weekNum] = []
    }
  })
  return weeks
}

export const splitMonthDocsIntoDays = (docs, dateKey) => {
  const days = {}
  docs && docs.forEach(doc => {
    const docDate = new Date(doc[dateKey]?.toDate())
    const day = docDate.getDate()
    const dayName = getNameDayOfTheWeekFromDate(docDate)
    if(days[day]) {
      days[day].push({...doc, dayName})
    }
    else {
      days[day] = [{...doc, dayName}]
    }
  })
  const daysInMonth = getDatesInMonthIterate(new Date())
  daysInMonth.forEach(day => {
    if(!days[day]) {
      days[day] = [{dayName: getNameDayOfTheWeekFromDate(new Date(new Date().getFullYear(), new Date().getMonth(), day))}]
    }
  })
  return days
}

export const displayThStNdRd = (num) => {
  if(num > 3 && num < 21) return `${num}th`
  switch (num % 10) {
    case 1:  return `${num}st`
    case 2:  return `${num}nd`
    case 3:  return `${num}rd`
    default: return `${num}th`
  }
}

export const dayOfMonthNumbers = () => {
  const options = []
  for(let i = 1; i <= 31; i++) {
    options.push({value: i, label: i})
  }
  return options
}

export const getYearsBetween = (startYear, endYear) => {
  const years = []
  for(let i = endYear; i >= startYear; i--) {
    years.push({value: i, label: i})
  }
  return years
}