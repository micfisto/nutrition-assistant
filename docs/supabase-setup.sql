-- Таблицы создаёт команда `npx prisma db push` (папка backend),
-- схема лежит в backend/prisma/schema.prisma.
-- Этот скрипт выполняется в Supabase SQL Editor один раз после неё:
-- включает защиту строк, чтобы данные нельзя было читать через публичный API.

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;