export const ru = {
  common: {
    mainButtonText: "Нажми меня!",
    mainButtonAlert: "Кнопка нажата!",
    errorPrefix: "Ошибка: ",
    authFailed: "Ошибка авторизации",
    errorBoundaryTitle: "Что-то пошло не так",
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
};