import { storage } from "app/firebase/fire"

export const uploadMultipleFilesToFireStorage = (files, storagePath, fileNames, setUploadProgress) => {
  return new Promise((resolve, reject) => {
    if(!files?.length) return resolve([])
    const imgURLs = []
    files.forEach((file, i) => {
      const storageRef = storage.ref(storagePath)
      const uploadTask = storageRef.child(fileNames[i] || file.name).put(file)
      uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setUploadProgress && setUploadProgress(progress)
      }, (error) => {
        console.log(error)
        reject(error)
      }, () => {
        uploadTask.snapshot.ref.getDownloadURL()
        .then(downloadURL => {
          imgURLs.push({downloadURL, file})
          if (imgURLs.length === files.length) {
            resolve(imgURLs)
          }
        })
        .catch(error => {
          console.log(error)
          reject(error)
        })
      })
    })
  })
}

export const deleteMultipleStorageFiles = (files, storagePath, pass) => {
  if(pass) {
    return Promise.resolve()
  }
  return new Promise((resolve, reject) => {
    files.forEach((file, i) => {
      let storageRef = storage.ref(storagePath).child(file.name)
      storageRef.delete()
      .then(() => {
        if(i === files.length-1) {
          resolve()
        }
      })
      .catch(err => {
        console.log(err)
        reject(err)
      })
    })
  })
}

