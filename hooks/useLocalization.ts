"use client";

import { useMemo } from "react";
import { useTelegramContext } from "./useTelegramContext";
import { en } from "@/localization/en";
import { ru } from "@/localization/ru";
import type { SupportedLanguage } from "@/localization";

type CommonMessages = {
  mainButtonText: string;
  mainButtonAlert: string;
  errorPrefix: string;
  errorBoundaryTitle: string;
  errorBoundaryRetry: string;
  secondPageButtonText: string;
};

type GreetingMessages = {
  loading: string;
  notInTelegram: string;
  title: (name: string) => string;
  registeredAt: (date: string) => string;
  lastLogin: (date: string) => string;
};

type Page1Messages = {
  title: string;
  mainButtonText: string;
};

type WebSocketMessages = {
  connecting: string;
};

type ErrorMessages = {
  authFailed: string;
  websocketConnection: string;
  unknown: string;
};

type LocalizationMessages = {
  common: CommonMessages;
  greeting: GreetingMessages;
  page1: Page1Messages;
  websocket: WebSocketMessages;
  errors: ErrorMessages;
};

type UseLocalizationResult = {
  language: SupportedLanguage;
  t: LocalizationMessages;
};

function normalizeLanguage(lang?: string): SupportedLanguage {
  if (!lang) return "en";
  const short = lang.slice(0, 2).toLowerCase();

  if (short === "en" || short === "ru") {
    return short as SupportedLanguage;
  }

  return "en";
}

export function useLocalization(): UseLocalizationResult {
  const { language: rawLanguage } = useTelegramContext();

  const language = useMemo(
    () => normalizeLanguage(rawLanguage),
    [rawLanguage],
  );

  const messages: LocalizationMessages = language === "ru" ? ru : en;

  return { language, t: messages };
}
