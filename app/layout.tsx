import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { TelegramContextProvider } from "@/contexts/TelegramContext"
import { AuthDataContextProvider } from "@/contexts/AuthDataContext"

export const metadata: Metadata = {
  title: "Telegram MiniApp",
  description: "Telegram MiniApp Template",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          src="https://telegram.org/js/telegram-web-app.js"
          async
        />
      </head>
      <body suppressHydrationWarning>
        <TelegramContextProvider>
          <AuthDataContextProvider>{children}</AuthDataContextProvider>
        </TelegramContextProvider>
      </body>
    </html>
  )
}
