"use client";

import { useContext } from "react";
import { TelegramContext } from "@/contexts/TelegramContext";

export function useTelegramContext() {
  const context = useContext(TelegramContext);

  if (!context) {
    throw new Error("useTelegramContext must be used within TelegramContext");
  }

  return context;
}
