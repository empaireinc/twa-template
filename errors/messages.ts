export type AppErrorCode =
  | "AUTH_FAILED"
  | "WS_CONNECTION_ERROR"
  | "UNKNOWN";

type ErrorMessages = {
  errors: {
    authFailed: string;
    websocketConnection: string;
    unknown: string;
  };
};

export function getFriendlyErrorMessage(
  code: AppErrorCode,
  t: ErrorMessages,
): string {
  switch (code) {
    case "AUTH_FAILED":
      return t.errors.authFailed;
    case "WS_CONNECTION_ERROR":
      return t.errors.websocketConnection;
    case "UNKNOWN":
    default:
      return t.errors.unknown;
  }
}

