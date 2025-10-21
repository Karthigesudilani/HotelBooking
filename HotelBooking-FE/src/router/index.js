import { createRouter, createWebHistory } from 'vue-router';

// Lazy-loaded page components
const RoomSearch = () => import('../pages/RoomSearch.vue');
const Rooms = () => import('../pages/Rooms.vue');
const Contact = () => import('../pages/Contact.vue');
const Confirmation = () => import('../pages/Confirmation.vue');
const Login = () => import('../pages/Login.vue');
const Register = () => import('../pages/Register.vue');
const Dashboard = () => import('../pages/Dashboard.vue');

const routes = [
  { path: '/', name: 'RoomSearch', component: RoomSearch },
  { path: '/rooms', name: 'Rooms', component: Rooms },
  { path: '/contact', name: 'Contact', component: Contact },
  { path: '/confirmation', name: 'Confirmation', component: Confirmation },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;


