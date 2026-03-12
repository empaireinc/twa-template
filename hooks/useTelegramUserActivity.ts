"use client";

import { useEffect, useState } from "react";
import { useTelegram } from "@/hooks/useTelegram";
import { getTelegramWebApp } from "@/lib/telegram";

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

      const getItems = (keys: string[]) =>
        new Promise<Record<string, string | null>>((resolve, reject) => {
          storage.getItems(keys, (err, values) => {
            if (err) {
              reject(err);
              return;
            }
            const result: Record<string, string | null> = {};
            keys.forEach((key) => {
              result[key] = values[key] ?? null;
            });
            resolve(result);
          });
        });

      const setItem = (key: string, value: string) =>
        new Promise<void>((resolve, reject) => {
          storage.setItem(key, value, (err) => {
            if (err) {
              reject(err);
              return;
            }
            resolve();
          });
        });

      try {
        const { registered_at, last_login_at } = await getItems([
          "registered_at",
          "last_login_at",
        ]);

        let reg = registered_at;
        let last = last_login_at;
        let displayLast: string | null = last;

        if (!reg) {
          // Первый визит: регистрируем и показываем текущий момент
          reg = nowIso;
          last = nowIso;
          displayLast = nowIso;
          await setItem("registered_at", reg);
          await setItem("last_login_at", last);
        } else {
          // Повторный визит: показываем прошлый last_login_at,
          // а в хранилище обновляем last_login_at на "сейчас"
          displayLast = last;
          const newLast = nowIso;
          await setItem("last_login_at", newLast);
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

