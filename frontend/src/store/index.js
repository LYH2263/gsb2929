import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAppStore = defineStore('app', () => {
    const cart = ref([]);
    const orders = ref([]);
    const toastRef = ref(null);

    const cartCount = computed(() => cart.value.reduce((sum, item) => sum + item.quantity, 0));

    const showToast = (message, type = 'info') => {
        if (toastRef.value) {
            toastRef.value.show(message, type);
        }
    };

    const addToCart = (product, quantity = 1) => {
        const existingItem = cart.value.find(item => item.product.id === product.id);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.value.push({
                id: Date.now() + Math.random(),
                product,
                quantity
            });
        }
        showToast('已成功加入购物车！', 'success');
    };

    const removeFromCart = (itemId) => {
        cart.value = cart.value.filter(item => item.id !== itemId);
        showToast('已从购物车移除', 'info');
    };

    const checkout = () => {
        if (cart.value.length === 0) {
            showToast('购物车是空的', 'error');
            return;
        }

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
    };

    const handleUnimplemented = (feature) => {
        showToast(`${feature} 功能即将上线！`, 'info');
    };

    return {
        cart,
        orders,
        cartCount,
        toastRef,
        showToast,
        addToCart,
        removeFromCart,
        checkout,
        handleUnimplemented
    };
});
