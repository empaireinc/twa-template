"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { 
  getTelegramWebApp, 
  isTelegramWebApp, 
  getTelegramUser,
  initTelegramWebApp,
  getTelegramInitData
} from "@/lib/telegram"
import type { TelegramUser } from "@/types/telegram"
import { authService } from "@/services/auth-service"

export default function Home() {
  const [user, setUser] = useState<TelegramUser | null>(null)
  const [isInTelegram, setIsInTelegram] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [authMessage, setAuthMessage] = useState<string | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    let clickHandler: (() => void) | null = null

    // Wait for Telegram script to load
    const checkTelegram = () => {
      const inTelegram = isTelegramWebApp()
      setIsInTelegram(inTelegram)

      if (inTelegram) {
        initTelegramWebApp()
        const telegramUser = getTelegramUser()
        setUser(telegramUser)

        // Authenticate with backend
        // Use initData if available, otherwise use test token x-0
        const initData = getTelegramInitData() || 'x-0'
        authService.authenticate(initData)
          .then((response) => {
            setAuthMessage(response.message)
            setAuthError(null)
          })
          .catch((error) => {
            setAuthError(error.message || 'Authentication failed')
            setAuthMessage(null)
          })

        const webApp = getTelegramWebApp()
        if (webApp) {
          // Setup MainButton
          webApp.MainButton.setText("Click me!")
          clickHandler = () => {
            webApp.showAlert("Button clicked!")
          }
          webApp.MainButton.onClick(clickHandler)
          webApp.MainButton.show()
        }
      }

      setIsReady(true)
    }

    // Check if Telegram script is already loaded
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      checkTelegram()
    } else {
      // Wait for script to load
      const checkInterval = setInterval(() => {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
          clearInterval(checkInterval)
          checkTelegram()
        }
      }, 50)

      // Timeout after 1 second
      const timeout = setTimeout(() => {
        clearInterval(checkInterval)
        checkTelegram()
      }, 1000)

      return () => {
        clearTimeout(timeout)
        clearInterval(checkInterval)
        const webApp = getTelegramWebApp()
        if (webApp && clickHandler) {
          webApp.MainButton.offClick(clickHandler)
        }
      }
    }

    return () => {
      const webApp = getTelegramWebApp()
      if (webApp && clickHandler) {
        webApp.MainButton.offClick(clickHandler)
      }
    }
  }, [])

  if (!isReady) {
    return (
      <div className="container">
        <Image
          src="/greeting.png"
          alt=""
          fill
          className="container__bg"
          priority
          sizes="100vw"
        />
        <div className="greeting">Loading...</div>
      </div>
    )
  }

  if (!isInTelegram) {
    return (
      <div className="container">
        <Image
          src="/greeting.png"
          alt=""
          fill
          className="container__bg"
          priority
          sizes="100vw"
        />
        <div className="greeting">Hello, Anonymous, go to telegram plz</div>
      </div>
    )
  }

  const nickname = user?.username || user?.first_name || "User"

  return (
    <div className="container">
      <Image
        src="/greeting.png"
        alt=""
        fill
        className="container__bg"
        priority
        sizes="100vw"
      />
      <div className="greeting">
        Hello, {nickname}, you use telegram miniapp. v1.2
        {authMessage && (
          <div style={{ marginTop: '20px', fontSize: '18px', fontWeight: 'normal' }}>
            {authMessage}
          </div>
        )}
        {authError && (
          <div style={{ marginTop: '20px', fontSize: '18px', fontWeight: 'normal', color: 'red' }}>
            Error: {authError}
          </div>
        )}
      </div>
    </div>
  )
}
