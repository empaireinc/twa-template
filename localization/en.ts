export const en = {
  common: {
    mainButtonText: "Click me!",
    mainButtonAlert: "Button clicked!",
    errorPrefix: "Error: ",
    errorBoundaryTitle: "Something went wrong",
    errorBoundaryRetry: "Try again",
    secondPageButtonText: "Second page",
  },
  greeting: {
    loading: "Loading...",
    notInTelegram: "Hello, Anonymous, go to telegram plz",
    title: (name: string) => `Hello, ${name}, you use Telegram miniapp. v1.2`,
    registeredAt: (date: string) => `Registered at: ${date}`,
    lastLogin: (date: string) => `Last login: ${date}`,
  },
  page1: {
    title: "Test page",
    mainButtonText: "Raise Error Example",
  },
  websocket: {
    connecting: "Connecting to server...",
  },
  errors: {
    authFailed: "Authentication failed",
    websocketConnection: "Failed to connect to server",
    unknown: "An unknown error occurred",
  },
};

