import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

const request = async (path, options = {}) => {
    const response = await fetch(`${API_BASE}${path}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        },
        ...options
    });
    if (!response.ok) {
        let detail = response.statusText;
        try {
            const data = await response.json();
            detail = data.detail || detail;
        } catch (_) {
            // ignore
        }
        const err = new Error(detail);
        err.status = response.status;
        throw err;
    }
    if (response.status === 204) return null;
    return response.json();
};

export const useAppStore = defineStore('app', () => {
    const cart = ref([]);
    const orders = ref([]);
    const products = ref([]);
    const user = ref(null);
    const toastRef = ref(null);
    const loading = ref({ cart: false, orders: false, products: false });

    const cartCount = computed(() =>
        cart.value.reduce((sum, item) => sum + item.quantity, 0)
    );

    const showToast = (message, type = 'info') => {
        if (toastRef.value) {
            toastRef.value.show(message, type);
        }
    };

    const fetchProducts = async () => {
        loading.value.products = true;
        try {
            products.value = await request('/products');
            return products.value;
        } catch (error) {
            console.error('Failed to fetch products:', error);
            showToast('商品加载失败', 'error');
            throw error;
        } finally {
            loading.value.products = false;
        }
    };

    const fetchProduct = async (id) => {
        try {
            return await request(`/products/${id}`);
        } catch (error) {
            console.error('Failed to fetch product:', error);
            showToast('商品详情加载失败', 'error');
            throw error;
        }
    };

    const fetchCart = async () => {
        loading.value.cart = true;
        try {
            cart.value = await request('/cart');
            return cart.value;
        } catch (error) {
            console.error('Failed to fetch cart:', error);
            throw error;
        } finally {
            loading.value.cart = false;
        }
    };

    const addToCart = async (product, quantity = 1) => {
        try {
            await request('/cart', {
                method: 'POST',
                body: JSON.stringify({ product_id: product.id, quantity })
            });
            await fetchCart();
            showToast('已成功加入购物车！', 'success');
        } catch (error) {
            console.error('Failed to add to cart:', error);
            showToast('加入购物车失败', 'error');
        }
    };

    const updateCartItem = async (itemId, quantity) => {
        try {
            await request(`/cart/${itemId}`, {
                method: 'PATCH',
                body: JSON.stringify({ quantity })
            });
            await fetchCart();
        } catch (error) {
            if (error.status === 410) {
                await fetchCart();
                return;
            }
            console.error('Failed to update cart item:', error);
            showToast('更新购物车失败', 'error');
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            await request(`/cart/${itemId}`, { method: 'DELETE' });
            await fetchCart();
            showToast('已从购物车移除', 'info');
        } catch (error) {
            console.error('Failed to remove cart item:', error);
            showToast('移除失败', 'error');
        }
    };

    const fetchOrders = async () => {
        loading.value.orders = true;
        try {
            orders.value = await request('/orders');
            return orders.value;
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            throw error;
        } finally {
            loading.value.orders = false;
        }
    };

    const checkout = async () => {
        if (cart.value.length === 0) {
            showToast('购物车是空的', 'error');
            return null;
        }
        try {
            const order = await request('/orders', { method: 'POST' });
            orders.value = [order, ...orders.value];
            cart.value = [];
            showToast('支付成功！感谢您的选购', 'success');
            return order;
        } catch (error) {
            console.error('Checkout failed:', error);
            showToast(error.message || '结算失败', 'error');
            return null;
        }
    };

    const fetchProfile = async () => {
        try {
            user.value = await request('/user/profile');
            return user.value;
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            throw error;
        }
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
        fetchProducts,
        fetchProduct,
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        fetchOrders,
        checkout,
        fetchProfile,
        handleUnimplemented
    };
});
