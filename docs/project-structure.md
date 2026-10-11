# Структура проекта

```text
nutrition-assistant/                  
├── backend/                          
│   ├── src/                          # Исходный код сервера
│   │   ├── app.js                    # Точка входа сервера
│   │   ├── services/                 # Бизнес-логика (UserService, UserProfileService)
│   │   ├── domain/                   # Доменные сущности, ошибки, перечисления, хелперы
│   │   │   ├── entities/             # Сущности (User, Ingredient, Recipe)
│   │   │   ├── enums/                # Перечисления (ActivityLevel, GoalType, UserRole)
│   │   │   ├── errors/               # Ошибки (AppError, DomainError, InfrastructureError, UserErrors, IngredientErrors)
│   │   │   └── helpers/              # Утилиты (Validator)
│   │   ├── infrastructure/           # Инфраструктурный слой
│   │   │   ├── mappers/              # Мапперы домен ↔ persistence (UserMapper)
│   │   │   ├── orm/                  # ORM-клиент (PrismaClient)
│   │   │   └── repositories/         # Репозитории
│   │   │       ├── UserRepository.js  # Фабрика выбора драйвера (InMemory / ORM)
│   │   │       ├── InMemoryRepositories/  # InMemoryUserRepository
│   │   │       └── OrmRepositories/       # OrmUserRepository
│   │   └── api/                      # Контроллеры (userControllers)
│   ├── prisma/                       # Prisma-схема (schema.prisma)
│   ├── prisma7.config.ts             # Конфиг Prisma CLI
│   ├── .env.example                  # Шаблон переменных окружения
│   └── package.json                  # Зависимости бэкенда
│
├── frontend/                         # Фронтенд (React / Vite)
│   ├── public/                       # Статические ассеты (favicon, manifest, robots.txt)
│   ├── src/
│   │   ├── assets/                   # Картинки, SVG, шрифты, медиа-файлы
│   │   │   ├── icons/
│   │   │   └── images/
│   │   │
│   │   ├── components/               # Общие (переиспользуемые) UI-компоненты
│   │   │   ├── ui/                   # Атомарные элементы (Button, Input, Modal, Loader, Card)
│   │   │   ├── layout/               # Каркас приложения (Header, Sidebar, Footer, Container)
│   │   │   └── forms/                # Универсальные обертки над формами
│   │   │
│   │   ├── pages/                    # Страницы приложения (View-слой для роутинга)
│   │   │   ├── HomePage/             # Главная / Лендинг
│   │   │   ├── LoginPage/            # Вход
│   │   │   ├── RegisterPage/         # Регистрация
│   │   │   ├── DashboardPage/        # Дашборд пользователя
│   │   │   ├── MealsPage/            # Дневник питания / блюда
│   │   │   └── NotFoundPage/         # 404
│   │   │
│   │   ├── modules/                  # Крупные изолированные бизнес-модули (Features)
│   │   │   ├── auth/                 # Модуль авторизации
│   │   │   │   ├── components/       # LoginForm, RegisterForm
│   │   │   │   ├── hooks/            # useAuth, useLogin
│   │   │   │   └── authService.js    # Запросы к API (/api/v1/auth)
│   │   │   ├── meals/                # Модуль трекинга еды
│   │   │   │   ├── components/       # MealCard, MealList, AddMealModal
│   │   │   │   ├── hooks/            # useMeals
│   │   │   │   └── mealsService.js   # Запросы к API (/api/v1/meals)
│   │   │   └── profile/              # Модуль профиля пользователя
│   │   │
│   │   ├── context/                  # React Contexts (глобальное состояние)
│   │   │   ├── AuthContext.jsx       # Состояние авторизованного юзера
│   │   │   └── ThemeContext.jsx      # Тема (светлая/тёмная)
│   │   │
│   │   ├── hooks/                    # Глобальные кастомные хуки
│   │   │   ├── useDebounce.js
│   │   │   └── useLocalStorage.js
│   │   │
│   │   ├── services/                 # Инфраструктура работы с сетевым слоем
│   │   │   ├── api.js                # Настроенный Axios / fetch-клиент с интерцепторами
│   │   │   └── supabaseClient.js     # Подключение к Supabase (если прямо с фронта)
│   │   │
│   │   ├── utils/                    # Вспомогательные функции (чистые функции)
│   │   │   ├── formatDate.js          # Форматирование дат
│   │   │   ├── calculateCalories.js   # Формулы калорий
│   │   │   └── validators.js         # Валидация форм (email, password)
│   │   │
│   │   ├── router/                   # Настройка роутинга (React Router)
│   │   │   ├── AppRouter.jsx         # Карта маршрутов
│   │   │   └── PrivateRoute.jsx      # Защищенный роут (только для авторизованных)
│   │   │
│   │   ├── styles/                   # Глобальные стили
│   │   │   ├── global.css / .scss    # Сброс CSS, базовые стили
│   │   │   └── variables.css         # CSS-переменные (цвета, отступы, шрифты)
│   │   │
│   │   ├── App.jsx                   # Главный компонент (Провайдеры + Роутер)
│   │   └── main.jsx                  # Точка входа Vite (ReactDOM.render)
│   │
│   ├── .env.example                  # VITE_API_URL, VITE_SUPABASE_URL
│   ├── index.html                    # HTML-шаблон для Vite
│   ├── vite.config.js                # Конфиг сборщика Vite (алиасы paths, прокси)
│   └── package.json                  # Зависимости фронтенда

├── docs/                             # Документация проекта
│   ├── tasks.md                      # Декомпозиция задач и кто за что отвечает
│   ├── features.md                   # Функциональные возможности
│   └── project-structure.md          # Подробная карта проекта
└── README.md                         