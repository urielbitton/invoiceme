import { infoToast } from "app/data/toastsTemplates"
import domToPdf from 'atomics-dom-to-pdf'
import html2canvas from 'html2canvas'

function setLoadingDef(num) {}

export const fileTypeConverter = (string) => {
  if(string?.includes('wordprocessingml')) 
    return {icon:'fas fa-file-word', color: '#2194ff', name: 'Word', docType: 'word'}
  else if(string?.includes('spreadsheetml')) 
    return {icon: 'fas fa-file-excel', color: '#73d609', name: 'Excel', docType: 'excel'}
  else if(string?.includes('presentationml'))
    return {icon: 'fas fa-file-powerpoint', color: '#ff640a', name: 'PowerPoint', docType: 'powerpoint'}
  else if(string?.includes('pdf'))
    return {icon: 'fas fa-file-pdf', color: '#ff0a37', name: 'PDF', docType: 'pdf'}
  else if(string?.includes('audio'))
    return {icon: 'fas fa-music-alt', color: '#ff6c24', name: 'Audio', docType: 'none'}
  else if(string?.includes('image'))
    return {icon: 'fas fa-image', color: '#6c26ff', name: 'Image', docType: 'none'}
  else if(string?.includes('video'))
    return {icon: 'fas fa-video', color: '#a9cf00', name: 'Image', docType: 'none'}
  else if(string?.includes('zip-compressed'))
    return {icon: 'fas fa-file-archive', color: '#9fb8c4', name: 'Zip', docType: 'none'}
  else if(string?.includes('html'))
    return {icon: 'far fa-code', color: '#9fb8c4', name: 'HTML', docType: 'none'}
  else
    return {icon: 'fas fa-file-alt', color: '#9fb8c4', name: 'Other', docType: 'none'}
}

export const fileTypePathConverter = (string) => {
  if(string?.includes('zip'))
    return 'other'
  else if(string?.includes('application')) 
    return 'document'
  else if(string?.includes('audio'))
    return 'audio'
  else if(string?.includes('image'))
    return 'image'
  else if(string?.includes('video'))
    return 'video'
  else if(string?.includes('html'))
    return 'html'
  else
    return 'other'
}

export const uploadMultipleFilesLocal = (e, maxSize, setFiles, setLoading=setLoadingDef, setToasts) => {
  setLoading(true)
  let files = e.target.files
  for(let i = 0; i < files.length; i++) {
    if(files[i].size > maxSize) {
      setLoading(false)
      return setToasts(infoToast(`One or more of the uploaded files are too large. Max file size is ${maxSize/1000000} MB`))
    }
  }
  let filesArray = []
  if(files) {
    for(let i = 0; i < files.length; i++) {
      filesArray.push(files[i])
    }
  }
  return Promise.all(filesArray.map(file => {
    return new Promise((resolve, reject) => {
      let reader = new FileReader()
      reader.onloadend = function() {
        setLoading(false)
        resolve({src: reader.result, file})
      } 
      if(file) {
        reader.readAsDataURL(file)
      } 
    })
  }))
  .then((files) => {
    setLoading(false)
    if(files) {
      if(files.length > 1)
        setFiles(prev => [...prev, ...files])
      else 
        setFiles(prev => [...prev, files[0]])
    }
  })
  .catch(err => {
    setLoading(false)
    console.log(err)
  })
}

export const uploadFileLocal = (e, maxSize, setFile, setLoading=setLoadingDef, setToasts) => {
  setLoading(true)
  let file = e.target.files[0]
  if(file.size > maxSize) {
    setLoading(false)
    return setToasts(infoToast(`The uploaded file is too large. Max file size is ${maxSize/1000000} MB`))
  }
  let reader = new FileReader()
  reader.onloadend = function() {
    setLoading(false)
    setFile({src: reader.result, file})
  }
  if(file) {
    reader.readAsDataURL(file)
  }
}

export const isFileTypeImage = (file) => {
  return file?.type?.includes('image')
}

export const convertBytesToKbMbGb = (bytes, toFixedNum=2) => {
  if(bytes < 1024) {
    return bytes + ' B'
  }
  else if(bytes < 1048576) {
    return (bytes/1024).toFixed(toFixedNum) + 'KB'
  }
  else if(bytes < 1073741824) {
    return (bytes/1048576).toFixed(toFixedNum) + 'MB'
  }
  else {
    return (bytes/1073741824).toFixed(toFixedNum) + 'GB'
  }
}

export const getSizeOfAllFiles = (files) => {
  let totalSize = 0
  files.forEach(file => {
    totalSize += file.fileSize
  })
  return totalSize
}

export async function downloadUsingFetch(fileURL, fileName) {
  const res = await fetch(fileURL)
  const blob = await res.blob()
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.click()
  window.URL.revokeObjectURL(url)
}

export async function downloadUsingFetchFromFile(file, fileName) {
  const url = window.URL.createObjectURL(file)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.click()
  window.URL.revokeObjectURL(url)
}

export const convertFilesToBase64 = (files) => {
  return Promise.all(files.map((file,i) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        let encoded = reader.result.toString().replace(/^data:(.*,)?/, "")
        if (encoded.length % 4 > 0) {
          encoded += "=".repeat(4 - (encoded.length % 4))
        }
        resolve(encoded)
      }
      reader.onerror = (error) => reject(error)
    })
    .catch(err => console.log(err))
  }))
  .then((encodedFiles) => {
    console.log(encodedFiles)
    return encodedFiles
  })
  .catch(err => console.log(err))
}       

export const convertDocToFileObject = (doc, filename) => {
  let file = new File([doc], doc.name || filename, {type: doc.type})
  return file
}

export const domToPDFDownload = (htmlElement, filename, download=false, compression='MEDIUM') => {
  return domToPdf(
    htmlElement, 
    {
      filename, 
      compression,
      excludeClassNames: ['no-print'],
      download
    }, 
    (err, pdf) => {
      return pdf    
  })
}

export const generatePDFFromHTML = (htmlElement, filename) => {
  return domToPDFDownload(htmlElement, filename, false, 'SLOW')
}

export const saveHTMLToPDFAsBlob = (htmlElement, filename) => {
  return generatePDFFromHTML(htmlElement, filename)
  .then((doc) => {
    const file = convertDocToFileObject(doc.output('blob'), filename)
    return file
  })
  .catch(err => console.log(err))
}

export const convertBase64ToFileObject = (base64, filename) => {
  let file = new File([base64], filename, {type: 'image/png'})
  return file
}

export const downloadHtmlElementAsImage = (htmlElement, filename) => {
  return html2canvas(htmlElement, {useCORS: true})
  .then((canvas) => {
    const dataURL = canvas.toDataURL('image/png')
    downloadUsingFetch(dataURL, filename)
  })
  .catch(err => console.log(err))
}
