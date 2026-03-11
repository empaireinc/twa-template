"use client"

import Image from "next/image"
import { useTelegram } from "@/hooks/useTelegram"
import { useTelegramAuth } from "@/hooks/useTelegramAuth"
import { useTelegramMainButton } from "@/hooks/useTelegramMainButton"
import { getTelegramWebApp } from "@/lib/telegram"
import { useTelegramUserActivity } from "@/hooks/useTelegramUserActivity"

export default function Home() {
  const { user, isInTelegram, isReady } = useTelegram()
  const { authMessage, authError } = useTelegramAuth()

  const isAuthSuccess = isInTelegram && isReady && !!authMessage && !authError
  const { registrationDate, lastLoginDate } = useTelegramUserActivity(isAuthSuccess)

  useTelegramMainButton({
    text: "Click me!",
    onClick: () => {
      const webApp = getTelegramWebApp()
      webApp?.showAlert("Button clicked!")
    },
  })

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
        <div className="greeting">
          <p>Loading...</p>
        </div>
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
        <div className="greeting">
          <p>Hello, Anonymous, go to telegram plz</p>
        </div>
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
        <h1>Hello, {nickname}, you use telegram miniapp. v1.2</h1>
        {authMessage && (
          <p className="greeting__auth-message">
            {authMessage}
          </p>
        )}
        {authError && (
          <p className="greeting__auth-error">
            Error: {authError}
          </p>
        )}
        {registrationDate && lastLoginDate && (
          <div className="greeting__activity">
            <p>Registered at: {registrationDate.toLocaleString()}</p>
            <p>Last login: {lastLoginDate.toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  )
}
