"use client";

import { useRouter } from "next/navigation";
import { useTelegramButton } from "@/hooks/useTelegramButton";
import { useLocalization } from "@/hooks/useLocalization";

export default function Page1() {
  const router = useRouter();
  const { t } = useLocalization();

  useTelegramButton({
    type: "main",
    text: t.page1.mainButtonText,
    color: "#FF3B30",
    onClick: () => {
      // TODO: добавить логику позже
    },
  });

  useTelegramButton({
    type: "back",
    onClick: () => {
      router.push("/");
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

