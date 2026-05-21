export class User {
  constructor(email, password, name = "Пользователь") {
    this.email = email;
    this.password = password;
    this.name = name;
  }
}

export class Product {
  constructor({ id, title, price, description, image, category }) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.description = description;
    this.image = image;
    this.category = category;
  }
}

export class CartItem {
  constructor(product, quantity = 1) {
    this.product = product;
    this.quantity = quantity;
  }
}

export class Cart {
  constructor(items = []) {
    this.items = items.map(item => new CartItem(item.product, item.quantity));
  }

  add(product) {
    const existing = this.items.find(item => item.product.id === product.id);
    if (existing) existing.quantity += 1;
    else this.items.push(new CartItem(product, 1));
    this.save();
  }

  remove(productId) {
    this.items = this.items.filter(item => item.product.id !== Number(productId));
    this.save();
  }

  changeQuantity(productId, delta) {
    const item = this.items.find(item => item.product.id === Number(productId));
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) this.remove(productId);
    else this.save();
  }

  getCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  getTotal() {
    return this.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  clear() {
    this.items = [];
    this.save();
  }

  save() {
    localStorage.setItem("shopwave_cart", JSON.stringify(this.items));
  }

  static load() {
    const raw = localStorage.getItem("shopwave_cart");
    return new Cart(raw ? JSON.parse(raw) : []);
  }
}
