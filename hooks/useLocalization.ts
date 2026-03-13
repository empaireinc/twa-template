"use client";

import { useMemo } from "react";
import { useTelegram } from "./useTelegram";
import { en } from "@/localization/en";
import { ru } from "@/localization/ru";
import type { SupportedLanguage } from "@/localization";

type GreetingMessages = {
  loading: string;
  notInTelegram: string;
  title: (name: string) => string;
  registeredAt: (date: string) => string;
  lastLogin: (date: string) => string;
};

type LocalizationMessages = {
  greeting: GreetingMessages;
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
  const { language: rawLanguage } = useTelegram();

  const language = useMemo(
    () => normalizeLanguage(rawLanguage),
    [rawLanguage],
  );

  const messages: LocalizationMessages = language === "ru" ? ru : en;

  return { language, t: messages };
}
