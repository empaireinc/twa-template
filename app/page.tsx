"use client"

import Image from "next/image"
import { useTelegram } from "@/hooks/useTelegram"
import { useTelegramAuth } from "@/hooks/useTelegramAuth"
import { useTelegramMainButton } from "@/hooks/useTelegramMainButton"
import { getTelegramWebApp } from "@/lib/telegram"

export default function Home() {
  const { user, isInTelegram, isReady } = useTelegram()
  const { authMessage, authError } = useTelegramAuth()

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
          <div
            style={{
              marginTop: "20px",
              fontSize: "18px",
              fontWeight: "normal",
            }}
          >
            {authMessage}
          </div>
        )}
        {authError && (
          <div
            style={{
              marginTop: "20px",
              fontSize: "18px",
              fontWeight: "normal",
              color: "red",
            }}
          >
            Error: {authError}
          </div>
        )}
      </div>
    </div>
  )
}
