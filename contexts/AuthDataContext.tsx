"use client";

import { createContext, type ReactNode } from "react";
import { useTelegramContext } from "@/hooks/useTelegramContext";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";
import { useTelegramUserActivity } from "@/hooks/useTelegramUserActivity";

export type AuthDataContextValue = {
  authMessage: string | null;
  authError: string | null;
  isAuthLoading: boolean;
  authenticate: () => Promise<void>;
  registrationDate: Date | null;
  lastLoginDate: Date | null;
  isActivityLoading: boolean;
  activityError: string | null;
};

export const AuthDataContext = createContext<AuthDataContextValue | undefined>(
  undefined,
);

export function AuthDataContextProvider({ children }: { children: ReactNode }) {
  const { isInTelegram, isReady } = useTelegramContext();
  const {
    authMessage,
    authError,
    isAuthLoading,
    authenticate,
  } = useTelegramAuth();

  const isAuthSuccess =
    isInTelegram && isReady && !!authMessage && !authError;

  const {
    registrationDate,
    lastLoginDate,
    isLoading: isActivityLoading,
    error: activityError,
  } = useTelegramUserActivity(isAuthSuccess);

  const value: AuthDataContextValue = {
    authMessage,
    authError,
    isAuthLoading,
    authenticate,
    registrationDate,
    lastLoginDate,
    isActivityLoading,
    activityError,
  };

  return (
    <AuthDataContext.Provider value={value}>
      {children}
    </AuthDataContext.Provider>
  );
}
