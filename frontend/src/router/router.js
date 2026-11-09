import { isAuthenticated } from "../services/authApi.js";

const ROUTES = {
  "/login.html": "#/login",
  "/register.html": "#/register",
  "/": "#/",
};

export function navigate(path) {
  window.location.hash = ROUTES[path] ?? path;
}

export function protectRoute() {
  if (!isAuthenticated()) {
    navigate("/login.html");
    return false;
  }
  return true;
}

export function redirectIfAuthenticated() {
  if (isAuthenticated()) {
    navigate("/");
    return true;
  }
  return false;
}
