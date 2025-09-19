const { createRouter, createWebHistory } = VueRouter;

import login from './login.js';
import presentes from './presentes.js';

const routes = [
  {
    path: '/',
    name: 'inicio',
    component: login
  },
  {
    path: '/presentes',
    name: 'Presentes', 
    component: presentes,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Guarda de navegação com troca de CSS
router.beforeEach((to, from, next) => {
  console.log('Navegando para:', to.path);
  
  // Troca CSS baseado na rota de destino
  document.body.classList.remove('tela-login', 'tela-presentes');
  
  if (to.path === '/presentes') {
    document.body.classList.add('tela-presentes');
  } else {
    document.body.classList.add('tela-login');
  }
  
  // Verificação de autenticação
  if (to.meta.requiresAuth) {
    const userRole = localStorage.getItem('userRole');
    if (!userRole) {
      next('/');
      return;
    }
  }
  
  next();
});

// Export padrão necessário para Vue Router
export default router;

// Também disponibiliza globalmente para acesso fácil
window.router = router;