function getSalesForMonth(year, month) {
  const sales = getSales();
  return sales.filter((sale) => {
    const d = new Date(sale.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });
}

function getTopItem(sales) {
  const counts = {};
  sales.forEach((sale) => {
    sale.items.forEach((item) => {
      counts[item.name] = (counts[item.name] || 0) + item.qty;
    });
  });

  let topName = '—';
  let topCount = 0;
  for (const [name, count] of Object.entries(counts)) {
    if (count > topCount) {
      topCount = count;
      topName = name;
    }
  }
  return topCount > 0 ? `${topName} (${topCount})` : '—';
}

function renderSalesReport() {
  const monthInput = document.getElementById('report-month');
  if (!monthInput) return;

  const [year, month] = monthInput.value.split('-').map(Number);
  const monthSales = getSalesForMonth(year, month - 1);

  const totalRevenue = monthSales.reduce((sum, s) => sum + s.total, 0);
  const orderCount = monthSales.length;
  const topItem = getTopItem(monthSales);

  document.getElementById('stat-revenue').textContent = `₹${totalRevenue}`;
  document.getElementById('stat-orders').textContent = orderCount;
  document.getElementById('stat-top-item').textContent = topItem;

  const tbody = document.getElementById('sales-table-body');
  const emptyState = document.getElementById('sales-empty');

  if (monthSales.length === 0) {
    tbody.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  tbody.innerHTML = monthSales
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map((sale) => {
      const itemsSummary = sale.items.map((i) => `${i.name}×${i.qty}`).join(', ');
      const dateStr = new Date(sale.date).toLocaleString('en-IN');
      return `
      <tr>
        <td>${dateStr}</td>
        <td>${itemsSummary}</td>
        <td>₹${sale.total}</td>
      </tr>`;
    })
    .join('');
}

function initSalesReport() {
  const monthInput = document.getElementById('report-month');
  const now = new Date();
  monthInput.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  monthInput.addEventListener('change', renderSalesReport);
}
