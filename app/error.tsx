"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLocalization } from "@/hooks/useLocalization"
import { useTelegramButton } from "@/hooks/useTelegramButton"
import { getFriendlyErrorMessage } from "@/errors/messages"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()
  const { t } = useLocalization()
  const friendly = getFriendlyErrorMessage("UNKNOWN", t)

  useTelegramButton({
    type: "main",
    text: t.common.errorBoundaryRetry,
    onClick: reset,
  })

  useTelegramButton({
    type: "back",
    onClick: () => router.back(),
  })

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="error-boundary">
      <h2 className="error-boundary__title">
        {t.common.errorBoundaryTitle}
      </h2>
      <p className="error-boundary__message">{friendly}</p>
    </div>
  )
}
