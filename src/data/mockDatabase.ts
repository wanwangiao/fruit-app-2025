// src/data/mockDatabase.ts

const STORAGE_KEY = 'fruitDeliveryMockDB';

// 初始資料
const defaultCategories = [
  { id: 1, name: '蔬菜類', sortOrder: 1 },
  { id: 2, name: '水果類', sortOrder: 2 },
  { id: 3, name: '肉品', sortOrder: 3 },
  { id: 4, name: '海鮮', sortOrder: 4 },
  { id: 5, name: '丸類', sortOrder: 5 },
  { id: 6, name: '火鍋料', sortOrder: 6 },
];

const defaultProducts = [
  { id: 1, name: '高麗菜', category: '蔬菜類', price: 50, isPriceByWeight: true, imageUrl: 'https://via.placeholder.com/80?text=高麗菜', description: '新鮮高麗菜', stock: 100, options: [] },
  { id: 2, name: '蘋果', category: '水果類', price: 80, isPriceByWeight: false, imageUrl: 'https://via.placeholder.com/80?text=蘋果', description: '香甜蘋果', stock: 50, options: [] },
  { id: 3, name: '豬五花', category: '肉品', price: 120, isPriceByWeight: false, imageUrl: 'https://via.placeholder.com/80?text=豬五花', description: '美味豬五花', stock: 30, options: [] },
  { id: 4, name: '鮭魚片', category: '海鮮', price: 250, isPriceByWeight: false, imageUrl: 'https://via.placeholder.com/80?text=鮭魚片', description: '新鮮鮭魚片', stock: 20, options: [] },
  { id: 5, name: '香菇貢丸', category: '丸類', price: 90, isPriceByWeight: false, imageUrl: 'https://via.placeholder.com/80?text=貢丸', description: 'Q彈香菇貢丸', stock: 80, options: [] },
  { id: 6, name: '金針菇', category: '蔬菜類', price: 30, isPriceByWeight: false, imageUrl: 'https://via.placeholder.com/80?text=金針菇', description: '火鍋必備金針菇', stock: 120, options: [] },
  { id: 7, name: '珍珠奶茶', category: '飲料', price: 60, isPriceByWeight: false, imageUrl: 'https://via.placeholder.com/80?text=珍奶', description: '經典珍珠奶茶', stock: 999, 
    options: [
      { groupName: '甜度', type: 'single', required: true, values: ['無糖', '微糖', '半糖', '正常糖'] },
      { groupName: '冰塊', type: 'single', required: true, values: ['去冰', '微冰', '少冰', '正常冰'] },
      { groupName: '加料', type: 'multiple', required: false, values: ['珍珠', '椰果', '布丁'] },
    ]
  },
];

const defaultInventory = [
  { 
    id: 1, 
    name: '高麗菜', 
    minStock: 50, 
    batches: [
      { quantity: 80, unitCost: 25, purchaseDate: '2025-08-01' },
      { quantity: 20, unitCost: 30, purchaseDate: '2025-08-05' },
      { quantity: 10, unitCost: 28, purchaseDate: '2025-08-07' },
    ]
  },
  { 
    id: 2, 
    name: '蘋果', 
    minStock: 30, 
    batches: [
      { quantity: 50, unitCost: 60, purchaseDate: '2025-08-02' },
      { quantity: 15, unitCost: 62, purchaseDate: '2025-08-06' },
    ]
  },
  { 
    id: 3, 
    name: '豬五花', 
    minStock: 20, 
    batches: [
      { quantity: 30, unitCost: 90, purchaseDate: '2025-08-03' },
    ]
  },
  { 
    id: 4, 
    name: '鮭魚片', 
    minStock: 10, 
    batches: [
      { quantity: 15, unitCost: 200, purchaseDate: '2025-08-04' },
    ]
  },
  { 
    id: 5, 
    name: '香菇貢丸', 
    minStock: 40, 
    batches: [
      { quantity: 80, unitCost: 70, purchaseDate: '2025-08-01' },
    ]
  },
  { 
    id: 6, 
    name: '金針菇', 
    minStock: 60, 
    batches: [
      { quantity: 120, unitCost: 20, purchaseDate: '2025-08-02' },
    ]
  },
];

const defaultOrders = [
  {
    id: 1,
    customerName: '王小明',
    customerPhone: '0912345678',
    deliveryAddress: '台北市信義區市府路1號',
    totalAmount: 350,
    status: '待處理',
    orderDate: '2025-08-08 10:30',
    items: [
      { productId: 1, name: '高麗菜', quantity: 1, unitPrice: 50, options: [], isPriceByWeight: false },
      { productId: 2, name: '蘋果', quantity: 2, unitPrice: 80, options: [], isPriceByWeight: false },
      { productId: 5, name: '香菇貢丸', quantity: 1, unitPrice: 90, options: [], isPriceByWeight: false },
    ],
  },
  {
    id: 2,
    customerName: '陳大華',
    customerPhone: '0922334455',
    deliveryAddress: '新北市板橋區縣民大道二段7號',
    totalAmount: 200,
    status: '已確認',
    orderDate: '2025-08-08 11:00',
    items: [
      { productId: 7, name: '青江菜', quantity: 3, unitPrice: 40, options: [], isPriceByWeight: false },
      { productId: 8, name: '香蕉', quantity: 1, unitPrice: 60, options: [], isPriceByWeight: false },
    ],
  },
  {
    id: 3,
    customerName: '林美玲',
    customerPhone: '0933445566',
    deliveryAddress: '桃園市中壢區中正路100號',
    totalAmount: 120, // 修正：初始總金額應該是豬五花的價格
    status: '待處理',
    orderDate: '2025-08-08 12:15',
    items: [
      { productId: 1, name: '高麗菜', quantity: 1, unitPrice: 0, options: [], isPriceByWeight: true }, // 時價商品
      { productId: 3, name: '豬五花', quantity: 1, unitPrice: 120, options: [], isPriceByWeight: false },
    ],
  },
  // 新增一筆包含時價高麗菜的訂單，用於測試
  {
    id: 4,
    customerName: '張小華',
    customerPhone: '0987654321',
    deliveryAddress: '台中市西屯區台灣大道三段',
    totalAmount: 80, // 初始為蘋果的價格
    status: '待處理',
    orderDate: '2025-08-09 09:00',
    items: [
      { productId: 1, name: '高麗菜', quantity: 2, unitPrice: 0, options: [], isPriceByWeight: true }, // 時價高麗菜
      { productId: 2, name: '蘋果', quantity: 1, unitPrice: 80, options: [], isPriceByWeight: false },
    ],
  },
];

