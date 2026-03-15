"use client";

import { useEffect, useState } from "react";
import { useTelegramContext } from "@/hooks/useTelegramContext";
import {
  getTelegramWebApp,
  getCloudStorageItems,
  setCloudStorageItem,
  CLOUD_STORAGE_KEYS,
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
  const { isInTelegram } = useTelegramContext();
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

      const keys = [
        CLOUD_STORAGE_KEYS.REGISTERED_AT,
        CLOUD_STORAGE_KEYS.LAST_LOGIN_AT,
      ];

      try {
        const items = await getCloudStorageItems(storage, keys);
        let reg = items[CLOUD_STORAGE_KEYS.REGISTERED_AT] ?? null;
        let last = items[CLOUD_STORAGE_KEYS.LAST_LOGIN_AT] ?? null;
        let displayLast: string | null = last;

        if (!reg) {
          reg = nowIso;
          last = nowIso;
          displayLast = nowIso;
          await setCloudStorageItem(storage, CLOUD_STORAGE_KEYS.REGISTERED_AT, reg);
          await setCloudStorageItem(storage, CLOUD_STORAGE_KEYS.LAST_LOGIN_AT, last);
        } else {
          displayLast = last;
          const newLast = nowIso;
          await setCloudStorageItem(storage, CLOUD_STORAGE_KEYS.LAST_LOGIN_AT, newLast);
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

