import { login } from '../services/authApi.js';
import { redirectIfAuthenticated } from '../router/router.js';
import { clearAllErrors, validateLoginOrEmail, validatePasswordRequired } from '../utils/validation.js';

redirectIfAuthenticated();

const form = document.getElementById('login-form');
const submitBtn = document.getElementById('submit-btn');

document.getElementById('loginOrEmail').addEventListener('input', (e) => {
  validateLoginOrEmail(e.target.value);
});

document.getElementById('password').addEventListener('input', (e) => {
  validatePasswordRequired(e.target.value);
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearAllErrors();

  const loginOrEmail = document.getElementById('loginOrEmail').value.trim();
  const password = document.getElementById('password').value;

  const isValid = 
    validateLoginOrEmail(loginOrEmail) &&
    validatePasswordRequired(password);

  if (!isValid) {
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Вход...';

  try {
    await login({
      loginOrEmail,
      password
    });

    window.location.href = '/';
  } catch (error) {
    alert(error.message || 'Ошибка входа');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Войти';
  }
});
