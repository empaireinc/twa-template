export type WebSocketMessageHandler = (event: MessageEvent) => void;

export type WebSocketClient = {
  connect: (onMessage?: WebSocketMessageHandler) => void;
  disconnect: () => void;
  send: (data: string) => void;
  getSocket: () => WebSocket | null;
};

export function createWebSocketClient(url: string): WebSocketClient {
  let socket: WebSocket | null = null;

  const connect = (onMessage?: WebSocketMessageHandler) => {
    if (
      socket &&
      (socket.readyState === WebSocket.OPEN ||
        socket.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    socket = new WebSocket(url);

    if (onMessage) {
      socket.addEventListener("message", onMessage);
    }
  };

  const disconnect = () => {
    if (!socket) return;
    socket.close();
    socket = null;
  };

  const send = (data: string) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    socket.send(data);
  };

  const getSocket = () => socket;

  return { connect, disconnect, send, getSocket };
}

