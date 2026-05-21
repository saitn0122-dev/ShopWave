import { USD_TO_KZT, categoryNames } from "./data.js";

export function toKZT(usdPrice) {
  const value = Math.round(Number(usdPrice) * USD_TO_KZT);
  return new Intl.NumberFormat("ru-KZ", {
    style: "currency",
    currency: "KZT",
    maximumFractionDigits: 0
  }).format(value);
}

export function normalizeCategory(category) {
  return categoryNames[category] || category;
}
