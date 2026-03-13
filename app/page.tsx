"use client"

import Image from "next/image"
import { useTelegram } from "@/hooks/useTelegram"
import { useTelegramAuth } from "@/hooks/useTelegramAuth"
import { useTelegramMainButton } from "@/hooks/useTelegramMainButton"
import { getTelegramWebApp } from "@/lib/telegram"
import { useTelegramUserActivity } from "@/hooks/useTelegramUserActivity"
import { useLocalization } from "@/hooks/useLocalization"

export default function Home() {
  const { user, isInTelegram, isReady } = useTelegram()
  const { authMessage, authError } = useTelegramAuth()
  const { t } = useLocalization()

  const isAuthSuccess = isInTelegram && isReady && !!authMessage && !authError
  const { registrationDate, lastLoginDate } =
    useTelegramUserActivity(isAuthSuccess)

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
          <p>{t.greeting.loading}</p>
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
          <p>{t.greeting.notInTelegram}</p>
        </div>
      </div>
    )
  }

  const nickname = user?.username || user?.first_name || "User"

  const registrationText =
    registrationDate && t.greeting.registeredAt(registrationDate.toLocaleString())
  const lastLoginText =
    lastLoginDate && t.greeting.lastLogin(lastLoginDate.toLocaleString())

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
        <h1>{t.greeting.title(nickname)}</h1>
        {authMessage && (
          <p className="greeting__auth-message">{authMessage}</p>
        )}
        {authError && (
          <p className="greeting__auth-error">Error: {authError}</p>
        )}
        {registrationText && lastLoginText && (
          <div className="greeting__activity">
            <p>{registrationText}</p>
            <p>{lastLoginText}</p>
          </div>
        )}
      </div>
    </div>
  )
}
