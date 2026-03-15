"use client";

import { useEffect } from "react";
import { useTelegramContext } from "@/hooks/useTelegramContext";
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
  const { isInTelegram, isReady } = useTelegramContext();

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
      const theme = webApp.themeParams;
      const defaultColor = theme?.button_color ?? "#2481cc";
      const defaultTextColor = theme?.button_text_color ?? "#ffffff";

      webApp.MainButton.setParams({
        color: options.color ?? defaultColor,
        text_color: options.textColor ?? defaultTextColor,
      });

      webApp.MainButton.setText(options.text);
      if (isVisible) {
        webApp.MainButton.show();
      } else {
        webApp.MainButton.hide();
      }
      webApp.MainButton.onClick(handler);
      return () => {
        webApp.MainButton.offClick(handler);
        webApp.MainButton.setParams({
          color: defaultColor,
          text_color: defaultTextColor,
        });
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
