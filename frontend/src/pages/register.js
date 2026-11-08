import { register } from '../services/authApi.js';
import { redirectIfAuthenticated } from '../router/router.js';
import {
  clearAllErrors,
  validateLogin,
  validateUsername,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateBirthDate,
  validateWeight,
  validateHeight
} from '../utils/validation.js';

redirectIfAuthenticated();

const form = document.getElementById('register-form');
const submitBtn = document.getElementById('submit-btn');

// Real-time validation
document.getElementById('login').addEventListener('input', (e) => {
  validateLogin(e.target.value.toLowerCase());
});

document.getElementById('username').addEventListener('input', (e) => {
  validateUsername(e.target.value);
});

document.getElementById('email').addEventListener('input', (e) => {
  validateEmail(e.target.value);
});

document.getElementById('password').addEventListener('input', (e) => {
  validatePassword(e.target.value);
  const confirmPassword = document.getElementById('confirm-password').value;
  if (confirmPassword) {
    validateConfirmPassword(e.target.value, confirmPassword);
  }
});

document.getElementById('confirm-password').addEventListener('input', (e) => {
  const password = document.getElementById('password').value;
  validateConfirmPassword(password, e.target.value);
});

document.getElementById('birthDate').addEventListener('change', (e) => {
  validateBirthDate(e.target.value);
});

document.getElementById('weight').addEventListener('input', (e) => {
  validateWeight(e.target.value);
});

document.getElementById('height').addEventListener('input', (e) => {
  validateHeight(e.target.value);
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearAllErrors();

  const login = document.getElementById('login').value.toLowerCase().trim();
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.toLowerCase().trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const birthDate = document.getElementById('birthDate').value;
  const weight = document.getElementById('weight').value;
  const height = document.getElementById('height').value;
  const activityLevel = document.getElementById('activityLevel').value;
  const goal = document.getElementById('goal').value;

  const isValid = 
    validateLogin(login) &&
    validateUsername(username) &&
    validateEmail(email) &&
    validatePassword(password) &&
    validateConfirmPassword(password, confirmPassword) &&
    validateBirthDate(birthDate) &&
    validateWeight(weight) &&
    validateHeight(height);

  if (!isValid) {
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Регистрация...';

  try {
    await register({
      login,
      username,
      email,
      password,
      birthDate,
      weight: parseFloat(weight),
      height: parseFloat(height),
      activityLevel,
      goal,
      allergenIds: []
    });

    alert('Регистрация успешна! Теперь вы можете войти.');
    window.location.href = '/login.html';
  } catch (error) {
    alert(error.message || 'Ошибка регистрации');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Зарегистрироваться';
  }
});
