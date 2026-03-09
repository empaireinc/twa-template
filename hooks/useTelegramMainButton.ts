"use client";

import { useEffect } from "react";
import { useTelegram } from "@/hooks/useTelegram";
import { getTelegramWebApp } from "@/lib/telegram";

type UseTelegramMainButtonOptions = {
  text: string;
  onClick: () => void;
  isVisible?: boolean;
};

export function useTelegramMainButton({
  text,
  onClick,
  isVisible = true,
}: UseTelegramMainButtonOptions) {
  const { isInTelegram, isReady } = useTelegram();

  useEffect(() => {
    if (!isInTelegram || !isReady) {
      return;
    }

    const webApp = getTelegramWebApp();
    if (!webApp) {
      return;
    }

    webApp.MainButton.setText(text);
    if (isVisible) {
      webApp.MainButton.show();
    } else {
      webApp.MainButton.hide();
    }

    const handler = () => {
      onClick();
    };

    webApp.MainButton.onClick(handler);

    return () => {
      webApp.MainButton.offClick(handler);
    };
  }, [isInTelegram, isReady, text, onClick, isVisible]);
}

