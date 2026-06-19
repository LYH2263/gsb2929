import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ProductDetailView from '../views/ProductDetailView.vue';
import ProfileView from '../views/ProfileView.vue';

const routes = [
    { path: '/', name: 'home', component: HomeView },
    { path: '/product/:id', name: 'product-detail', component: ProductDetailView },
    { path: '/profile', name: 'profile', component: ProfileView },
    { path: '/cart', name: 'cart', component: () => import('../views/CartView.vue') }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
