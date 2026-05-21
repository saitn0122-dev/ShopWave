import { Product } from "./models.js";
import { translations, extraProducts } from "./data.js";

const API_URL = "https://fakestoreapi.com/products";

function translateProduct(product) {
  const translated = translations[product.id];

  return new Product({
    ...product,
    title: translated ? translated[0] : product.title,
    description: translated ? translated[1] : product.description
  });
}

export async function getProducts() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Не удалось загрузить товары");

  const data = await response.json();
  const apiProducts = data.map(item => translateProduct(item));
  const localProducts = extraProducts.map(item => new Product(item));

  return [...apiProducts, ...localProducts];
}

export async function getProductById(id) {
  const allProducts = await getProducts();
  const product = allProducts.find(item => item.id === Number(id));
  if (!product) throw new Error("Товар не найден");
  return product;
}
