<template>
  <div class="profile">
    <div class="header">
      <div class="avatar">
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" />
      </div>
      <div class="user-info">
        <h1>{{ store.user?.username || '游客用户' }}</h1>
        <p>{{ store.user?.email || '登录以同步您的个人资料' }}</p>
      </div>
      <button class="edit-btn" @click="store.handleUnimplemented('编辑资料')">编辑资料</button>
    </div>

    <div class="stats">
      <div class="stat-card" @click="scrollToOrders">
        <span class="value">{{ store.orders.length }}</span>
        <span class="label">我的订单</span>
      </div>
      <div class="stat-card" @click="store.handleUnimplemented('我的收藏')">
        <span class="value">5</span>
        <span class="label">收藏夹</span>
      </div>
      <div class="stat-card" @click="store.handleUnimplemented('优惠券')">
        <span class="value">2</span>
        <span class="label">优惠券</span>
      </div>
    </div>

    <div class="orders-section" ref="ordersSection">
      <h2>最近订单</h2>
      <div v-if="store.orders.length" class="orders-list">
        <div v-for="order in store.orders" :key="order.id" class="order-card">
          <div class="order-header">
            <span class="order-id">订单号: {{ order.id }}</span>
            <span class="order-date">{{ order.date }}</span>
          </div>
          <div class="order-items">
            <div v-for="item in order.items" :key="item.id" class="order-item-preview">
              <img :src="item.product.image_url" :alt="item.product.name" />
              <div class="item-info">
                <p class="item-name">{{ item.product.name }}</p>
                <p class="item-qty">x{{ item.quantity }}</p>
              </div>
            </div>
          </div>
          <div class="order-footer">
            <span class="order-total">实付: ¥{{ Number(order.total).toFixed(2) }}</span>
            <span class="order-status">已支付</span>
          </div>
        </div>
      </div>
      <div v-else class="no-orders">
        <p>暂无订单记录</p>
        <button @click="router.push('/')">去购物</button>
      </div>
    </div>

    <div class="menu">
      <div class="menu-item" @click="store.handleUnimplemented('我的评价')">
        <span class="icon">★</span>
        <span class="text">我的评价</span>
        <span class="arrow">›</span>
      </div>
      <div class="menu-item" @click="store.handleUnimplemented('收货地址')">
        <span class="icon">📍</span>
        <span class="text">收货地址</span>
        <span class="arrow">›</span>
      </div>
      <div class="menu-item" @click="store.handleUnimplemented('支付方式')">
        <span class="icon">💳</span>
        <span class="text">支付方式</span>
        <span class="arrow">›</span>
      </div>
      <div class="menu-item" @click="store.handleUnimplemented('设置')">
        <span class="icon">⚙</span>
        <span class="text">设置</span>
        <span class="arrow">›</span>
      </div>
    </div>

    <button class="logout-btn" @click="store.handleUnimplemented('退出登录')">退出登录</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '../store';

const router = useRouter();
const store = useAppStore();
const ordersSection = ref(null);

onMounted(async () => {
  await Promise.all([
    store.loadOrders(),
    store.loadUserProfile()
  ]);
});

const scrollToOrders = () => {
  if (ordersSection.value) {
    ordersSection.value.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<style scoped>
.profile {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.header {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 40px;
  background: white;
  padding: 30px;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  background: #f1f2f6;
  border: 4px solid #fff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info h1 {
  font-size: 1.8rem;
  margin: 0 0 5px 0;
  color: #2d3436;
}

.user-info p {
  color: #b2bec3;
  margin: 0;
}

.edit-btn {
  margin-left: auto;
  padding: 10px 20px;
  border-radius: 12px;
  border: 1px solid #dfe6e9;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.edit-btn:hover {
  background: #f1f2f6;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.stat-card .value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3436;
  margin-bottom: 5px;
}

.stat-card .label {
  font-size: 0.9rem;
  color: #b2bec3;
}

.orders-section {
  margin-bottom: 40px;
}

.orders-section h2 {
  font-size: 1.3rem;
  margin-bottom: 20px;
  color: #2d3436;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
}

.order-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f2f6;
}

.order-id {
  font-weight: 600;
  color: #2d3436;
}

.order-date {
  color: #b2bec3;
  font-size: 0.9rem;
}

.order-items {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.order-item-preview {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f8fafc;
  padding: 8px 12px;
  border-radius: 12px;
}

.order-item-preview img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 8px;
}

.item-info {
  display: flex;
  flex-direction: column;
}

.item-name {
  font-size: 0.85rem;
  color: #2d3436;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-qty {
  font-size: 0.75rem;
  color: #b2bec3;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f1f2f6;
}

.order-total {
  font-weight: 700;
  font-size: 1.1rem;
  color: #00b894;
}

.order-status {
  color: #00b894;
  font-size: 0.9rem;
  font-weight: 500;
}

.no-orders {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 20px;
}

.no-orders p {
  color: #b2bec3;
  margin-bottom: 16px;
}

.no-orders button {
  padding: 10px 24px;
  border-radius: 12px;
  border: none;
  background: #2d3436;
  color: white;
  cursor: pointer;
}

.menu {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 20px 30px;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid #f1f2f6;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:hover {
  background: #fdfdfd;
}

.menu-item .icon {
  width: 30px;
  font-size: 1.2rem;
}

.menu-item .text {
  flex: 1;
  font-weight: 500;
  color: #636e72;
}

.menu-item .arrow {
  color: #b2bec3;
  font-size: 1.5rem;
}

.logout-btn {
  width: 100%;
  padding: 18px;
  border-radius: 20px;
  border: none;
  background: #fff;
  color: #ff7675;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.logout-btn:hover {
  background: #fff5f5;
  color: #d63031;
}
</style>
