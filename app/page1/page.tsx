"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTelegramButton } from "@/hooks/useTelegramButton";
import { useLocalization } from "@/hooks/useLocalization";
import { useWebSocket } from "@/hooks/useWebSocket";
import { getFriendlyErrorMessage } from "@/errors/messages";

const ERROR_MESSAGE = "Raise Error Example";
const WS_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL ?? "";

export default function Page1() {
  const router = useRouter();
  const { t } = useLocalization();
  const [raiseError, setRaiseError] = useState(false);
  const { status, errorCode, lastRate } = useWebSocket({ url: WS_URL });
  const wsText =
    status === "error" && errorCode
      ? getFriendlyErrorMessage(errorCode, t)
      : status === "connecting"
        ? t.websocket.connecting
        : lastRate !== null
          ? String(lastRate)
          : null;

  if (raiseError) {
    throw new Error(ERROR_MESSAGE);
  }

  useTelegramButton({
    type: "main",
    text: t.page1.mainButtonText,
    color: "#FF3B30",
    onClick: () => setRaiseError(true),
  });

  useTelegramButton({
    type: "back",
    onClick: () => {
      router.back();
    },
  });

  return (
    <div className="container">
      <div className="page-title">
        <h1>{t.page1.title}</h1>
        <div className="page-title__details page-title__details--page1">
          <div className="page-title__row">
            {wsText && (
              <p
                className={
                  status === "error"
                    ? "greeting__auth-error"
                    : "greeting__activity"
                }
              >
                {wsText}
              </p>
            )}
          </div>
          <div className="page-title__row" />
        </div>
      </div>
    </div>
  );
}

