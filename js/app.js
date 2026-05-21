import { getProducts } from "./api.js";
import { renderHeader } from "./ui.js";
import { toKZT, normalizeCategory } from "./utils.js";

renderHeader();

const grid = document.getElementById("productsGrid");
const statusText = document.getElementById("statusText");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortSelect = document.getElementById("sortSelect");

let products = [];

function renderProducts() {
  const search = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const sort = sortSelect.value;

  let filtered = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(search);
    const matchesCategory = category === "all" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  if (sort === "price-asc") filtered.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") filtered.sort((a, b) => b.price - a.price);
  if (sort === "title-asc") filtered.sort((a, b) => a.title.localeCompare(b.title, "ru"));

  grid.innerHTML = filtered.map(product => `
    <article class="product-card">
      <a href="product.html?id=${product.id}" class="product-img">
        <img src="${product.image}" alt="${product.title}">
      </a>
      <div class="product-body">
        <h3 class="product-title">${product.title}</h3>
        <p class="price">${toKZT(product.price)}</p>
        <a class="btn btn-outline" href="product.html?id=${product.id}">Подробнее</a>
      </div>
    </article>
  `).join("");

  statusText.textContent = filtered.length ? "" : "Товары не найдены";
}

function fillCategories() {
  const categories = [...new Set(products.map(product => product.category))];

  categoryFilter.innerHTML += categories.map(category => `
    <option value="${category}">${normalizeCategory(category)}</option>
  `).join("");
}

async function init() {
  try {
    products = await getProducts();
    fillCategories();
    renderProducts();
  } catch (error) {
    statusText.textContent = error.message;
  }
}

searchInput.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);
sortSelect.addEventListener("change", renderProducts);

init();
