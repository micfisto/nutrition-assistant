nutrition-assistant/
├── client/                     # Фронтенд (SPA на Vanilla JS / Vite)
│   ├── public/                 # Статические ассеты (логотипы, иконки, фавикон)
│   │   └── favicon.ico
│   ├── src/
│   │   ├── assets/             # Изображения, шрифты, стили
│   │   │   ├── styles/         # CSS-файлы (main.css, variables.css, components.css)
│   │   │   └── images/         # Заглушки блюд, фото
│   │   ├── components/         # Переиспользуемые UI-компоненты
│   │   │   ├── Header.js       # Шапка сайта и навигация
│   │   │   ├── Footer.js       # Подвал
│   │   │   ├── Modal.js        # Универсальное модальное окно (для Auth)
│   │   │   ├── DishCard.js     # Карточка блюда с КБЖУ
│   │   │   └── ChatWidget.js   # Виджет AI-чата
│   │   ├── pages/              # Основные экраны приложения
│   │   │   ├── Home.js         # Главная страница (Лендинг + Калькулятор)
│   │   │   ├── Plan.js         # Персональный план питания на неделю
│   │   │   └── Profile.js      # Личный кабинет и Избранное
│   │   ├── services/           # Запросы к Backend API (Fetch / Axios wrappers)
│   │   │   ├── api.js          # Базовый HTTP-клиент с прокидыванием JWT
│   │   │   ├── authService.js  # Запросы авторизации (login, register, /me)
│   │   │   ├── planService.js  # Запросы меню, замены блюд, КБЖУ
│   │   │   └── aiService.js    # Запросы к AI-чату
│   │   ├── utils/              # Вспомогательные скрипты
│   │   │   ├── localStorage.js # Работа с LocalStorage (сохранение черновиков)
│   │   │   └── calcKbzu.js     # Клиентский расчёт формулы Миффлина-Сан Жеора
│   │   ├── router.js           # Маршрутизатор (SPA-роутинг без перезагрузки)
│   │   └── main.js             # Точка входа клиентского приложения
│   ├── index.html              # Главный HTML-файл
│   ├── vite.config.js          # Конфигурация Vite
│   └── package.json            # Зависимости фронтенда
│
├── server/                     # Бэкенд (Node.js + Express)
│   ├── src/
│   │   ├── config/             # Конфигурация подкючений
│   │   │   ├── supabase.js     # Подключение к базе данных Supabase
│   │   │   └── env.js          # Загрузка переменная окружения (.env)
│   │   ├── controllers/        # Логика обработки эндпоинтов (Request/Response)
│   │   │   ├── authController.js # Вход, регистрация, JWT
│   │   │   ├── userController.js # Профиль, расчет КБЖУ
│   │   │   ├── menuController.js # Выдача блюд, кастомизация, замена
│   │   │   └── aiController.js   # Обработка промптов и вызов AI API
│   │   ├── middlewares/        # Промежуточные обработчики
│   │   │   ├── authMiddleware.js # Проверка JWT-токена в заголовках
│   │   │   └── errorMiddleware.js# Глобальная обработка ошибок
│   │   ├── routes/             # Маршруты API (Endpoints)
│   │   │   ├── authRoutes.js   # /api/auth/*
│   │   │   ├── userRoutes.js   # /api/user/*
│   │   │   ├── menuRoutes.js   # /api/menu/*
│   │   │   └── aiRoutes.js     # /api/ai/*
│   │   ├── services/           # Бизнес-логика и внешние интеграции
│   │   │   └── aiService.js    # Промпт-инжиниринг и интеграция с Gemini/Groq API
│   │   ├── utils/              # Хелперы
│   │   │   └── jwt.js          # Генерация и верификация токенов
│   │   └── app.js              # Инициализация Express-приложения и роутов
│   ├── index.js                # Точка входа сервера (Запуск app.listen)
│   ├── .env.example            # Пример файла переменных окружения
│   └── package.json            # Зависимости бэкенда
│
├── Dockerfile                  # Докер-файл для сборки
├── docker-compose.yml          # Сборка и запуск Client + Server в контейнерах
├── .gitignore                  # Исключения Git (node_modules, .env)
└── README.md                   # Описание проекта и инструкции