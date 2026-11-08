const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
import { getErrorMessage } from './errorMessages.js';

export async function register({ login, username, email, password }) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, username, email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(getErrorMessage(error.error) || 'Ошибка регистрации');
  }

  return response.json();
}

export async function login({ email, password }) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(getErrorMessage(error.error) || 'Ошибка входа');
  }

  const data = await response.json();
  
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  return data;
}

export async function getMe() {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Нет токена авторизации');
  }

  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(getErrorMessage(error.error) || 'Ошибка получения данных');
  }

  return response.json();
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getToken() {
  return localStorage.getItem('token');
}

export function getUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

export function isAuthenticated() {
  return !!localStorage.getItem('token');
}
