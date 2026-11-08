export const errorMessages = {
  // User errors
  'USER_LOGIN_EMPTY': 'Логин не может быть пустым',
  'USER_LOGIN_TOO_SHORT': 'Логин должен содержать минимум 3 символа',
  'USER_LOGIN_TOO_LONG': 'Логин не может превышать 32 символа',
  'USER_LOGIN_INVALID': 'Логин может содержать только латиницу, цифры, _ и -',
  'USER_USERNAME_EMPTY': 'Имя пользователя не может быть пустым',
  'USER_USERNAME_TOO_SHORT': 'Имя должно содержать минимум 3 символа',
  'USER_USERNAME_TOO_LONG': 'Имя не может превышать 50 символов',
  'USER_EMAIL_EMPTY': 'Email не может быть пустым',
  'USER_EMAIL_INVALID': 'Некорректный формат email',
  'USER_PASSWORD_EMPTY': 'Пароль не может быть пустым',
  'USER_PASSWORD_TOO_SHORT': 'Пароль должен содержать минимум 6 символов',
  'USER_NOT_FOUND': 'Пользователь не найден',
  'USER_NOT_ACTIVE': 'Пользователь неактивен',
  'USER_ALREADY_EXISTS': 'Пользователь уже существует',

  // UserProfile errors
  'PROFILE_USER_ID_EMPTY': 'ID пользователя не указан',
  'PROFILE_NOT_FOUND': 'Профиль не найден',
  'PROFILE_ID_EMPTY': 'ID профиля не указан',
  'PROFILE_INVALID_BIRTH_DATE': 'Некорректная дата рождения',
  'PROFILE_BIRTH_DATE_IN_FUTURE': 'Дата рождения не может быть в будущем',
  'PROFILE_INVALID_AGE': 'Возраст должен быть от 12 до 120 лет',
  'PROFILE_INVALID_WEIGHT': 'Вес должен быть от 30 до 300 кг',
  'PROFILE_INVALID_HEIGHT': 'Рост должен быть от 100 до 250 см',

  // Recipe errors
  'RECIPE_ID_REQUIRED': 'ID рецепта обязателен',
  'RECIPE_TITLE_EMPTY': 'Название рецепта не может быть пустым',
  'RECIPE_TITLE_TOO_SHORT': 'Название должно содержать минимум 3 символа',
  'RECIPE_TITLE_TOO_LONG': 'Название не может превышать 100 символов',
  'RECIPE_INVALID_SERVINGS': 'Некорректное количество порций',
  'RECIPE_ITEMS_EMPTY': 'Список ингредиентов не может быть пустым',
  'RECIPE_INVALID_INGREDIENT': 'Некорректный ингредиент',
  'RECIPE_INVALID_IMAGE_URL': 'Некорректный URL изображения',
  'RECIPE_INVALID_COOKING_METHOD': 'Некорректный способ приготовления',

  // Auth errors
  'AUTH_TOKEN_MISSING': 'Токен авторизации отсутствует',
  'AUTH_TOKEN_EXPIRED': 'Срок действия токена истёк',
  'AUTH_TOKEN_INVALID': 'Недействительный токен',
  'INVALID_CREDENTIALS': 'Неверный логин или пароль',

  // General errors
  'INVALID_TARGET_CALORIES': 'Некорректное значение калорий (минимум 500)',
  'NO_SUITABLE_RECIPES': 'Не найдено подходящих рецептов',

  // Default fallback
  'default': 'Произошла ошибка'
};

export function getErrorMessage(errorCode) {
  return errorMessages[errorCode] || errorMessages['default'];
}
