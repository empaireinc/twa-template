"use client";

import { useEffect, useState } from "react";
import { useTelegram } from "@/hooks/useTelegram";
import {
  getTelegramWebApp,
  getCloudStorageItems,
  setCloudStorageItem,
} from "@/lib/telegram";

type UseTelegramUserActivityResult = {
  registrationDate: Date | null;
  lastLoginDate: Date | null;
  isLoading: boolean;
  error: string | null;
};

export function useTelegramUserActivity(
  enabled: boolean,
): UseTelegramUserActivityResult {
  const { isInTelegram } = useTelegram();
  const [registrationDate, setRegistrationDate] = useState<Date | null>(null);
  const [lastLoginDate, setLastLoginDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !isInTelegram) {
      return;
    }

    const webApp = getTelegramWebApp();
    if (!webApp) {
      return;
    }

    let cancelled = false;

    const loadAndUpdateDates = async () => {
      setIsLoading(true);
      setError(null);

      const storage = webApp.CloudStorage;
      const nowIso = new Date().toISOString();

      try {
        const { registered_at, last_login_at } = await getCloudStorageItems(
          storage,
          ["registered_at", "last_login_at"],
        );

        let reg = registered_at;
        let last = last_login_at;
        let displayLast: string | null = last;

        if (!reg) {
          reg = nowIso;
          last = nowIso;
          displayLast = nowIso;
          await setCloudStorageItem(storage, "registered_at", reg);
          await setCloudStorageItem(storage, "last_login_at", last);
        } else {
          displayLast = last;
          const newLast = nowIso;
          await setCloudStorageItem(storage, "last_login_at", newLast);
          last = newLast;
        }

        if (cancelled) return;

        setRegistrationDate(new Date(reg));
        setLastLoginDate(displayLast ? new Date(displayLast) : null);
      } catch (e) {
        if (cancelled) return;
        const message =
          e instanceof Error ? e.message : "Failed to load user activity";
        setError(message);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadAndUpdateDates();

    return () => {
      cancelled = true;
    };
  }, [enabled, isInTelegram]);

  return {
    registrationDate,
    lastLoginDate,
    isLoading,
    error,
  };
}

