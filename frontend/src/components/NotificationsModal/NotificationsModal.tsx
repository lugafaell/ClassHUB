import { useEffect } from "react"
import { X, Bell, Calendar, CheckCircle } from "lucide-react"
import { Dialog, DialogContent, DialogTitle, DialogOverlay } from "@radix-ui/react-dialog"
import { motion, AnimatePresence } from "framer-motion"
import { createConsumer } from '@rails/actioncable'
import { format } from 'date-fns'
import "./NotificationsModal.css"

interface Notification {
  id: string
  message: string
  notifiable_type: 'Tarefa' | 'Event'
  notifiable: {
    id: number
    titulo?: string
    data_entrega?: string
    title?: string
    date?: string
    location?: string
  } | null
  read: boolean
}

interface NotificationsModalProps {
  isOpen: boolean
  onClose: () => void
  notifications: Notification[]
  onNotificationsUpdate: (notifications: Notification[]) => void
}

export default function NotificationsModal({ 
  isOpen, 
  onClose, 
  notifications,
  onNotificationsUpdate
}: NotificationsModalProps) {
  const getAuthToken = () => {
    const auth = localStorage.getItem('auth')
    if (auth) {
      const authData = JSON.parse(auth)
      return authData.token
    }
    return null
  }

  useEffect(() => {
    const token = getAuthToken()
    if (!token) return

    const consumer = createConsumer('http://localhost:3000/cable')

    const channel = consumer.subscriptions.create(
      {
        channel: "NotificationsChannel",
        token: token
      },
      {
        received: (data: Notification) => {
          onNotificationsUpdate([data, ...notifications])
        }
      }
    )

    return () => {
      channel.unsubscribe()
      consumer.disconnect()
    }
  }, [notifications, onNotificationsUpdate])

  const markAsRead = async (id: string) => {
    const token = getAuthToken()
    if (!token) return

    try {
      await fetch(`http://localhost:3000/api/notifications/${id}/mark_as_read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      const updatedNotifications = notifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
      onNotificationsUpdate(updatedNotifications)
    } catch (error) {
      console.error('Erro ao marcar como lida:', error)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Data não informada'
    const date = new Date(dateString)
    date.setUTCHours(12, 0, 0, 0)
    return format(date, 'dd/MM/yyyy')
  }

  const markAllAsRead = async () => {
    const token = getAuthToken()
    if (!token) return

    try {
      await fetch('http://localhost:3000/api/notifications/mark_all_as_read', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      const updatedNotifications = notifications.map(notification => ({ 
        ...notification, 
        read: true 
      }))
      onNotificationsUpdate(updatedNotifications)
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error)
    }
  }

  const removeNotification = async (id: string) => {
    const token = getAuthToken()
    if (!token) return
  
    try {
      await fetch(`http://localhost:3000/api/notifications/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
  
      const updatedNotifications = notifications.filter(notification => notification.id !== id)
      onNotificationsUpdate(updatedNotifications)
    } catch (error) {
      console.error("Erro ao excluir notificação:", error)
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length
  const readCount = notifications.filter(n => n.read).length
  const progress = notifications.length > 0 ? (readCount / notifications.length) * 100 : 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="dialog-overlay-noti" />
      <DialogContent className="dialog-content-noti">
        <div className="dialog-header-noti">
          <DialogTitle className="dialog-title-noti">
            <Bell className="icon-noti" />
            <span>Notificações Escolares</span>
          </DialogTitle>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="mark-all-button-noti"
            >
              Marcar todas como lidas
            </button>
          )}
        </div>
        <div className="progress-container-noti">
          <div className="progress-bar-noti">
            <div className="progress-fill-noti" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="progress-text-noti">
            {readCount} de {notifications.length} lidas
          </p>
        </div>
        <div className="notifications-list-noti">
          {notifications.length === 0 ? (
            <p className="text-center py-4 text-gray-500">Nenhuma notificação</p>
          ) : (
            <AnimatePresence>
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className={`notification-item-noti ${notification.read ? "completed" : ""}`}
                >
                  <div className="notification-content-noti">
                    <div>
                      <h3 className={`notification-title-noti ${notification.read ? "completed" : ""}`}>
                        {notification.notifiable_type === 'Tarefa'
                          ? notification.notifiable?.titulo || 'Tarefa'
                          : notification.notifiable?.title || 'Tarefa'}
                      </h3>
                      <p className="notification-description-noti">{notification.message}</p>
                    </div>
                    <span className={`notification-type-noti ${notification.notifiable_type.toLowerCase()}`}>
                      {notification.notifiable_type === 'Tarefa' ? (
                        <CheckCircle className="icon-noti" />
                      ) : (
                        <Calendar className="icon-noti" />
                      )}
                      <span>{notification.notifiable_type}</span>
                    </span>
                  </div>
                  <div className="notification-actions-noti">
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className={`action-button-noti ${notification.read ? "completed" : ""}`}
                    >
                      {notification.read ? "V" : "Marcar como lida"}
                    </button>
                    <button
                      onClick={() => removeNotification(notification.id)}
                      className="remove-button-noti"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  {notification.notifiable_type === 'Tarefa' && notification.notifiable?.data_entrega && (
                    <p className="text-xs text-gray-500 mt-1">
                      Entrega: {formatDate(notification.notifiable.data_entrega)}
                    </p>
                  )}
                  {notification.notifiable_type === 'Event' && notification.notifiable && (
                    <p className="text-xs text-gray-500 mt-1">
                      Data: {formatDate(notification.notifiable.date)} - Local: {notification.notifiable.location || 'Local não informado'}
                    </p>
                  )}
                  <div className={`notification-progress-noti ${notification.read ? "completed" : ""}`}></div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}