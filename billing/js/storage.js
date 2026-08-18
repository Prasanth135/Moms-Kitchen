const STORAGE_KEYS = {
  MENU: 'restaurant_menu',
  SALES: 'restaurant_sales',
  CONFIG: 'restaurant_config'
};

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function upgradeMenuImages(menu) {
  return menu.map((item) => {
    const defaultImage = DEFAULT_IMAGE_MAP[item.id];
    if (defaultImage && item.image && item.image.endsWith('.svg')) {
      return { ...item, image: defaultImage };
    }
    return item;
  });
}

function getMenu() {
  const data = localStorage.getItem(STORAGE_KEYS.MENU);
  if (!data) {
    saveMenu(DEFAULT_MENU);
    return [...DEFAULT_MENU];
  }
  const menu = upgradeMenuImages(JSON.parse(data));
  saveMenu(menu);
  return menu;
}

function saveMenu(menu) {
  localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menu));
}

function getSales() {
  const data = localStorage.getItem(STORAGE_KEYS.SALES);
  return data ? JSON.parse(data) : [];
}

function addSale(sale) {
  const sales = getSales();
  sales.push(sale);
  localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
}

function getConfig() {
  const data = localStorage.getItem(STORAGE_KEYS.CONFIG);
  if (!data) {
    saveConfig(DEFAULT_CONFIG);
    return { ...DEFAULT_CONFIG };
  }
  return JSON.parse(data);
}

function saveConfig(config) {
  localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
}
