import { getAllNotifications, getReadNotifications, 
  getUnreadNotifications } from "app/services/notifServices"
import { useEffect, useState } from "react"

export const useUnreadNotifications = (userID) => {

  const [unreadNotifs, setUnreadNotifs] = useState([])

  useEffect(() => {
    getUnreadNotifications(userID, setUnreadNotifs)
  }, [userID])

  return unreadNotifs
}

export const useReadNotifications = (userID, limit) => {

  const [readNotifs, setReadNotifs] = useState([])

  useEffect(() => {
    getReadNotifications(userID, setReadNotifs, limit)
  }, [userID, limit])

  return readNotifs
}

export const useAllNotifications = (userID, limit) => {

  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    getAllNotifications(userID, setNotifications, limit)
  }, [userID, limit])

  return notifications
}