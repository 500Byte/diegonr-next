'use client'

import { useEffect, useState } from 'react'

export function usePWA() {
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    // Check if app is already installed
    if (typeof window !== 'undefined') {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      const isInWebAppiOS = (window.navigator as any).standalone === true
      setIsInstalled(isStandalone || isInWebAppiOS)

      // Listen for install prompt
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault()
        setDeferredPrompt(e)
        setIsInstallable(true)
      })

      // Listen for successful installation
      window.addEventListener('appinstalled', () => {
        setIsInstalled(true)
        setIsInstallable(false)
        setDeferredPrompt(null)
      })

      // Register service worker
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration)
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError)
          })
      }

      // Monitor online/offline status
      const handleOnline = () => setIsOnline(true)
      const handleOffline = () => setIsOnline(false)

      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)

      // Set initial online status
      setIsOnline(navigator.onLine)

      return () => {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
      }
    }
  }, [])

  const installPWA = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setDeferredPrompt(null)
      setIsInstallable(false)
    }
  }

  const shareContent = async (data: { title: string; text: string; url: string }) => {
    if (navigator.share) {
      try {
        await navigator.share(data)
        return true
      } catch (error) {
        console.log('Error sharing:', error)
        return false
      }
    }
    return false
  }

  return {
    isInstallable,
    isInstalled,
    isOnline,
    installPWA,
    shareContent,
  }
}

// PWA Install Button Component
export function PWAInstallButton() {
  const { isInstallable, installPWA } = usePWA()

  if (!isInstallable) return null

  return (
    <button
      onClick={installPWA}
      className="fixed bottom-4 right-4 z-50 px-4 py-2 bg-white text-black font-medium rounded-lg shadow-lg hover:bg-white/90 transition-colors"
    >
      Instalar App
    </button>
  )
}

// Offline Indicator Component
export function OfflineIndicator() {
  const { isOnline } = usePWA()

  if (isOnline) return null

  return (
    <div className="fixed top-4 right-4 z-50 px-4 py-2 bg-red-500 text-white font-medium rounded-lg shadow-lg">
      Sin conexión
    </div>
  )
}