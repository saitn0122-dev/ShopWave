import { Cart } from "./models.js";

export function renderHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const cart = Cart.load();
  const currentUser = JSON.parse(localStorage.getItem("shopwave_current_user") || "null");

  header.innerHTML = `
    <div class="header-inner">
      <a href="index.html" class="logo">
        <img src="assets/logo-icon.png" alt="ShopWave">
        <span>ShopWave</span>
      </a>

      <nav class="nav">
        <a href="index.html">Главная</a>
        <a href="index.html#catalog">Каталог</a>
        ${
          currentUser
            ? `<span class="user-greeting">Привет, ${currentUser.name}</span>
               <button class="logout-btn" id="logoutBtn">Выйти</button>`
            : `<a href="auth.html">Вход/Регистрация</a>`
        }
      </nav>
    </div>
  `;

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("shopwave_current_user");
      window.location.href = "index.html";
    });
  }

  updateCartBadges(cart.getCount());
}

export function updateCartBadges(count = Cart.load().getCount()) {
  document.querySelectorAll(".floating-count").forEach(item => {
    item.textContent = count;
  });
}
