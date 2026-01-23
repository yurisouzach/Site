const { createRouter, createWebHistory } = VueRouter;

//import login from './components/loginM1.js';
//import presentes from './components/presentesM1.js';

const routes = [
  {
    path: '/',
    name: 'inicio',
    component: () => import('./components/loginM2.js')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('./components/homeM2.js')
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('./components/userM2.js')
  },
  {
    path: '/gift',
    name: 'gift',
    component: () => import('./components/giftsM2.js')
  },
  {
    path: '/check',
    name: 'check',
    component: () => import('./components/checkM2.js')
  },
  {
    path: '/homeGuest',
    name: 'homeGuest',
    component: () => import('./components/guestHomeM2.js')
  },
  {
    path: '/presentes',
    name: 'Presentes', 
    component: () => import('./components/presentesM1.js'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'inicio',
    component: () => import('./components/loginM2.js')
  }
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes
})

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