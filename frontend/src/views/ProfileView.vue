<template>
  <div class="profile">
    <div class="header">
      <div class="avatar">
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" />
      </div>
      <div class="user-info">
        <h1>{{ user?.username || '游客用户' }}</h1>
        <p>{{ user?.email || '登录以同步您的个人资料' }}</p>
      </div>
      <button class="edit-btn" @click="store.handleUnimplemented('编辑资料')">编辑资料</button>
    </div>

    <div class="stats">
      <div class="stat-card" @click="store.handleUnimplemented('全部订单')">
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
import { useAppStore } from '../store';

const store = useAppStore();
const user = ref(null);

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:8000/user/profile');
    user.value = await response.json();
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    user.value = { username: 'Felix Chen', email: 'felix@example.com' };
  }
});
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
