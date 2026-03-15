"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTelegramButton } from "@/hooks/useTelegramButton";
import { useLocalization } from "@/hooks/useLocalization";

const ERROR_MESSAGE = "Raise Error Example";

export default function Page1() {
  const router = useRouter();
  const { t } = useLocalization();
  const [raiseError, setRaiseError] = useState(false);

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
      </div>
    </div>
  );
}

