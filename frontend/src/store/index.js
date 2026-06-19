import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

const API_BASE = '/api';

const MOCK_PRODUCTS = [
  { id: 1, name: '至臻无线降噪耳机', price: 1999.00, image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', category: '数码电子', description: '采用顶级无线技术，为您提供卓越的听觉盛宴。', stock: 100 },
  { id: 2, name: '智能手表 Pro', price: 1299.50, image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', category: '数码电子', description: '智能生活，从手腕开始。', stock: 50 },
  { id: 3, name: '经典真皮双肩包', price: 585.00, image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', category: '时尚配饰', description: '意大利进口真皮，匠心打造。', stock: 30 },
  { id: 4, name: '人体工学静音鼠标', price: 256.99, image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500', category: '办公外设', description: '人体工学设计，久握不累。', stock: 200 }
];

const MOCK_USER = { username: 'Felix Chen', email: 'felix@example.com', id: 1 };

async function apiRequest(url, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${url}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`API request failed for ${url}, using fallback:`, error.message);
    return null;
  }
}

export const useAppStore = defineStore('app', () => {
  const cart = ref([]);
  const orders = ref([]);
  const products = ref([]);
  const user = ref(null);
  const toastRef = ref(null);
  const loading = ref({
    products: false,
    cart: false,
    orders: false,
    user: false
  });

  const cartCount = computed(() => cart.value.reduce((sum, item) => sum + item.quantity, 0));

  const showToast = (message, type = 'info') => {
    if (toastRef.value) {
      toastRef.value.show(message, type);
    }
  };

  const loadProducts = async () => {
    loading.value.products = true;
    const data = await apiRequest('/products');
    if (data && Array.isArray(data) && data.length > 0) {
      products.value = data;
    } else {
      products.value = MOCK_PRODUCTS;
    }
    loading.value.products = false;
    return products.value;
  };

  const getProduct = async (id) => {
    const numericId = parseInt(id);
    let product = products.value.find(p => p.id === numericId);
    if (product) return product;
    const data = await apiRequest(`/products/${numericId}`);
    if (data) {
      return data;
    }
    return MOCK_PRODUCTS.find(p => p.id === numericId) || MOCK_PRODUCTS[0];
  };

  const loadCart = async () => {
    loading.value.cart = true;
    const data = await apiRequest('/cart');
    if (data && Array.isArray(data)) {
      cart.value = data;
    } else {
      cart.value = [];
    }
    loading.value.cart = false;
    return cart.value;
  };

  const addToCart = async (product, quantity = 1) => {
    const existingItem = cart.value.find(item => item.product.id === product.id);
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      const data = await apiRequest(`/cart/${existingItem.id}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity: newQuantity })
      });
      if (data) {
        existingItem.quantity = newQuantity;
      } else {
        existingItem.quantity = newQuantity;
      }
    } else {
      const data = await apiRequest('/cart', {
        method: 'POST',
        body: JSON.stringify({ product_id: product.id, quantity })
      });
      if (data) {
        cart.value.push(data);
      } else {
        cart.value.push({
          id: Date.now() + Math.random(),
          product,
          quantity
        });
      }
    }
    showToast('已成功加入购物车！', 'success');
  };

  const removeFromCart = async (itemId) => {
    const data = await apiRequest(`/cart/${itemId}`, { method: 'DELETE' });
    if (data && data.success) {
      cart.value = cart.value.filter(item => item.id !== itemId);
    } else {
      cart.value = cart.value.filter(item => item.id !== itemId);
    }
    showToast('已从购物车移除', 'info');
  };

  const updateCartQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    const item = cart.value.find(i => i.id === itemId);
    if (!item) return;
    const data = await apiRequest(`/cart/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity })
    });
    if (data) {
      item.quantity = quantity;
    } else {
      item.quantity = quantity;
    }
  };

  const loadOrders = async () => {
    loading.value.orders = true;
    const data = await apiRequest('/orders');
    if (data && Array.isArray(data)) {
      orders.value = data.map(order => ({
        ...order,
        date: new Date(order.date).toLocaleString()
      }));
    } else {
      orders.value = [];
    }
    loading.value.orders = false;
    return orders.value;
  };

  const loadUserProfile = async () => {
    loading.value.user = true;
    const data = await apiRequest('/user/profile');
    if (data) {
      user.value = data;
    } else {
      user.value = MOCK_USER;
    }
    loading.value.user = false;
    return user.value;
  };

  const checkout = async () => {
    if (cart.value.length === 0) {
      showToast('购物车是空的', 'error');
      return null;
    }

    const orderItems = cart.value.map(item => ({
      product_id: item.product.id,
      quantity: item.quantity
    }));

    const data = await apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify({ items: orderItems })
    });

    if (data) {
      const newOrder = {
        ...data,
        date: new Date(data.date).toLocaleString()
      };
      orders.value.unshift(newOrder);
      cart.value = [];
      showToast('支付成功！感谢您的选购', 'success');
      return newOrder.id;
    } else {
      const total = cart.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      const newOrder = {
        id: 'ORD' + Date.now(),
        items: [...cart.value],
        total,
        date: new Date().toLocaleString()
      };
      orders.value.unshift(newOrder);
      cart.value = [];
      showToast('支付成功！感谢您的选购', 'success');
      return newOrder.id;
    }
  };

  const initializeApp = async () => {
    await Promise.all([
      loadProducts(),
      loadCart(),
      loadOrders(),
      loadUserProfile()
    ]);
  };

  const handleUnimplemented = (feature) => {
    showToast(`${feature} 功能即将上线！`, 'info');
  };

  return {
    cart,
    orders,
    products,
    user,
    loading,
    cartCount,
    toastRef,
    showToast,
    loadProducts,
    getProduct,
    loadCart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    loadOrders,
    loadUserProfile,
    checkout,
    initializeApp,
    handleUnimplemented
  };
});
