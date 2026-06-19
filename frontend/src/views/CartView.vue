<template>
  <div class="cart">
    <h1>您的购物袋</h1>
    <div v-if="store.cart.length" class="cart-container">
      <div class="items-list">
        <div v-for="item in store.cart" :key="item.id" class="cart-item">
          <img :src="item.product.image_url" :alt="item.product.name" />
          <div class="item-details">
            <div class="item-header">
              <h3>{{ item.product.name }}</h3>
              <button class="remove-btn" @click="store.removeFromCart(item.id)">✕</button>
            </div>
            <p class="category">{{ item.product.category }}</p>
            <div class="item-footer">
              <div class="quantity">
                <button @click="store.updateCartItem(item.id, item.quantity - 1)">-</button>
                <span>{{ item.quantity }}</span>
                <button @click="store.updateCartItem(item.id, item.quantity + 1)">+</button>
              </div>
              <p class="price">¥{{ (item.product.price * item.quantity).toFixed(2) }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="summary">
        <h2>订单摘要</h2>
        <div class="summary-row">
          <span>小计</span>
          <span>¥{{ subtotal.toFixed(2) }}</span>
        </div>
        <div class="summary-row">
          <span>运费</span>
          <span class="free">免费</span>
        </div>
        <div class="summary-total">
          <span>总计</span>
          <span>¥{{ subtotal.toFixed(2) }}</span>
        </div>
        <button class="checkout-btn" @click="handleCheckout">立即结算</button>
      </div>
    </div>
    <div v-else-if="recentOrder" class="order-success">
      <div class="success-icon">✅</div>
      <h2>订单提交成功！</h2>
      <p>订单号：{{ recentOrder.id }}</p>
      <div class="order-details">
        <div v-for="item in recentOrder.items" :key="item.id" class="order-item">
          <span>{{ item.product.name }} x {{ item.quantity }}</span>
          <span>¥{{ (item.product.price * item.quantity).toFixed(2) }}</span>
        </div>
        <div class="order-total">
          <span>实付金额：</span>
          <span class="amount">¥{{ recentOrder.total.toFixed(2) }}</span>
        </div>
      </div>
      <button class="back-btn" @click="router.push('/')">返回首页</button>
    </div>
    <div v-else class="empty-cart">
      <p>您的购物袋是空的。</p>
      <button @click="router.push('/')">开始购物</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '../store';

const router = useRouter();
const store = useAppStore();
const recentOrder = ref(null);

const subtotal = computed(() => {
  return store.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
});

onMounted(() => {
  store.fetchCart();
});

const handleCheckout = async () => {
  const order = await store.checkout();
  if (order) {
    recentOrder.value = order;
  }
};
</script>

<style scoped>
.cart {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.cart h1 {
  font-size: 2rem;
  margin-bottom: 40px;
  color: #2d3436;
}

.cart-container {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 40px;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cart-item {
  display: flex;
  gap: 20px;
  background: white;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.cart-item img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 12px;
}

.item-details {
  flex: 1;
}

.item-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.item-header h3 {
  font-size: 1.1rem;
  margin: 0;
  color: #2d3436;
}

.remove-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #b2bec3;
  cursor: pointer;
  transition: color 0.2s;
}

.remove-btn:hover {
  color: #ff7675;
}

.category {
  font-size: 0.85rem;
  color: #b2bec3;
  margin-bottom: 20px;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.quantity {
  display: flex;
  align-items: center;
  background: #f1f2f6;
  border-radius: 10px;
  padding: 2px;
}

.quantity button {
  width: 30px;
  height: 30px;
  border: none;
  background: none;
  cursor: pointer;
}

.quantity span {
  width: 30px;
  text-align: center;
  font-weight: 600;
}

.price {
  font-weight: 700;
  color: #2d3436;
}

.summary {
  background: white;
  padding: 30px;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  height: fit-content;
}

.summary h2 {
  font-size: 1.5rem;
  margin-bottom: 24px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  color: #636e72;
}

.free {
  color: #00b894;
  font-weight: 600;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f1f2f6;
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3436;
  margin-bottom: 30px;
}

.checkout-btn {
  width: 100%;
  padding: 18px;
  border-radius: 12px;
  border: none;
  background: #2d3436;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.checkout-btn:hover {
  background: #000;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.empty-cart {
  text-align: center;
  padding: 100px 0;
}

.empty-cart p {
  font-size: 1.2rem;
  color: #b2bec3;
  margin-bottom: 20px;
}

.empty-cart button {
  padding: 12px 30px;
  border-radius: 12px;
  border: none;
  background: #2d3436;
  color: white;
  cursor: pointer;
}

@media (max-width: 860px) {
  .cart-container {
    grid-template-columns: 1fr;
  }
}

.order-success {
  text-align: center;
  background: white;
  padding: 60px;
  border-radius: 32px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
  max-width: 600px;
  margin: 0 auto;
}

.success-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.order-details {
  margin: 30px 0;
  text-align: left;
  background: #f8fafc;
  padding: 24px;
  border-radius: 16px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  color: #636e72;
}

.order-total {
  border-top: 1px solid #e2e8f0;
  margin-top: 16px;
  padding-top: 16px;
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  font-size: 1.2rem;
}

.amount {
  color: #00b894;
}

.back-btn {
  padding: 14px 40px;
  border-radius: 12px;
  border: 1px solid #2d3436;
  background: white;
  color: #2d3436;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #2d3436;
  color: white;
}
</style>
