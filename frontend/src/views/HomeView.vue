<template>
  <div class="home">
    <header class="hero">
      <h1>发现您的风格</h1>
      <p>在我们的精选系列中，奢华与舒适完美融合。</p>
    </header>

    <div class="product-grid" v-if="store.products.length">
      <div v-for="product in store.products" :key="product.id" class="product-card" @click="goToDetail(product.id)">
        <div class="image-container">
          <img :src="product.image_url" :alt="product.name" />
          <button class="add-btn" @click.stop="store.addToCart(product)">+</button>
        </div>
        <div class="info">
          <h3>{{ product.name }}</h3>
          <p class="category">{{ product.category }}</p>
          <p class="price">¥{{ product.price }}</p>
        </div>
      </div>
    </div>
    <div v-else class="loading">正在为您寻找精选商品...</div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '../store';

const router = useRouter();
const store = useAppStore();

onMounted(async () => {
  await store.fetchProducts();
});

const goToDetail = (id) => {
  router.push({ name: 'product-detail', params: { id } });
};
</script>

<style scoped>
.home {
  padding: 20px;
}

.hero {
  text-align: center;
  margin-bottom: 60px;
  padding: 60px 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 24px;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 10px;
  color: #2d3436;
}

.hero p {
  font-size: 1.2rem;
  color: #636e72;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
}

.product-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.product-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.image-container {
  position: relative;
  height: 300px;
  overflow: hidden;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .image-container img {
  transform: scale(1.1);
}

.add-btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: #2d3436;
  color: white;
  border: none;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  opacity: 0;
  transform: translateY(10px);
}

.product-card:hover .add-btn {
  opacity: 1;
  transform: translateY(0);
}

.add-btn:hover {
  background: #00b894;
  transform: scale(1.1);
}

.info {
  padding: 20px;
}

.info h3 {
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  color: #2d3436;
}

.category {
  font-size: 0.85rem;
  color: #b2bec3;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3436;
}

.loading {
  text-align: center;
  padding: 100px;
  font-size: 1.2rem;
  color: #636e72;
}
</style>