// 從 localStorage 載入資料，如果沒有則使用預設資料
let currentDB: { categories: any[]; products: any[]; inventory: any[]; orders: any[]; };

if (typeof window !== 'undefined') { // 確保在瀏覽器環境才執行
  const savedDB = localStorage.getItem(STORAGE_KEY);
  if (savedDB) {
    try {
      currentDB = JSON.parse(savedDB);
      console.log('Loaded DB from localStorage:', currentDB);
    } catch (e) {
      console.error('Error parsing localStorage DB, using default:', e);
      currentDB = {
        categories: defaultCategories,
        products: defaultProducts,
        inventory: defaultInventory,
        orders: defaultOrders,
      };
    }
  } else {
    console.log('No DB found in localStorage, using default.');
    currentDB = {
      categories: defaultCategories,
      products: defaultProducts,
      inventory: defaultInventory,
      orders: defaultOrders,
    };
  }
} else {
  // 伺服器端渲染時使用預設值
  currentDB = {
    categories: defaultCategories,
    products: defaultProducts,
    inventory: defaultInventory,
    orders: defaultOrders,
  };
}

// 將資料儲存到 localStorage
const saveDB = () => {
  if (typeof window !== 'undefined') { // 確保在瀏覽器環境才執行
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentDB));
      console.log('Saving DB to localStorage:', currentDB);
    } catch (e) {
      console.error('Error saving DB to localStorage:', e);
    }
  }
};

// --- 分類操作 --- //
export const getCategories = () => [...currentDB.categories];

export const addCategory = (name: string) => {
  const newId = Math.max(...currentDB.categories.map(c => c.id), 0) + 1;
  const newCategory = { id: newId, name, sortOrder: currentDB.categories.length + 1 };
  currentDB.categories.push(newCategory);
  saveDB();
  return newCategory;
};

export const updateCategoryOrder = (newOrder: any[]) => {
  currentDB.categories = newOrder.map((c, index) => ({ ...c, sortOrder: index + 1 }));
  saveDB();
};

export const deleteCategory = (id: number) => {
  currentDB.categories = currentDB.categories.filter(c => c.id !== id);
  saveDB();
};

// --- 商品操作 --- //
export const getProducts = () => [...currentDB.products];

export const addProduct = (product: any) => {
  const newId = Math.max(...currentDB.products.map(p => p.id), 0) + 1;
  const newProduct = { ...product, id: newId };
  currentDB.products.push(newProduct);
  saveDB();
  return newProduct;
};

export const updateProduct = (updatedProduct: any) => {
  currentDB.products = currentDB.products.map(p => (p.id === updatedProduct.id ? updatedProduct : p));
  saveDB();
};

export const deleteProduct = (id: number) => {
  currentDB.products = currentDB.products.filter(p => p.id !== id);
  saveDB();
};

// --- 庫存操作 --- //
export const getInventory = () => [...currentDB.inventory];

export const updateInventoryBatches = (productId: number, newBatches: any[]) => {
  currentDB.inventory = currentDB.inventory.map(item => 
    item.id === productId ? { ...item, batches: newBatches } : item
  );
  saveDB();
};

export const getProductInventory = (productId: number) => {
  return currentDB.inventory.find(item => item.id === productId);
};

// --- 訂單操作 --- //
export const getOrders = () => [...currentDB.orders];

export const updateOrderStatus = (orderId: number, newStatus: string) => {
  currentDB.orders = currentDB.orders.map(order => 
    order.id === orderId ? { ...order, status: newStatus } : order
  );
  saveDB();
};

export const updateOrder = (updatedOrder: any) => {
  currentDB.orders = currentDB.orders.map(order => (order.id === updatedOrder.id ? updatedOrder : order));
  saveDB();
};

// --- 前端首頁商品數據 --- //
export const getFrontendProducts = () => {
  // 根據後台分類排序和商品數據來組裝前端顯示的數據
  const sortedCategories = [...currentDB.categories].sort((a, b) => a.sortOrder - b.sortOrder);
  
  return sortedCategories.map(cat => ({
    categoryName: cat.name,
    sortOrder: cat.sortOrder,
    products: currentDB.products.filter(p => p.category === cat.name).map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      imageUrl: p.imageUrl,
      isPriceByWeight: p.isPriceByWeight, // 新增：傳遞 isPriceByWeight
      // 這裡可以根據需要添加更多前端需要的商品屬性
    }))
  }));
};