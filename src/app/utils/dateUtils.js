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

export const monthNames = ['','Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']


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

export const convertAlgoliaDate = (date) => {
  return date?._seconds ? new Date(date?._seconds * 1000) : date?.toDate()
}

export const convertUnixDate = (date) => {
  return new Date(date * 1000)
}

export const getNameDayOfTheWeekFromDate = (date) => {
  return date.toLocaleString('en-CA', { weekday: 'long' })
}

// accept a start and end date and return an array of dates between them
export const getDatesBetween = (startDate, endDate) => {
  const dates = []
  const theDate = new Date(startDate)
  while (theDate < endDate) {
    dates.push(new Date(theDate))
    theDate.setDate(theDate.getDate() + 1)
  }
  dates.push(endDate)
  return dates
}

//return dates between two dates without the last date
export const getDatesBetweenExclusive = (startDate, endDate) => {
  const dates = []
  const theDate = new Date(startDate)
  while (theDate < endDate) {
    dates.push(new Date(theDate))
    theDate.setDate(theDate.getDate() + 1)
  }
  return dates
}

export const isTimeString1BeforeTimeString2 = (time1, time2) => {
  const [hours1, minutes1] = time1?.split(':')
  const [hours2, minutes2] = time2?.split(':')
  if(hours1 < hours2)
    return true
  else if(hours1 === hours2 && minutes1 <= minutes2)
    return true
  else
    return false
}

export const areBothDatesOnSameDay = (date1, date2) => {
  return date1?.toDateString() === date2?.toDateString()
}

export const returnLatestDate = (date1, date2) => {
  return date1 > date2 ? date1 : date2
}

export const detectNumOfHoursDaysOrWeeks = (date1, date2) => {
  const diff = Math.abs(date1 - date2)
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const weeks = Math.floor(days / 7)
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor(diff / (1000 * 60))
  if(weeks > 0)
    return {string: `${weeks} week${weeks !== 1 ? 's' : ''}`, number: weeks}
  else if(days > 0)
    return {string: `${days} day${days !== 1 ? 's' : ''} ${hours-24 > 0 ? `, ${hours-24} hour${hours-24 !== 1 ? 's' : ''}` : ''}`, number: days}
  else if(hours >= 1)
    return {string: `${hours} hour${hours !== 1 ? 's' : ''}`, number: hours}
  else
    return {string: `${minutes} minutes`, number: minutes}
  
}

//