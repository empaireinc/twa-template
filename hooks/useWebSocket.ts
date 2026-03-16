"use client";

import { useEffect, useRef, useState } from "react";
import {
  createWebSocketClient,
  type WebSocketClient,
} from "@/services/websocket-service";

export type UseWebSocketOptions = {
  url: string;
};

export type UseWebSocketResult = {
  status: "idle" | "connecting" | "open" | "closed" | "error";
  error: string | null;
  lastRate: number | null;
  send: (data: string) => void;
};

export function useWebSocket({ url }: UseWebSocketOptions): UseWebSocketResult {
  const clientRef = useRef<WebSocketClient | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [lastRate, setLastRate] = useState<number | null>(null);
  const [status, setStatus] = useState<
    "idle" | "connecting" | "open" | "closed" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) {
      setStatus("idle");
      setError(null);
      return;
    }

    const connectWithHandlers = () => {
      setStatus("connecting");
      setError(null);

      const client = createWebSocketClient(url);
      clientRef.current = client;

      client.connect((event) => {
        try {
          const raw =
            typeof event.data === "string" ? event.data : String(event.data);
          const parsed = JSON.parse(raw) as { rate?: number } | null;
          if (parsed && typeof parsed.rate === "number") {
            setLastRate(parsed.rate);
          }
        } catch {
          // игнорируем некорректные сообщения
        }
      });

      const socket = client.getSocket();
      if (socket) {
        socket.addEventListener("open", () => {
          setStatus("open");
        });
        socket.addEventListener("error", () => {
          setStatus("error");
          setError("WebSocket connection error");
        });
        socket.addEventListener("close", () => {
          setStatus("closed");
          // простейший авто-reconnect через 3 секунды
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
          reconnectTimeoutRef.current = setTimeout(() => {
            connectWithHandlers();
          }, 3000);
        });
      }
    };

    connectWithHandlers();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      clientRef.current?.disconnect();
    };
  }, [url]);

  const send = (data: string) => {
    clientRef.current?.send(data);
  };

  return { status, error, lastRate, send };
}

