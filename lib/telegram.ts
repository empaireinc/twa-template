import type { TelegramWebApp, TelegramUser } from "@/types/telegram"

/**
 * Get Telegram WebApp instance
 * Returns null if not running in Telegram
 */
export function getTelegramWebApp(): TelegramWebApp | null {
  if (typeof window === "undefined") {
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

export function getTelegramLanguage(): string | null {
  const webApp = getTelegramWebApp()
  if (!webApp) {
    return null
  }

  return webApp.initDataUnsafe.user?.language_code || null
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

/**
 * HapticFeedback — тактильная отдача (вибрация) на устройстве.
 * Работает только в Telegram на поддерживаемых устройствах (в основном смартфоны).
 * Делает интерфейс ощутимым: пользователь чувствует короткий отклик при действиях.
 *
 * impactOccurred(style) — короткий «удар» разной силы (light / medium / heavy / rigid / soft).
 *   Используй при нажатии кнопок, переключении, любом «физическом» действии.
 *
 * notificationOccurred(type) — отклик по смыслу события: success / warning / error.
 *   Используй при завершении операции (успех, предупреждение, ошибка).
 *
 * selectionChanged() — лёгкий щелчок при смене выбора (например, при переборе пунктов списка или табов).
 */
export function hapticImpact(
  style: "light" | "medium" | "heavy" | "rigid" | "soft",
): void {
  const webApp = getTelegramWebApp()
  webApp?.HapticFeedback?.impactOccurred(style)
}

export function hapticNotification(
  type: "error" | "success" | "warning",
): void {
  const webApp = getTelegramWebApp()
  webApp?.HapticFeedback?.notificationOccurred(type)
}

export function hapticSelectionChanged(): void {
  const webApp = getTelegramWebApp()
  webApp?.HapticFeedback?.selectionChanged()
}

type CloudStorage = TelegramWebApp["CloudStorage"]

export const CLOUD_STORAGE_KEYS = {
  REGISTERED_AT: "registered_at",
  LAST_LOGIN_AT: "last_login_at",
} as const

export function getCloudStorageItems(
  storage: CloudStorage,
  keys: string[],
): Promise<Record<string, string | null>> {
  return new Promise((resolve, reject) => {
    storage.getItems(keys, (err, values) => {
      if (err) {
        reject(err)
        return
      }
      const result: Record<string, string | null> = {}
      keys.forEach((key) => {
        result[key] = values[key] ?? null
      })
      resolve(result)
    })
  })
}


export function setCloudStorageItem(
  storage: CloudStorage,
  key: string,
  value: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    storage.setItem(key, value, (err) => {
      if (err) {
        reject(err)
        return
      }
      resolve()
    })
  })
}
