"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLocalization } from "@/hooks/useLocalization"
import { useTelegramButton } from "@/hooks/useTelegramButton"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()
  const { t } = useLocalization()

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
      <p className="error-boundary__message">{error.message}</p>
    </div>
  )
}
