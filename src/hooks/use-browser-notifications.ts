'use client'

import { useEffect, useState, useCallback } from 'react'

interface NotificationOptions {
  title: string
  body: string
  icon?: string
  tag?: string
  requireInteraction?: boolean
  url?: string
}

export function useBrowserNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Verificar se o navegador suporta notificações
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setIsSupported(true)
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      console.warn('Browser notifications are not supported')
      return false
    }

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      return result === 'granted'
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return false
    }
  }, [isSupported])

  const sendNotification = useCallback(
    (options: NotificationOptions) => {
      if (!isSupported) {
        console.warn('Browser notifications are not supported')
        return
      }

      if (permission !== 'granted') {
        console.warn('Notification permission not granted')
        return
      }

      try {
        const notification = new Notification(options.title, {
          body: options.body,
          icon: options.icon || '/favicon.ico',
          tag: options.tag,
          requireInteraction: options.requireInteraction || false,
          badge: '/favicon.ico',
          silent: false, // Permite som da notificação
        })

        // Deixar o sistema operacional gerenciar o ciclo de vida da notificação
        // Não fechamos automaticamente para permitir que fique no histórico

        // Opcional: fazer algo quando a notificação for clicada
        notification.onclick = () => {
          window.focus()
          if (options.url) {
            window.location.href = options.url
          }
          notification.close()
        }

        return notification
      } catch (error) {
        console.error('Error sending notification:', error)
      }
    },
    [isSupported, permission]
  )

  return {
    permission,
    isSupported,
    requestPermission,
    sendNotification,
  }
}
