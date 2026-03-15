"use client";

import { useEffect } from "react";
import { useTelegram } from "@/hooks/useTelegram";
import { getTelegramWebApp } from "@/lib/telegram";

type MainButtonOptions = {
  type: "main";
  text: string;
  onClick: () => void;
  isVisible?: boolean;
  color?: string;
  textColor?: string;
};

type BackButtonOptions = {
  type: "back";
  onClick: () => void;
  isVisible?: boolean;
};

export type UseTelegramButtonOptions = MainButtonOptions | BackButtonOptions;

export function useTelegramButton(options: UseTelegramButtonOptions) {
  const { isInTelegram, isReady } = useTelegram();

  useEffect(() => {
    if (!isInTelegram || !isReady) {
      return;
    }

    const webApp = getTelegramWebApp();
    if (!webApp) {
      return;
    }

    const handler = () => {
      options.onClick();
    };

    if (options.type === "main") {
      const isVisible = options.isVisible ?? true;

      if (options.color || options.textColor) {
        webApp.MainButton.setParams({
          ...(options.color ? { color: options.color } : {}),
          ...(options.textColor ? { text_color: options.textColor } : {}),
        });
      }

      webApp.MainButton.setText(options.text);
      if (isVisible) {
        webApp.MainButton.show();
      } else {
        webApp.MainButton.hide();
      }
      webApp.MainButton.onClick(handler);
      return () => {
        webApp.MainButton.offClick(handler);
        webApp.MainButton.hide();
      };
    }

    if (options.type === "back") {
      const isVisible = options.isVisible ?? true;
      if (isVisible) {
        webApp.BackButton.show();
      } else {
        webApp.BackButton.hide();
      }
      webApp.BackButton.onClick(handler);
      return () => {
        webApp.BackButton.offClick(handler);
        webApp.BackButton.hide();
      };
    }
  }, [
    isInTelegram,
    isReady,
    options.type,
    options.onClick,
    options.isVisible,
    ...(options.type === "main"
      ? [options.text, options.color, options.textColor]
      : []),
  ]);
}
