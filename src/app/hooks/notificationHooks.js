import { auth } from "app/firebase/fire"
import { getAllNotifications, getUnreadNotifications } from "app/services/notifServices"
import { useEffect, useState } from "react"
const userID = auth?.currentUser?.uid

export const useUnreadNotifications = () => {

  const [unreadNotifs, setUnreadNotifs] = useState([])

  useEffect(() => {
    getUnreadNotifications(setUnreadNotifs)
  }, [userID])

  return unreadNotifs
}

export const useNotifications = (limit) => {

  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    getAllNotifications(setNotifications, limit)
  }, [userID, limit])

  return notifications
}