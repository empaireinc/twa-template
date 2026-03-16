export const ru = {
  common: {
    mainButtonText: "Нажми меня!",
    mainButtonAlert: "Кнопка нажата!",
    errorPrefix: "Ошибка: ",
    errorBoundaryTitle: "Ошибка",
    errorBoundaryRetry: "Попробовать снова",
    secondPageButtonText: "Вторая страница",
  },
  greeting: {
    loading: "Загрузка...",
    notInTelegram: "Привет, Пользователь, зайди через Telegram",
    title: (name: string) =>
      `Привет, ${name}, ты используешь Telegram miniapp. v1.2`,
    registeredAt: (date: string) => `Дата регистрации: ${date}`,
    lastLogin: (date: string) => `Последний визит: ${date}`,
  },
  page1: {
    title: "Тестовая страница",
    mainButtonText: "Raise Error Example",
  },
  websocket: {
    connecting: "Подключение к серверу...",
  },
  errors: {
    authFailed: "Ошибка авторизации",
    websocketConnection: "Ошибка подключения к серверу",
    unknown: "Что-то пошло не так...",
  },
};