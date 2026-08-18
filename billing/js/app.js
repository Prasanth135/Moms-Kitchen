function switchTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });

  document.querySelectorAll('.tab-panel').forEach((panel) => {
    panel.classList.toggle('active', panel.id === tabId);
  });

  if (tabId === 'reports-tab') {
    renderSalesReport();
  }
}

function initApp() {
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  initMenuForm();
  initBilling();
  initSalesReport();

  renderMenuGrid();
  renderMenuTable();
  renderCart();
}

document.addEventListener('DOMContentLoaded', initApp);
