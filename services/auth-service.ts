/**
 * Auth service for Telegram MiniApp
 * Sends initData to backend for authentication
 */

export interface AuthResponse {
  message: string
}

export const authService = {
  /**
   * Authenticate using Telegram initData
   * @param initData - Telegram WebApp initData (from getTelegramInitData())
   * @returns Promise with auth response containing message
   */
  authenticate: async (initData: string): Promise<AuthResponse> => {
    const response = await fetch('https://auth-learn.ru.tuna.am/auth/tg', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${initData}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Auth failed: ${response.status} ${response.statusText}`)
    }

    const data: AuthResponse = await response.json()
    return data
  },
}
