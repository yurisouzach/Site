const { createApp } = Vue;
import Router from './router.js';

const App = {
  template: `<router-view></router-view>`,

  // setup() {
  //   const trocarCSS = (rota) => {
  //     const linkCSS = document.getElementById('dynamic-css');
      
  //     switch(rota) {
  //       case '/':
  //       case '/login':
  //         linkCSS.href = 'login.css';
  //         break;
  //       case '/presentes':
  //         linkCSS.href = 'presentes.css';
  //         break;
  //       default:
  //         linkCSS.href = 'login.css';
  //     }
  //   };

  //   // Observe mudanças de rota
  //   if (window.router) {
  //     watch(
  //       () => window.router.currentRoute.value.path,
  //       (novaRota) => {
  //         trocarCSS(novaRota);
  //       },
  //       { immediate: true } // Executa imediatamente na inicialização
  //     );
  //   }

  //   return {};
  // }
};

if (typeof window !== 'undefined') {
  const app = createApp(App);
  if (window.router) {
    app.use(Router);
  }

  app.mount('#app');
}

export default App;