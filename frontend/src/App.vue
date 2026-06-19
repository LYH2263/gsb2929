<template>
  <div class="app-layout">
    <nav class="navbar">
      <div class="logo" @click="router.push('/')">
        <span>LUXE</span>精选
      </div>
      <div class="nav-links">
        <router-link to="/">首页</router-link>
      </div>
      <div class="nav-actions">
        <div class="search" @click="store.handleUnimplemented('搜索')">
          <span class="icon">🔍</span>
        </div>
        <div class="cart-icon" @click="router.push('/cart')">
          <span class="icon">🛒</span>
          <span v-if="store.cartCount > 0" class="badge">{{ store.cartCount }}</span>
        </div>
        <div class="user-icon" @click="router.push('/profile')">
          <span class="icon">👤</span>
        </div>
      </div>
    </nav>

    <main class="content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>LUXE精选</h3>
          <p>自2024年起，为您提升生活品质。</p>
        </div>
        <div class="footer-section">
          <h4>快捷链接</h4>
          <span @click="store.handleUnimplemented('客服帮助')">客服帮助</span>
          <span @click="store.handleUnimplemented('隐私政策')">隐私政策</span>
        </div>
      </div>
      <div class="footer-bottom">
        &copy; 2024 LUXE精选. 保留所有权利。
      </div>
    </footer>

    <Toast ref="toastRef" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from './store';
import Toast from './components/Toast.vue';

const router = useRouter();
const store = useAppStore();
const toastRef = ref(null);

onMounted(async () => {
  store.toastRef = toastRef.value;
  await store.initializeApp();
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

:root {
  --primary-color: #2d3436;
  --accent-color: #00b894;
  --bg-color: #f8fafc;
  --text-color: #2d3436;
  --text-light: #636e72;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Outfit', sans-serif;
  background-color: var(--bg-color);
  color: var(--text-color);
  line-height: 1.5;
}

.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 40px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.03);
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 2px;
  cursor: pointer;
}

.logo span {
  font-weight: 300;
}

.nav-links {
  display: flex;
  gap: 30px;
}

.nav-links a, .nav-links span {
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s;
}

.nav-links span:hover, .nav-links a:hover {
  color: var(--accent-color);
}

.nav-actions {
  display: flex;
  gap: 20px;
  align-items: center;
}

.icon {
  font-size: 1.4rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.icon:hover {
  transform: scale(1.1);
}

.cart-icon {
  position: relative;
}

.badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--accent-color);
  color: white;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 700;
}

.content {
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.footer {
  background: white;
  padding: 60px 40px 20px;
  margin-top: 60px;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
}

.footer-section h3, .footer-section h4 {
  margin-bottom: 15px;
}

.footer-section span {
  display: block;
  margin-bottom: 8px;
  color: var(--text-light);
  cursor: pointer;
}

.footer-bottom {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #f1f2f6;
  color: var(--text-light);
  font-size: 0.9rem;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
