import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

async function request(url, options = {}) {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

export const useAppStore = defineStore('app', () => {
    const cart = ref([]);
    const orders = ref([]);
    const products = ref([]);
    const user = ref(null);
    const toastRef = ref(null);
    const initialized = ref(false);

    const cartCount = computed(() => cart.value.reduce((sum, item) => sum + item.quantity, 0));

    const showToast = (message, type = 'info') => {
        if (toastRef.value) {
            toastRef.value.show(message, type);
        }
    };

    async function initApp() {
        if (initialized.value) return;
        initialized.value = true;
        try {
            await Promise.all([
                fetchProducts(),
                fetchCart(),
                fetchOrders(),
                fetchProfile()
            ]);
        } catch (e) {
            console.warn('Init failed, using defaults:', e);
        }
    }

    async function fetchProducts() {
        try {
            products.value = await request('/products');
        } catch (e) {
            products.value = [
                { id: 1, name: '至臻无线降噪耳机', price: 1999.00, image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', category: '数码电子' },
                { id: 2, name: '智能手表 Pro', price: 1299.50, image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', category: '数码电子' },
                { id: 3, name: '经典真皮双肩包', price: 585.00, image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', category: '时尚配饰' },
                { id: 4, name: '人体工学静音鼠标', price: 256.99, image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500', category: '办公外设' }
            ];
        }
        return products.value;
    }

    async function fetchProduct(id) {
        try {
            return await request(`/products/${id}`);
        } catch (e) {
            return {
                id,
                name: '至臻无线降噪耳机',
                price: 1999.00,
                image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
                category: '数码电子',
                description: '采用顶级无线技术，为您提供卓越的听觉盛宴。'
            };
        }
    }

    async function fetchCart() {
        try {
            cart.value = await request('/cart');
        } catch (e) {
            cart.value = [];
        }
        return cart.value;
    }

    async function fetchOrders() {
        try {
            orders.value = await request('/orders');
        } catch (e) {
            orders.value = [];
        }
        return orders.value;
    }

    async function fetchProfile() {
        try {
            user.value = await request('/user/profile');
        } catch (e) {
            user.value = { username: 'Felix Chen', email: 'felix@example.com' };
        }
        return user.value;
    }

    async function addToCart(product, quantity = 1) {
        try {
            const existing = cart.value.find(item => item.product.id === product.id);
            if (existing) {
                const updated = await request(`/cart/${existing.id}`, {
                    method: 'PUT',
                    body: JSON.stringify({ quantity: existing.quantity + quantity })
                });
                const idx = cart.value.findIndex(i => i.id === existing.id);
                cart.value[idx] = updated;
            } else {
                const newItem = await request('/cart', {
                    method: 'POST',
                    body: JSON.stringify({ product_id: product.id, quantity })
                });
                newItem.product = product;
                cart.value.push(newItem);
            }
            showToast('已成功加入购物车！', 'success');
        } catch (e) {
            console.error('Add to cart failed:', e);
            showToast('加入购物车失败', 'error');
        }
    }

    async function updateCartItemQuantity(itemId, quantity) {
        try {
            const updated = await request(`/cart/${itemId}`, {
                method: 'PUT',
                body: JSON.stringify({ quantity })
            });
            const idx = cart.value.findIndex(i => i.id === itemId);
            if (idx !== -1) {
                updated.product = cart.value[idx].product;
                cart.value[idx] = updated;
            }
        } catch (e) {
            console.error('Update cart failed:', e);
        }
    }

    async function removeFromCart(itemId) {
        try {
            await request(`/cart/${itemId}`, { method: 'DELETE' });
            cart.value = cart.value.filter(item => item.id !== itemId);
            showToast('已从购物车移除', 'info');
        } catch (e) {
            console.error('Remove from cart failed:', e);
            showToast('移除失败', 'error');
        }
    }

    async function checkout() {
        if (cart.value.length === 0) {
            showToast('购物车是空的', 'error');
            return null;
        }
        try {
            const items = cart.value.map(item => ({
                product_id: item.product.id,
                quantity: item.quantity
            }));
            const newOrder = await request('/orders', {
                method: 'POST',
                body: JSON.stringify({ items })
            });
            cart.value = [];
            orders.value.unshift(newOrder);
            showToast('支付成功！感谢您的选购', 'success');
            return newOrder;
        } catch (e) {
            console.error('Checkout failed:', e);
            showToast('结算失败，请重试', 'error');
            return null;
        }
    }

    const handleUnimplemented = (feature) => {
        showToast(`${feature} 功能即将上线！`, 'info');
    };

    return {
        cart,
        orders,
        products,
        user,
        cartCount,
        toastRef,
        initialized,
        showToast,
        initApp,
        fetchProducts,
        fetchProduct,
        fetchCart,
        fetchOrders,
        fetchProfile,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        checkout,
        handleUnimplemented
    };
});
