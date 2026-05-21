import { User } from "./models.js";
import { renderHeader } from "./ui.js";

renderHeader();

const tabs = document.querySelectorAll(".tab");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const loginMessage = document.getElementById("loginMessage");
const registerMessage = document.getElementById("registerMessage");

function getUsers() {
  return JSON.parse(localStorage.getItem("shopwave_users") || "[]");
}

function saveUsers(users) {
  localStorage.setItem("shopwave_users", JSON.stringify(users));
}

function setMessage(element, text, type) {
  element.textContent = text;
  element.className = `form-message ${type}`;
}

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(item => item.classList.remove("active"));
    tab.classList.add("active");

    const isLogin = tab.dataset.tab === "login";
    loginForm.classList.toggle("hidden", !isLogin);
    registerForm.classList.toggle("hidden", isLogin);
  });
});

registerForm.addEventListener("submit", event => {
  event.preventDefault();

  const form = new FormData(registerForm);
  const name = form.get("name").trim();
  const email = form.get("email").trim().toLowerCase();
  const password = form.get("password");
  const confirmPassword = form.get("confirmPassword");

  if (name.length < 2) {
    setMessage(registerMessage, "Имя должно содержать минимум 2 символа", "error");
    return;
  }

  if (password.length < 6) {
    setMessage(registerMessage, "Пароль должен содержать минимум 6 символов", "error");
    return;
  }

  if (password !== confirmPassword) {
    setMessage(registerMessage, "Пароли не совпадают", "error");
    return;
  }

  const users = getUsers();

  if (users.some(user => user.email === email)) {
    setMessage(registerMessage, "Пользователь с таким email уже существует", "error");
    return;
  }

  const user = new User(email, password, name);
  users.push(user);
  saveUsers(users);
  localStorage.setItem("shopwave_current_user", JSON.stringify(user));

  setMessage(registerMessage, "Регистрация прошла успешно", "success");
  setTimeout(() => window.location.href = "index.html", 700);
});

loginForm.addEventListener("submit", event => {
  event.preventDefault();

  const form = new FormData(loginForm);
  const email = form.get("email").trim().toLowerCase();
  const password = form.get("password");

  const users = getUsers();
  const user = users.find(item => item.email === email && item.password === password);

  if (!user) {
    setMessage(loginMessage, "Неверный email или пароль", "error");
    return;
  }

  localStorage.setItem("shopwave_current_user", JSON.stringify(user));
  setMessage(loginMessage, "Вход выполнен успешно", "success");
  setTimeout(() => window.location.href = "index.html", 700);
});
