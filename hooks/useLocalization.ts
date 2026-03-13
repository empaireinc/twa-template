"use client";

import { useMemo } from "react";
import { useTelegram } from "./useTelegram";
import { languages, type SupportedLanguage } from "@/localization";

type UseLocalizationResult = {
  language: SupportedLanguage;
  t: typeof languages.en;
};

function normalizeLanguage(lang?: string): SupportedLanguage {
  if (!lang) return "en";
  const short = lang.slice(0, 2).toLowerCase();
  if (short in languages) {
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

  const t = languages[language];

  return { language, t };
}
