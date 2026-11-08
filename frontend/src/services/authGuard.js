import { isAuthenticated, logout } from './authApi.js';

export function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

export function addLogoutHandler() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
      window.location.href = 'login.html';
    });
  }
}

export function displayUserInfo() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    const userInfoEl = document.getElementById('userInfo');
    if (userInfoEl) {
      userInfoEl.textContent = `Привет, ${user.username}!`;
    }
  }
}
