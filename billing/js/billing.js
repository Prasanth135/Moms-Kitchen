let qrCodeInstance = null;

function buildUpiUrl(config, amount) {
  return (
    `upi://pay?pa=${encodeURIComponent(config.upiVpa)}` +
    `&pn=${encodeURIComponent(config.restaurantName)}` +
    `&am=${amount.toFixed(2)}` +
    `&cu=INR` +
    `&tn=${encodeURIComponent('Order at ' + config.restaurantName)}`
  );
}

function openPayModal() {
  if (cart.length === 0) return;

  const modal = document.getElementById('pay-modal');
  const config = getConfig();
  const total = getCartTotal();

  document.getElementById('modal-total').textContent = `₹${total}`;
  document.getElementById('modal-restaurant').textContent = config.restaurantName;
  document.getElementById('modal-vpa').textContent = config.upiVpa;

  const modalItems = document.getElementById('modal-items');
  modalItems.innerHTML = cart
    .map((item) => `<div class="modal-item-row"><span>${item.name} × ${item.qty}</span><span>₹${item.price * item.qty}</span></div>`)
    .join('');

  const qrContainer = document.getElementById('qr-code');
  qrContainer.innerHTML = '';

  const upiUrl = buildUpiUrl(config, total);

  if (typeof QRCode !== 'undefined') {
    qrCodeInstance = new QRCode(qrContainer, {
      text: upiUrl,
      width: 180,
      height: 180,
      colorDark: '#1a1a1a',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M
    });
  }

  modal.classList.remove('hidden');
}

function closePayModal() {
  const modal = document.getElementById('pay-modal');
  modal.classList.add('hidden');
  const qrContainer = document.getElementById('qr-code');
  qrContainer.innerHTML = '';
  qrCodeInstance = null;
}

function confirmPayment() {
  if (cart.length === 0) return;

  const sale = {
    id: generateId(),
    date: new Date().toISOString(),
    items: cart.map((item) => ({ name: item.name, price: item.price, qty: item.qty })),
    total: getCartTotal(),
    paidAt: new Date().toISOString()
  };

  addSale(sale);
  clearCart();
  closePayModal();
  alert('Payment recorded successfully!');

  if (document.getElementById('reports-tab').classList.contains('active')) {
    renderSalesReport();
  }
}

function printBill() {
  if (cart.length === 0) return;
  renderReceipt();
  window.print();
}

function initBilling() {
  document.getElementById('pay-now-btn').addEventListener('click', openPayModal);
  document.getElementById('print-bill-btn').addEventListener('click', printBill);
  document.getElementById('clear-cart-btn').addEventListener('click', () => {
    if (cart.length === 0) return;
    if (confirm('Clear all items from the cart?')) clearCart();
  });
  document.getElementById('close-modal-btn').addEventListener('click', closePayModal);
  document.getElementById('confirm-payment-btn').addEventListener('click', confirmPayment);

  document.getElementById('pay-modal').addEventListener('click', (e) => {
    if (e.target.id === 'pay-modal') closePayModal();
  });
}
