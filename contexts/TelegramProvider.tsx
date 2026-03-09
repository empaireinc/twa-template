"use client";

import { createContext, useEffect, useState, type ReactNode } from "react";
import { getTelegramWebApp, isTelegramWebApp, getTelegramUser, initTelegramWebApp } from "@/lib/telegram";
import type { TelegramUser } from "@/types/telegram";

type TelegramContextValue = {
  user: TelegramUser | null;
  isInTelegram: boolean;
  isReady: boolean;
};

export const TelegramContext = createContext<TelegramContextValue | undefined>(
  undefined,
);

export function TelegramProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isInTelegram, setIsInTelegram] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let clickHandler: (() => void) | null = null;

    const checkTelegram = () => {
      const inTelegram = isTelegramWebApp();
      setIsInTelegram(inTelegram);

      if (inTelegram) {
        initTelegramWebApp();
        const telegramUser = getTelegramUser();
        setUser(telegramUser);
      }

      setIsReady(true);
    };

    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      checkTelegram();
    } else {
      const checkInterval = setInterval(() => {
        if (typeof window !== "undefined" && window.Telegram?.WebApp) {
          clearInterval(checkInterval);
          checkTelegram();
        }
      }, 50);

      const timeout = setTimeout(() => {
        clearInterval(checkInterval);
        checkTelegram();
      }, 1000);

      return () => {
        clearTimeout(timeout);
        clearInterval(checkInterval);
      };
    }

    return () => {
      const webApp = getTelegramWebApp();
      if (webApp && clickHandler) {
        webApp.MainButton.offClick(clickHandler);
      }
    };
  }, []);

  const value: TelegramContextValue = {
    user,
    isInTelegram,
    isReady,
  };

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  );
}

