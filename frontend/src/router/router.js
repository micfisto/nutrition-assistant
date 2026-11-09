import { isAuthenticated } from '../services/authApi.js';

export function navigate(path) {
  window.location.href = path;
}

export function protectRoute() {
  if (!isAuthenticated()) {
    navigate('/login.html');
    return false;
  }
  return true;
}

export function redirectIfAuthenticated() {
  if (isAuthenticated()) {
    navigate('/');
    return true;
  }
  return false;
}
