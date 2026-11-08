-- Supabase Database Setup Script for Nutrition Assistant
-- Run this in the Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    login VARCHAR(32) UNIQUE NOT NULL,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(254) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER',
    status VARCHAR(20) DEFAULT 'ACTIVE',
    deactivated_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL,
    birth_date DATE NOT NULL,
    weight FLOAT NOT NULL,
    height FLOAT NOT NULL,
    activity_level VARCHAR(20) NOT NULL,
    goal VARCHAR(20) NOT NULL,
    allergen_ids TEXT[] DEFAULT '{}',
    favorite_recipe_ids TEXT[] DEFAULT '{}',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Ingredients table
CREATE TABLE IF NOT EXISTS ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    calories_per_100g FLOAT NOT NULL,
    proteins_per_100g FLOAT NOT NULL,
    fats_per_100g FLOAT NOT NULL,
    carbs_per_100g FLOAT NOT NULL
);

-- Recipes table
CREATE TABLE IF NOT EXISTS recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(100) NOT NULL,
    description TEXT,
    servings FLOAT NOT NULL,
    ingredients JSONB NOT NULL,
    image_url VARCHAR(500),
    meal_types TEXT[] DEFAULT '{}',
    cooking_method VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_login ON users(login);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_recipes_meal_types ON recipes USING GIN(meal_types);

-- Insert sample data (optional)
-- Sample ingredients
INSERT INTO ingredients (id, name, calories_per_100g, proteins_per_100g, fats_per_100g, carbs_per_100g) VALUES
('ing-chicken', 'Куриная грудка', 165, 31, 3.6, 0),
('ing-rice', 'Рис', 130, 2.7, 0.3, 28),
('ing-broccoli', 'Брокколи', 34, 2.8, 0.4, 7),
('ing-oats', 'Овсяные хлопья', 389, 16.9, 6.9, 66),
('ing-milk', 'Молоко', 42, 3.4, 1, 5),
('ing-egg', 'Яйцо', 155, 13, 11, 1.1),
('ing-salmon', 'Лосось', 208, 20, 13, 0),
('ing-potato', 'Картофель', 77, 2, 0.1, 17),
('ing-yogurt', 'Йогурт натуральный', 59, 10, 0.4, 3.6),
('ing-banana', 'Банан', 89, 1.1, 0.3, 23)
ON CONFLICT (id) DO NOTHING;

-- Sample recipes
INSERT INTO recipes (id, title, description, servings, ingredients, image_url, meal_types, cooking_method) VALUES
('rec-oatmeal', 'Овсянка с бананом', 'Овсянка на молоке с бананом', 1, 
 '[{"ingredient":{"id":"ing-oats","name":"Овсяные хлопья","caloriesPer100g":389,"proteinsPer100g":16.9,"fatsPer100g":6.9,"carbsPer100g":66},"amountInGrams":60},{"ingredient":{"id":"ing-milk","name":"Молоко","caloriesPer100g":42,"proteinsPer100g":3.4,"fatsPer100g":1,"carbsPer100g":5},"amountInGrams":200},{"ingredient":{"id":"ing-banana","name":"Банан","caloriesPer100g":89,"proteinsPer100g":1.1,"fatsPer100g":0.3,"carbsPer100g":23},"amountInGrams":100}]',
 'https://example.com/images/oatmeal.jpg', ARRAY['breakfast'], 'Варка'),
('rec-omelette', 'Омлет', 'Омлет с молоком', 1,
 '[{"ingredient":{"id":"ing-egg","name":"Яйцо","caloriesPer100g":155,"proteinsPer100g":13,"fatsPer100g":11,"carbsPer100g":1.1},"amountInGrams":150},{"ingredient":{"id":"ing-milk","name":"Молоко","caloriesPer100g":42,"proteinsPer100g":3.4,"fatsPer100g":1,"carbsPer100g":5},"amountInGrams":50}]',
 'https://example.com/images/omelette.jpg', ARRAY['breakfast'], 'Жарка'),
('rec-chicken-rice', 'Курица с рисом и брокколи', 'Классический обед', 2,
 '[{"ingredient":{"id":"ing-chicken","name":"Куриная грудка","caloriesPer100g":165,"proteinsPer100g":31,"fatsPer100g":3.6,"carbsPer100g":0},"amountInGrams":300},{"ingredient":{"id":"ing-rice","name":"Рис","caloriesPer100g":130,"proteinsPer100g":2.7,"fatsPer100g":0.3,"carbsPer100g":28},"amountInGrams":200},{"ingredient":{"id":"ing-broccoli","name":"Брокколи","caloriesPer100g":34,"proteinsPer100g":2.8,"fatsPer100g":0.4,"carbsPer100g":7},"amountInGrams":200}]',
 'https://example.com/images/chicken-rice.jpg', ARRAY['lunch', 'dinner'], 'Запекание'),
('rec-salmon', 'Лосось с картофелем', 'Запечённый лосось', 2,
 '[{"ingredient":{"id":"ing-salmon","name":"Лосось","caloriesPer100g":208,"proteinsPer100g":20,"fatsPer100g":13,"carbsPer100g":0},"amountInGrams":200},{"ingredient":{"id":"ing-potato","name":"Картофель","caloriesPer100g":77,"proteinsPer100g":2,"fatsPer100g":0.1,"carbsPer100g":17},"amountInGrams":300}]',
 'https://example.com/images/salmon.jpg', ARRAY['dinner'], 'Запекание'),
('rec-yogurt', 'Йогурт с бананом', 'Лёгкий перекус', 1,
 '[{"ingredient":{"id":"ing-yogurt","name":"Йогурт натуральный","caloriesPer100g":59,"proteinsPer100g":10,"fatsPer100g":0.4,"carbsPer100g":3.6},"amountInGrams":200},{"ingredient":{"id":"ing-banana","name":"Банан","caloriesPer100g":89,"proteinsPer100g":1.1,"fatsPer100g":0.3,"carbsPer100g":23},"amountInGrams":100}]',
 'https://example.com/images/yogurt.jpg', ARRAY['snack'], NULL)
ON CONFLICT (id) DO NOTHING;

-- Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON recipes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
