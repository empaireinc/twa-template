"use client";

import { useContext } from "react";
import { AuthDataContext } from "@/contexts/AuthDataContext";
import type { AuthDataContextValue } from "@/contexts/AuthDataContext";

export function useAuthDataContext(): AuthDataContextValue {
  const context = useContext(AuthDataContext);
  if (!context) {
    throw new Error("useAuthDataContext must be used within AuthDataContext");
  }
  return context;
}
