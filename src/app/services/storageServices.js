import { storage } from "app/firebase/fire"

export const uploadMultipleFilesToFireStorage = (files, storagePath, fileNames, setUploadProgress) => {
  return new Promise((resolve, reject) => {
    if(!files?.length) return resolve([])
    const fileURLs = []
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
          fileURLs.push({downloadURL, file})
          if (fileURLs.length === files.length) {
            resolve(fileURLs)
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

export const deleteMultipleStorageFiles = (storagePath, filenames) => {
  return new Promise((resolve, reject) => {
    if(!filenames?.length) return resolve()
    filenames.forEach((file, i) => {
      let storageRef = storage.ref(storagePath).child(file)
      storageRef.delete()
      .then(() => {
        if(i === filenames.length-1) {
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

