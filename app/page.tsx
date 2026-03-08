"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { 
  getTelegramWebApp, 
  isTelegramWebApp, 
  getTelegramUser,
  initTelegramWebApp 
} from "@/lib/telegram"
import type { TelegramUser } from "@/types/telegram"

export default function Home() {
  const [user, setUser] = useState<TelegramUser | null>(null)
  const [isInTelegram, setIsInTelegram] = useState(false)
  const [isReady, setIsReady] = useState(false)

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
      </div>
    </div>
  )
}
