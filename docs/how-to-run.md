# Руководство по запуску Nutrition Assistant

Руководство описывает, как запустить проект локально: фронтенд, бэкенд (с хранилищем в памяти и с PostgreSQL/Supabase), а также как загрузить данные рецептов.

---

## 📋 Требования

- **Node.js** 20+ ([скачать](https://nodejs.org/))
- **Docker** и **Docker Compose** (для запуска в контейнерах)
- **PostgreSQL** (опционально, если используете реальную базу вместо хранилища в памяти)

---

## 🏗 Структура проекта

```
nutrition-assistant/
├── backend/      — сервер (Node.js + Express)
├── frontend/     — клиент (Vite)
├── docs/         — документация
└── docker-compose.yml
```

---

## 🚀 Быстрый старт

### 1. Запуск бэкенда

```bash
cd backend

# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Запуск в продакшен-режиме
npm start
```

Бэкенд запустится на `http://localhost:5000`.

> **Важно:** по умолчанию используется хранилище в памяти (`DB_DRIVER=memory`). Данные рецептов загружаются автоматически при старте.

### 2. Запуск фронтенда

```bash
cd frontend

# Установка зависимостей
npm install

# Запуск в режиме разработки (порт 3000)
npm run dev

# Сборка для продакшена
npm run build

# Просмотр сборки
npm run preview
```

Фронтенд запустится на `http://localhost:3000`.

### 3. Настройка переменной окружения (опционально)

Для подключения к реальному API (например, при запуске фронтенда отдельно от бэкенда) создайте в `frontend/` файл `.env`:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

Без этой переменной фронтенд по умолчанию обращается к `http://localhost:5000/api/v1`.

---

## 🐳 Запуск через Docker Compose

```bash
# Сборка и запуск обоих сервисов
docker-compose up --build

# Запуск в фоне
docker-compose up -d

# Остановка
docker-compose down
```

- Фронтенд: `http://localhost`
- Бэкенд: `http://localhost:5000`

> В Docker-контейнере бэкенд работает с `DB_DRIVER=memory` (переменная задаётся в `docker-compose.yml`).

---

## 🗄️ Запуск с реальной базой данных (PostgreSQL/Supabase)

### 1. Подготовьте подключение к базе

В `backend/` создайте файл `.env`:

```env
PORT=5000
NODE_ENV=development

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=24h

DATABASE_URL=postgres://user:password@host:5432/nutrition_assistant
```

### 2. Настройте схему базы

Используйте SQL-сценарий `docs/supabase-setup.sql` (см. **Установка базы данных** ниже) либо выполните миграции Prisma:

```bash
cd backend

# Генерация клиента Prisma
npx prisma generate

# Применение миграций (если они настроены)
npx prisma migrate dev
```

> Примечание: в проекте используется Prisma с адаптером `@prisma/adapter-pg` для PostgreSQL. Файл `prisma/schema.prisma` содержит схему базы данных.

### 3. Запустите бэкенд с базой данных

```bash
# В режиме разработки
DB_DRIVER=orm npm run dev

# В продакшен-режиме
DB_DRIVER=orm npm start
```

При `DB_DRIVER=orm` используются ORM-репозитории (`OrmUserRepository`, `OrmRecipeRepository`, `OrmUserProfileRepository`).

---

## 📊 Установка базы данных (Supabase)

1. Создайте новую базу данных в **Supabase** (или локальном PostgreSQL).
2. Откройте **SQL Editor** в Supabase.
3. Скопируйте содержимое файла `docs/supabase-setup.sql` и выполните его.

Сценарий создаст таблицы: `users`, `user_profiles`, `ingredients`, `recipes`, индексы и триггеры для автоматического обновления `updated_at`.

Данные можно загрузить через **CSV-импорт** (см. **Загрузка датасета рецептов**).

---

## 📥 Загрузка датасета рецептов

Датасет рецептов хранится в **Google Sheets**. Инструкция по экспорту и загрузке:

1. Откройте таблицу с рецептами в Google Sheets.
2. Файл → Экспортировать → **CSV**.
3. Положите полученный файл в папку `backend/data/` (назовите, например, `recipes.csv`).
4. Запустите скрипт импорта:

   ```bash
   cd backend
   node scripts/import-recipes.js data/recipes.csv
   ```

> **CSV-шаблон** см. в `docs/csv-recipes-template.csv`. Столбцы: `id`, `title`, `description`, `servings`, `ingredients` (JSON), `image_url`, `meal_types` (через запятую), `cooking_method`.

---

## 🔐 Тестовые пользователи

При первом запуске бэкенд автоматически создаёт тестовых пользователей:

| Логин   | Пароль        | Email                        | Роль     |
|---------|---------------|------------------------------|----------|
| alice   | testpass123   | alice@example.com            | USER     |
| bob     | testpass123   | bob@example.com              | USER     |
| admin   | testpass123   | admin@nutrition-assistant.lo | ADMIN    |

Использовать можно для разработки и автотестов. **Измените пароли перед продакшном!**

---

## 🏥 Проверка состояния здоровья

Бэкенд предоставляет эндпоинт `/api/v1/health` для мониторинга:

```bash
curl http://localhost:5000/api/v1/health
```

Ответ:

```json
{
  "status": "healthy",
  "checks": {
    "app": true,
    "database": true,
    "recipesLoaded": true,
    "recipesCount": 5,
    "ingredientsCount": 10
  },
  "timestamp": "2026-11-09T14:00:00.000Z",
  "version": "1.0.0"
}
```

Статусы: `healthy` — всё работает, `degraded` — часть сервисов недоступна, `unhealthy` — критическая ошибка.

---

## 🛠 Частые проблемы

### `@prisma/client` не предоставляет `PrismaClient`
Генерация клиента Prisma не выполнена. Выполните:

```bash
cd backend
npx prisma generate
```

Это требуется только для режима с базой данных (`DB_DRIVER=orm`).

### Фронтенд не видит API (`Network Error`)
Убедитесь, что бэкенд запущен на `http://localhost:5000` и CORS разрешает запросы (по умолчанию включён).

### «Раздел скоро появится» в UI
Некоторые секции (калькулятор, цели) пока не подключены к UI. Это ожидаемое поведение — они реализованы в компонентах, но ждут интеграции.

---

## 📚 Дополнительно

- [Функциональные требования](../docs/functional-requirements.md)
- [Структура проекта](../docs/project-structure.md)
- [Список задач](../docs/tasks.md)