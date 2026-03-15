"use client";

import { createContext, useEffect, useState, type ReactNode } from "react";
import {
  getTelegramWebApp,
  isTelegramWebApp,
  getTelegramUser,
  initTelegramWebApp,
  getTelegramLanguage,
} from "@/lib/telegram";
import type { TelegramUser } from "@/types/telegram";

export type TelegramContextValue = {
  user: TelegramUser | null;
  language: string;
  isInTelegram: boolean;
  isReady: boolean;
};

export const TelegramContext = createContext<TelegramContextValue | undefined>(
  undefined,
);

export function TelegramContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isInTelegram, setIsInTelegram] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [language, setLanguage] = useState<string>("en");

  useEffect(() => {
    const checkTelegram = () => {
      const inTelegram = isTelegramWebApp();
      setIsInTelegram(inTelegram);

      if (inTelegram) {
        initTelegramWebApp();
        const telegramUser = getTelegramUser();
        setUser(telegramUser);
        const telegramLanguage = getTelegramLanguage();
        setLanguage(telegramLanguage || "en");
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
  }, []);

  const value: TelegramContextValue = {
    user,
    language,
    isInTelegram,
    isReady,
  };

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  );
}
