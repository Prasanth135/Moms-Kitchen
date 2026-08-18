let editingItemId = null;

function renderMenuGrid() {
  const grid = document.getElementById('menu-grid');
  if (!grid) return;

  const menu = getMenu();

  grid.innerHTML = menu
    .map(
      (item) => `
    <button class="menu-card" data-id="${item.id}" type="button">
      <img src="${item.image}" alt="${item.name}" class="menu-card-img" onerror="this.src='assets/images/placeholder.jpg'">
      <div class="menu-card-body">
        <h3 class="menu-card-name">${item.name}</h3>
        <span class="menu-card-price">₹${item.price}</span>
      </div>
    </button>`
    )
    .join('');

  grid.querySelectorAll('.menu-card').forEach((card) => {
    card.addEventListener('click', () => {
      const item = menu.find((m) => m.id === card.dataset.id);
      if (item) addToCart(item);
    });
  });
}

function renderMenuTable() {
  const tbody = document.getElementById('menu-table-body');
  if (!tbody) return;

  const menu = getMenu();

  tbody.innerHTML = menu
    .map(
      (item) => `
    <tr>
      <td><img src="${item.image}" alt="${item.name}" class="table-thumb" onerror="this.src='assets/images/placeholder.jpg'"></td>
      <td>${item.name}</td>
      <td>₹${item.price}</td>
      <td class="table-actions">
        <button class="btn btn-sm btn-secondary" data-action="edit" data-id="${item.id}">Edit</button>
        <button class="btn btn-sm btn-danger" data-action="delete" data-id="${item.id}">Delete</button>
      </td>
    </tr>`
    )
    .join('');

  tbody.querySelectorAll('[data-action="edit"]').forEach((btn) => {
    btn.addEventListener('click', () => openEditForm(btn.dataset.id));
  });

  tbody.querySelectorAll('[data-action="delete"]').forEach((btn) => {
    btn.addEventListener('click', () => deleteMenuItem(btn.dataset.id));
  });
}

function openAddForm() {
  editingItemId = null;
  document.getElementById('menu-form-title').textContent = 'Add Menu Item';
  document.getElementById('item-name').value = '';
  document.getElementById('item-price').value = '';
  document.getElementById('item-image-url').value = '';
  document.getElementById('item-image-file').value = '';
  document.getElementById('image-preview').src = 'assets/images/placeholder.jpg';
  document.getElementById('menu-form').classList.remove('hidden');
}

function openEditForm(id) {
  const item = getMenu().find((m) => m.id === id);
  if (!item) return;

  editingItemId = id;
  document.getElementById('menu-form-title').textContent = 'Edit Menu Item';
  document.getElementById('item-name').value = item.name;
  document.getElementById('item-price').value = item.price;
  document.getElementById('item-image-url').value = item.image.startsWith('data:') ? '' : item.image;
  document.getElementById('item-image-file').value = '';
  document.getElementById('image-preview').src = item.image;
  document.getElementById('menu-form').classList.remove('hidden');
}

function closeMenuForm() {
  editingItemId = null;
  document.getElementById('menu-form').classList.add('hidden');
}

function saveMenuItem(imageData) {
  const name = document.getElementById('item-name').value.trim();
  const price = parseFloat(document.getElementById('item-price').value);
  const imageUrl = document.getElementById('item-image-url').value.trim();

  if (!name || isNaN(price) || price < 0) {
    alert('Please enter a valid name and price.');
    return;
  }

  let image = imageData || imageUrl || 'assets/images/placeholder.jpg';

  const menu = getMenu();

  if (editingItemId) {
    const index = menu.findIndex((m) => m.id === editingItemId);
    if (index !== -1) {
      menu[index] = { ...menu[index], name, price, image };
    }
  } else {
    menu.push({
      id: generateId(),
      name,
      price,
      image
    });
  }

  saveMenu(menu);
  closeMenuForm();
  renderMenuGrid();
  renderMenuTable();
}

function deleteMenuItem(id) {
  const item = getMenu().find((m) => m.id === id);
  if (!item) return;

  if (!confirm(`Delete "${item.name}" from the menu?`)) return;

  const menu = getMenu().filter((m) => m.id !== id);
  saveMenu(menu);
  renderMenuGrid();
  renderMenuTable();
}

function initMenuForm() {
  document.getElementById('add-item-btn').addEventListener('click', openAddForm);
  document.getElementById('cancel-form-btn').addEventListener('click', closeMenuForm);

  document.getElementById('save-item-btn').addEventListener('click', () => {
    const fileInput = document.getElementById('item-image-file');
    if (fileInput.files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => saveMenuItem(e.target.result);
      reader.readAsDataURL(fileInput.files[0]);
    } else {
      saveMenuItem(null);
    }
  });

  document.getElementById('item-image-url').addEventListener('input', (e) => {
    const url = e.target.value.trim();
    if (url) document.getElementById('image-preview').src = url;
  });

  document.getElementById('item-image-file').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      document.getElementById('image-preview').src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });

  const config = getConfig();
  document.getElementById('upi-vpa').value = config.upiVpa;
  document.getElementById('restaurant-name').value = config.restaurantName;

  document.getElementById('save-config-btn').addEventListener('click', () => {
    const upiVpa = document.getElementById('upi-vpa').value.trim();
    const restaurantName = document.getElementById('restaurant-name').value.trim();
    const statusEl = document.getElementById('config-save-status');

    if (!upiVpa || !upiVpa.includes('@') || upiVpa.length < 5) {
      alert('Please enter a valid UPI VPA (e.g. yourshop@ybl or 9876543210@paytm).');
      return;
    }

    saveConfig({ upiVpa, restaurantName: restaurantName || 'Restaurant' });

    if (statusEl) {
      statusEl.textContent = `Payment settings saved. Customers will pay to ${upiVpa} via UPI QR.`;
      statusEl.classList.remove('hidden');
      setTimeout(() => statusEl.classList.add('hidden'), 5000);
    }
  });
}
