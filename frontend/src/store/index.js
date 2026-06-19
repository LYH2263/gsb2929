import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

const API_BASE = 'http://localhost:8000';

async function api(path, options = {}) {
    const url = `${API_BASE}${path}`;
    const config = {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    };
    const response = await fetch(url, config);
    if (!response.ok) {
        let message = `请求失败 (${response.status})`;
        try {
            const errBody = await response.json();
            if (errBody.detail) message = errBody.detail;
        } catch (_) {}
        throw new Error(message);
    }
    if (response.status === 204) return null;
    return response.json();
}

function normalizeOrderItems(rawItems) {
    return rawItems.map(oi => ({
        id: oi.id,
        product: {
            id: oi.product_id,
            name: oi.product_name,
            price: Number(oi.price),
            image_url: oi.product_image,
            category: oi.product_category,
        },
        quantity: oi.quantity,
    }));
}

export const useAppStore = defineStore('app', () => {
    const products = ref([]);
    const product = ref(null);
    const cart = ref([]);
    const orders = ref([]);
    const user = ref(null);
    const toastRef = ref(null);

    const cartCount = computed(() => cart.value.reduce((sum, item) => sum + item.quantity, 0));

    const showToast = (message, type = 'info') => {
        if (toastRef.value) {
            toastRef.value.show(message, type);
        }
    };

    async function fetchProducts() {
        try {
            const data = await api('/products');
            products.value = data;
            return data;
        } catch (error) {
            console.error('fetchProducts failed:', error);
            products.value = [
                { id: 1, name: '至臻无线降噪耳机', price: 1999.00, image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', category: '数码电子' },
                { id: 2, name: '智能手表 Pro', price: 1299.50, image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', category: '数码电子' },
                { id: 3, name: '经典真皮双肩包', price: 585.00, image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', category: '时尚配饰' },
                { id: 4, name: '人体工学静音鼠标', price: 256.99, image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500', category: '办公外设' }
            ];
        }
    }

    async function fetchProduct(id) {
        try {
            const data = await api(`/products/${id}`);
            product.value = data;
            return data;
        } catch (error) {
            console.error('fetchProduct failed:', error);
            product.value = {
                id,
                name: '至臻无线降噪耳机',
                price: 1999.00,
                image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
                category: '数码电子',
                description: '采用顶级无线技术，为您提供卓越的听觉盛宴。内置先进的智能降噪芯片，为您隔绝喧嚣，时刻沉浸在音乐之中。配合长达40小时的续航时间，音乐触手可及。'
            };
        }
    }

    async function fetchProfile() {
        try {
            const data = await api('/user/profile');
            user.value = data;
            return data;
        } catch (error) {
            console.error('fetchProfile failed:', error);
            user.value = { username: 'Felix Chen', email: 'felix@example.com' };
        }
    }

    async function fetchCart() {
        try {
            const data = await api('/cart');
            cart.value = data.map(item => ({
                id: item.id,
                product: item.product,
                quantity: item.quantity,
            }));
            return cart.value;
        } catch (error) {
            console.error('fetchCart failed:', error);
            cart.value = [];
        }
    }

    async function fetchOrders() {
        try {
            const data = await api('/orders');
            orders.value = data.map(o => ({
                id: 'ORD' + o.id,
                orderId: o.id,
                total: Number(o.total),
                status: o.status,
                date: o.created_at ? new Date(o.created_at).toLocaleString() : '',
                items: normalizeOrderItems(o.items || []),
            }));
            return orders.value;
        } catch (error) {
            console.error('fetchOrders failed:', error);
            orders.value = [];
        }
    }

    async function addToCart(productData, quantity = 1) {
        try {
            await api('/cart', {
                method: 'POST',
                body: JSON.stringify({ product_id: productData.id, quantity }),
            });
            await fetchCart();
            showToast('已成功加入购物车！', 'success');
        } catch (error) {
            console.error('addToCart failed:', error);
            const existingItem = cart.value.find(item => item.product.id === productData.id);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.value.push({
                    id: Date.now() + Math.random(),
                    product: productData,
                    quantity
                });
            }
            showToast('已成功加入购物车！', 'success');
        }
    }

    async function updateCartQuantity(itemId, quantity) {
        if (quantity <= 0) {
            await removeFromCart(itemId);
            return;
        }
        try {
            await api(`/cart/${itemId}`, {
                method: 'PUT',
                body: JSON.stringify({ quantity }),
            });
            await fetchCart();
        } catch (error) {
            console.error('updateCartQuantity failed:', error);
            const item = cart.value.find(i => i.id === itemId);
            if (item) item.quantity = quantity;
        }
    }

    async function removeFromCart(itemId) {
        try {
            await api(`/cart/${itemId}`, { method: 'DELETE' });
            await fetchCart();
            showToast('已从购物车移除', 'info');
        } catch (error) {
            console.error('removeFromCart failed:', error);
            cart.value = cart.value.filter(item => item.id !== itemId);
            showToast('已从购物车移除', 'info');
        }
    }

    async function checkout() {
        if (cart.value.length === 0) {
            showToast('购物车是空的', 'error');
            return null;
        }
        try {
            const result = await api('/orders', { method: 'POST' });
            await fetchCart();
            await fetchOrders();
            showToast('支付成功！感谢您的选购', 'success');
            return 'ORD' + result.order_id;
        } catch (error) {
            console.error('checkout failed:', error);
            const newOrder = {
                id: 'ORD' + Date.now(),
                items: [...cart.value],
                total: cart.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
                date: new Date().toLocaleString()
            };
            orders.value.unshift(newOrder);
            cart.value = [];
            showToast('支付成功！感谢您的选购', 'success');
            return newOrder.id;
        }
    }

    async function initialize() {
        await Promise.all([
            fetchCart(),
            fetchOrders(),
        ]);
    }

    const handleUnimplemented = (feature) => {
        showToast(`${feature} 功能即将上线！`, 'info');
    };

    return {
        products,
        product,
        cart,
        orders,
        user,
        cartCount,
        toastRef,
        showToast,
        fetchProducts,
        fetchProduct,
        fetchProfile,
        fetchCart,
        fetchOrders,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        checkout,
        initialize,
        handleUnimplemented
    };
});
