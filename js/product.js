import { getProductById } from "./api.js";
import { Cart } from "./models.js";
import { renderHeader, updateCartBadges } from "./ui.js";
import { toKZT, normalizeCategory } from "./utils.js";

renderHeader();

const productDetails = document.getElementById("productDetails");
const crumbTitle = document.getElementById("crumbTitle");
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function init() {
  if (!id) {
    productDetails.innerHTML = `<p class="status-text">ID товара не найден</p>`;
    return;
  }

  try {
    const product = await getProductById(id);
    crumbTitle.textContent = product.title;

    productDetails.innerHTML = `
      <div class="details-image">
        <img src="${product.image}" alt="${product.title}">
      </div>
      <div class="details-info">
        <p class="eyebrow dark">${normalizeCategory(product.category)}</p>
        <h1>${product.title}</h1>
        <p class="price">${toKZT(product.price)}</p>
        <p class="availability">● В наличии</p>

        <h3>Описание</h3>
        <p class="description">${product.description}</p>

        <p><strong>Категория:</strong> ${normalizeCategory(product.category)}</p>

        <div class="details-actions">
          <button id="addToCartBtn" class="btn btn-primary">🛒 Добавить в корзину</button>
          <a href="index.html#catalog" class="btn btn-outline">← В каталог</a>
          <a href="cart.html" class="btn btn-outline">🛒 В корзину</a>
        </div>
      </div>
    `;

    document.getElementById("addToCartBtn").addEventListener("click", () => {
      const cart = Cart.load();
      cart.add(product);
      updateCartBadges(cart.getCount());
      alert("Товар добавлен в корзину");
    });
  } catch (error) {
    productDetails.innerHTML = `<p class="status-text">${error.message}</p>`;
  }
}

init();
