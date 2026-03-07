import type { TelegramWebApp, TelegramUser } from '@/types/telegram'

/**
 * Get Telegram WebApp instance
 * Returns null if not running in Telegram
 */
export function getTelegramWebApp(): TelegramWebApp | null {
  if (typeof window === 'undefined') {
    return null
  }

  if (window.Telegram?.WebApp) {
    return window.Telegram.WebApp
  }

  return null
}

/**
 * Check if app is running in Telegram
 */
export function isTelegramWebApp(): boolean {
  return getTelegramWebApp() !== null
}

/**
 * Get Telegram user data
 * Returns null if not in Telegram or user data is not available
 */
export function getTelegramUser(): TelegramUser | null {
  const webApp = getTelegramWebApp()
  if (!webApp) {
    return null
  }

  return webApp.initDataUnsafe.user || null
}

/**
 * Get Telegram initData for backend authentication
 * This is the data that should be sent to backend in Authorization header
 */
export function getTelegramInitData(): string | null {
  const webApp = getTelegramWebApp()
  if (!webApp) {
    return null
  }

  return webApp.initData || null
}

/**
 * Initialize Telegram WebApp
 * Call this when component mounts
 */
export function initTelegramWebApp(): void {
  const webApp = getTelegramWebApp()
  if (webApp) {
    webApp.ready()
    webApp.expand()
  }
}
