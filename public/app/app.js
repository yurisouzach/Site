const { createApp } = Vue;
import Router from '../app/router.js';

const App = {
  template:  `
    <div class="app-layout">
      
      <!-- BOTÃO VOLTAR -->
      <div
        class="back-button"
        v-if="showBackButton"
        @click="goBack"
      >
        <span class="material-symbols-rounded">arrow_back</span>
      </div>

      <!-- ROTAS -->
      <router-view></router-view>

    </div>
  `,

  data() {
    return {
      marry: {},
      api: window.axios.create({
        baseURL: '/',
        timeout: 50000,
      })
    }
  },

  async mounted() {
    await this.loadContext();

    if (this.marry.palette) {
      this.applyPalette(this.marry.palette);
    }
  },

  computed: {
    showBackButton() {
      return this.$route.name !== 'inicio' && this.$route.name !== undefined;
    }
  },

  methods: {
    goBack() {
      Router.back();
    },

    applyPalette(palette) {
      const root = document.documentElement;

      Object.entries(palette).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
    },

    async loadContext() {
      try {
      const response = await this.api.get('/context');
      this.marry = response.data;
      }
      catch (e) {
        console.log(e)
      }
    }
  }

};

if (typeof window !== 'undefined') {
  const app = createApp(App);
  if (window.router) {
    app.use(Router);
  }

  app.mount('#app');
}

export default App;