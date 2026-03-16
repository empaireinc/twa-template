"use client"

import { useTelegramContext } from "@/hooks/useTelegramContext"
import { useTelegramButton } from "@/hooks/useTelegramButton"
import { getTelegramWebApp, hapticNotification } from "@/lib/telegram"
import { useAuthDataContext } from "@/hooks/useAuthDataContext"
import { useLocalization } from "@/hooks/useLocalization"
import { CustomButton } from "@/components/UI/CustomButton"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  const { user, isInTelegram, isReady } = useTelegramContext()
  const { authMessage, authError, registrationDate, lastLoginDate } =
    useAuthDataContext()
  const { t } = useLocalization()

  useTelegramButton({
    type: "main",
    text: t.common.mainButtonText,
    onClick: () => {
      hapticNotification("success")
      const webApp = getTelegramWebApp()
      webApp?.showAlert(t.common.mainButtonAlert)
    },
  })

  if (!isReady) {
    return (
      <div className="container">
        <div className="page-title">
          <p>{t.greeting.loading}</p>
        </div>
      </div>
    )
  }

  if (!isInTelegram) {
    return (
      <div className="container">
        <div className="page-title">
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
      <div className="page-title">
        <h1>{t.greeting.title(nickname)}</h1>
        <div className="page-title__details">
          {authMessage && (
            <p className="greeting__auth-message">{authMessage}</p>
          )}
          {authError && (
            <p className="greeting__auth-error">
              {t.common.errorPrefix}
              {authError}
            </p>
          )}
          {registrationText && lastLoginText && (
            <div className="greeting__activity">
              <p>{registrationText}</p>
              <p>{lastLoginText}</p>
            </div>
          )}
        </div>
      </div>
      <CustomButton
        text={t.common.secondPageButtonText}
        onClick={() => router.push("/page1")}
      />
    </div>
  )
}
