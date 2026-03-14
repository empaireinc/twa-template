/**
 * Auth service for Telegram MiniApp
 * Sends initData to backend for authentication
 */

export interface AuthResponse {
  message: string
}

const getAuthUrl = (): string => {
  const base = process.env.NEXT_PUBLIC_BACKEND_DOMAIN ?? ""
  return `${base}/auth/tg`
}

export const authService = {
  /**
   * Authenticate using Telegram initData
   * @param initData - Telegram WebApp initData (from getTelegramInitData())
   * @returns Promise with auth response containing message
   */
  authenticate: async (initData: string): Promise<AuthResponse> => {
    let response: Response

    try {
      response = await fetch(getAuthUrl(), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${initData}`,
          "Content-Type": "application/json",
        },
      })
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Network error"
      throw new Error(message)
    }

    if (!response.ok) {
      let errorMessage = `${response.status} ${response.statusText}`
      try {
        const body = await response.json()
        if (body?.message && typeof body.message === "string") {
          errorMessage = body.message
        }
      } catch {
        // response body is not JSON, use status text
      }
      throw new Error(errorMessage)
    }

    try {
      const data: AuthResponse = await response.json()
      return data
    } catch {
      throw new Error("Invalid server response")
    }
  },
}
