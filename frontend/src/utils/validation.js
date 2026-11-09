export function showError(fieldId, message) {
  const errorEl = document.getElementById(`${fieldId}-error`);
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = 'block';
  }
}

export function clearError(fieldId) {
  const errorEl = document.getElementById(`${fieldId}-error`);
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.style.display = 'none';
  }
}

export function clearAllErrors() {
  const errorElements = document.querySelectorAll('.error-message');
  errorElements.forEach(el => {
    el.textContent = '';
    el.style.display = 'none';
  });
}

export function validateLogin(login) {
  if (!login) {
    showError('login', 'Логин обязателен');
    return false;
  }
  if (login.length < 3) {
    showError('login', 'Логин должен содержать минимум 3 символа');
    return false;
  }
  if (login.length > 32) {
    showError('login', 'Логин не может превышать 32 символа');
    return false;
  }
  if (!/^[a-z0-9_-]+$/.test(login)) {
    showError('login', 'Логин может содержать только латиницу, цифры, _ и -');
    return false;
  }
  clearError('login');
  return true;
}

export function validateUsername(username) {
  if (!username) {
    showError('username', 'Имя пользователя обязательно');
    return false;
  }
  if (username.length < 3) {
    showError('username', 'Имя должно содержать минимум 3 символа');
    return false;
  }
  if (username.length > 50) {
    showError('username', 'Имя не может превышать 50 символов');
    return false;
  }
  clearError('username');
  return true;
}

export function validateEmail(email) {
  if (!email) {
    showError('email', 'Email обязателен');
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showError('email', 'Некорректный формат email');
    return false;
  }
  clearError('email');
  return true;
}

export function validatePassword(password) {
  if (!password) {
    showError('password', 'Пароль обязателен');
    return false;
  }
  if (password.length < 6) {
    showError('password', 'Пароль должен содержать минимум 6 символов');
    return false;
  }
  clearError('password');
  return true;
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) {
    showError('confirm-password', 'Подтверждение пароля обязательно');
    return false;
  }
  if (password !== confirmPassword) {
    showError('confirm-password', 'Пароли не совпадают');
    return false;
  }
  clearError('confirm-password');
  return true;
}

export function validateBirthDate(birthDate) {
  if (!birthDate) {
    showError('birthDate', 'Дата рождения обязательна');
    return false;
  }
  const date = new Date(birthDate);
  const today = new Date();
  if (date > today) {
    showError('birthDate', 'Дата рождения не может быть в будущем');
    return false;
  }
  
  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age--;
  }
  
  if (age < 12 || age > 120) {
    showError('birthDate', 'Возраст должен быть от 12 до 120 лет');
    return false;
  }
  clearError('birthDate');
  return true;
}

export function validateWeight(weight) {
  if (!weight) {
    showError('weight', 'Вес обязателен');
    return false;
  }
  const weightNum = parseFloat(weight);
  if (isNaN(weightNum) || weightNum < 30 || weightNum > 300) {
    showError('weight', 'Вес должен быть от 30 до 300 кг');
    return false;
  }
  clearError('weight');
  return true;
}

export function validateHeight(height) {
  if (!height) {
    showError('height', 'Рост обязателен');
    return false;
  }
  const heightNum = parseFloat(height);
  if (isNaN(heightNum) || heightNum < 100 || heightNum > 250) {
    showError('height', 'Рост должен быть от 100 до 250 см');
    return false;
  }
  clearError('height');
  return true;
}

export function validateLoginOrEmail(loginOrEmail) {
  if (!loginOrEmail || !loginOrEmail.trim()) {
    showError('loginOrEmail', 'Логин или Email обязателен');
    return false;
  }
  clearError('loginOrEmail');
  return true;
}

export function validatePasswordRequired(password) {
  if (!password || !password.trim()) {
    showError('password', 'Пароль обязателен');
    return false;
  }
  clearError('password');
  return true;
}
