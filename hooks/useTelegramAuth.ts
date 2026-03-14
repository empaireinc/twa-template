"use client";

import { useCallback, useEffect, useState } from "react";
import { useTelegram } from "@/hooks/useTelegram";
import { useLocalization } from "@/hooks/useLocalization";
import { getTelegramInitData, hapticNotification } from "@/lib/telegram";
import { authService } from "@/services/auth-service";

type UseTelegramAuthResult = {
  authMessage: string | null;
  authError: string | null;
  isAuthLoading: boolean;
  authenticate: () => Promise<void>;
};

export function useTelegramAuth(): UseTelegramAuthResult {
  const { isInTelegram, isReady } = useTelegram();
  const { t } = useLocalization();
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const authenticate = useCallback(async () => {
    if (!isInTelegram) {
      return;
    }

    const initData = getTelegramInitData() || "x-0";
    setIsAuthLoading(true);

    try {
      const response = await authService.authenticate(initData);
      setAuthMessage(response.message);
      setAuthError(null);
      hapticNotification("success");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : t.common.authFailed;
      setAuthError(message);
      setAuthMessage(null);
      hapticNotification("error");
    } finally {
      setIsAuthLoading(false);
    }
  }, [isInTelegram, t]);

  useEffect(() => {
    if (isInTelegram && isReady) {
      void authenticate();
    }
  }, [isInTelegram, isReady, authenticate]);

  return {
    authMessage,
    authError,
    isAuthLoading,
    authenticate,
  };
}

