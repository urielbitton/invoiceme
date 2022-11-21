import { auth } from "app/firebase/fire"
import { getAllNotifications, getUnreadNotifications } from "app/services/notifServices"
import { useEffect, useState } from "react"

export const useUnreadNotifications = (userID) => {

  const [unreadNotifs, setUnreadNotifs] = useState([])

  useEffect(() => {
    getUnreadNotifications(userID, setUnreadNotifs)
  }, [userID])

  return unreadNotifs
}

export const useNotifications = (userID, limit) => {

  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    getAllNotifications(userID, setNotifications, limit)
  }, [userID, limit])

  return notifications
}