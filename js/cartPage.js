import { Cart } from "./models.js";
import { renderHeader, updateCartBadges } from "./ui.js";
import { toKZT } from "./utils.js";

renderHeader();

const container = document.getElementById("cartContainer");
const checkoutBtn = document.getElementById("checkoutBtn");

function renderCart() {
  const cart = Cart.load();
  updateCartBadges(cart.getCount());

  if (cart.items.length === 0) {
    container.innerHTML = `<p class="status-text">Корзина пуста. Добавьте товары из каталога.</p>`;
    checkoutBtn.disabled = true;
    return;
  }

  checkoutBtn.disabled = false;

  container.innerHTML = `
    <table class="cart-table">
      <thead>
        <tr>
          <th>Товар</th>
          <th>Цена</th>
          <th>Количество</th>
          <th>Сумма</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${cart.items.map(item => `
          <tr>
            <td>
              <div class="cart-product">
                <img src="${item.product.image}" alt="${item.product.title}">
                <span>${item.product.title}</span>
              </div>
            </td>
            <td>${toKZT(item.product.price)}</td>
            <td>
              <div class="qty-control">
                <button data-action="minus" data-id="${item.product.id}">−</button>
                <span>${item.quantity}</span>
                <button data-action="plus" data-id="${item.product.id}">+</button>
              </div>
            </td>
            <td><strong>${toKZT(item.product.price * item.quantity)}</strong></td>
            <td>
              <button class="btn btn-danger" data-action="remove" data-id="${item.product.id}">🗑</button>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>

    <div class="total-row">
      <span>Итого:</span>
      <span>${toKZT(cart.getTotal())}</span>
    </div>
  `;

  container.querySelectorAll("[data-action]").forEach(button => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      const id = button.dataset.id;
      const currentCart = Cart.load();

      if (action === "plus") currentCart.changeQuantity(id, 1);
      if (action === "minus") currentCart.changeQuantity(id, -1);
      if (action === "remove") currentCart.remove(id);

      renderCart();
    });
  });
}

checkoutBtn.addEventListener("click", () => {
  const cart = Cart.load();

  if (cart.items.length === 0) {
    alert("Корзина пуста");
    return;
  }

  alert("Заказ оформлен");
  cart.clear();
  renderCart();
});

renderCart();
