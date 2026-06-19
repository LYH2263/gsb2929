<template>
  <div class="product-detail" v-if="product">
    <div class="container">
      <div class="image-gallery">
        <img :src="product.image_url" :alt="product.name" />
      </div>
      <div class="product-info">
        <nav class="breadcrumb">
          <span @click="router.push('/')">商城</span> / <span>{{ product.category }}</span>
        </nav>
        <h1>{{ product.name }}</h1>
        <p class="price">¥{{ product.price }}</p>
        <div class="description">
          <h3>产品描述</h3>
          <p>{{ product.description || '体验创新与优雅的完美结合。这款产品旨在以无与伦比的性能和风格提升您的日常生活。' }}</p>
        </div>
        
        <div class="actions">
          <div class="quantity-selector">
            <button @click="quantity > 1 && quantity--">-</button>
            <span>{{ quantity }}</span>
            <button @click="quantity++">+</button>
          </div>
          <button class="add-to-cart" @click="addToCart">加入购物车</button>
        </div>

        <div class="extra-features">
          <div class="feature" @click="store.handleUnimplemented('分享')">
            <span>分享</span>
          </div>
          <div class="feature" @click="store.handleUnimplemented('收藏')">
            <span>加入收藏</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="loading">Loading details...</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from '../store';

const route = useRoute();
const router = useRouter();
const store = useAppStore();
const product = ref(null);
const quantity = ref(1);

onMounted(async () => {
  const id = route.params.id;
  try {
    const response = await fetch(`http://localhost:8000/products/${id}`);
    product.value = await response.json();
  } catch (error) {
    console.error('Failed to fetch product:', error);
    // Mock data
    product.value = {
      id,
      name: '至臻无线降噪耳机',
      price: 1999.00,
      image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      category: '数码电子',
      description: '采用顶级无线技术，为您提供卓越的听觉盛宴。内置先进的智能降噪芯片，为您隔绝喧嚣，时刻沉浸在音乐之中。配合长达40小时的续航时间，音乐触手可及。'
    };
  }
});

const addToCart = () => {
  store.addToCart(product.value, quantity.value);
};
</script>

<style scoped>
.product-detail {
  padding: 60px 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
}

.image-gallery img {
  width: 100%;
  border-radius: 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.breadcrumb {
  margin-bottom: 20px;
  color: #b2bec3;
  font-size: 0.9rem;
}

.breadcrumb span {
  cursor: pointer;
  transition: color 0.2s;
}

.breadcrumb span:hover {
  color: #2d3436;
}

.product-info h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: #2d3436;
}

.price {
  font-size: 2rem;
  font-weight: 700;
  color: #00b894;
  margin-bottom: 30px;
}

.description {
  margin-bottom: 40px;
}

.description h3 {
  font-size: 1.1rem;
  margin-bottom: 12px;
  color: #2d3436;
}

.description p {
  line-height: 1.8;
  color: #636e72;
}

.actions {
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
}

.quantity-selector {
  display: flex;
  align-items: center;
  background: #f1f2f6;
  border-radius: 12px;
  padding: 5px;
}

.quantity-selector button {
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #2d3436;
}

.quantity-selector span {
  width: 40px;
  text-align: center;
  font-weight: 600;
}

.add-to-cart {
  flex: 1;
  background: #2d3436;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.add-to-cart:hover {
  background: #000;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.extra-features {
  display: flex;
  gap: 30px;
  border-top: 1px solid #f1f2f6;
  padding-top: 30px;
}

.feature {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #636e72;
  cursor: pointer;
  font-size: 0.95rem;
  transition: color 0.2s;
}

.feature:hover {
  color: #2d3436;
}

@media (max-width: 968px) {
  .container {
    grid-template-columns: 1fr;
  }
}
</style>
