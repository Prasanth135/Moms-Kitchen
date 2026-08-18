let cart = [];

function getCart() {
  return cart;
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function addToCart(menuItem) {
  const existing = cart.find((item) => item.id === menuItem.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      qty: 1
    });
  }
  renderCart();
}

function updateQuantity(id, delta) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter((i) => i.id !== id);
  }
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  renderCart();
}

function clearCart() {
  cart = [];
  renderCart();
}

function renderCart() {
  const cartItemsEl = document.getElementById('cart-items');
  const cartTotalEl = document.getElementById('cart-total');
  const payNowBtn = document.getElementById('pay-now-btn');
  const printBillBtn = document.getElementById('print-bill-btn');

  if (!cartItemsEl) return;

  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p class="empty-cart">Cart is empty. Click a menu item to add.</p>';
    cartTotalEl.textContent = '₹0';
    payNowBtn.disabled = true;
    printBillBtn.disabled = true;
    return;
  }

  payNowBtn.disabled = false;
  printBillBtn.disabled = false;

  cartItemsEl.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item" data-id="${item.id}">
      <div class="cart-item-info">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-price">₹${item.price * item.qty}</span>
      </div>
      <div class="cart-item-actions">
        <button class="qty-btn" data-action="decrease" data-id="${item.id}" aria-label="Decrease">−</button>
        <span class="qty-value">${item.qty}</span>
        <button class="qty-btn" data-action="increase" data-id="${item.id}" aria-label="Increase">+</button>
        <button class="remove-btn" data-id="${item.id}" aria-label="Remove">×</button>
      </div>
    </div>`
    )
    .join('');

  cartTotalEl.textContent = `₹${getCartTotal()}`;

  cartItemsEl.querySelectorAll('.qty-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const delta = btn.dataset.action === 'increase' ? 1 : -1;
      updateQuantity(id, delta);
    });
  });

  cartItemsEl.querySelectorAll('.remove-btn').forEach((btn) => {
    btn.addEventListener('click', () => removeFromCart(btn.dataset.id));
  });

  renderReceipt();
}

function renderReceipt() {
  const receiptItemsEl = document.getElementById('receipt-items');
  const receiptTotalEl = document.getElementById('receipt-total');
  const receiptDateEl = document.getElementById('receipt-date');
  const config = getConfig();

  if (!receiptItemsEl) return;

  document.getElementById('receipt-restaurant-name').textContent = config.restaurantName;
  receiptDateEl.textContent = new Date().toLocaleString('en-IN');

  if (cart.length === 0) {
    receiptItemsEl.innerHTML = '';
    receiptTotalEl.textContent = '₹0';
    return;
  }

  receiptItemsEl.innerHTML = cart
    .map(
      (item) => `
    <div class="receipt-row">
      <span>${item.name} × ${item.qty}</span>
      <span>₹${item.price * item.qty}</span>
    </div>`
    )
    .join('');

  receiptTotalEl.textContent = `₹${getCartTotal()}`;
}
