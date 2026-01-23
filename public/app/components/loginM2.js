import template from '../templates/M2/model2login.js';
import Router from '../router.js'

export default {
    name: 'login',
    template,

    data() {
      return {
        showNewPassword: false,
        showErrorName: false,
        showErrorPass: false,
        convidado: true,
        marry: {},
        guest: {},
        api: window.axios.create({
          baseURL: '/',
          timeout: 50000,
        })
      }
  },

  async mounted() {
    window.api = this.api;

    this.marry = await this.GetMarry();

    const hearts = document.querySelectorAll('.hearts-bg span');
    hearts.forEach(heart => {
      heart.style.left = Math.random() * 100 + '%';
      heart.style.animationDuration = 6 + Math.random() * 6 + 's';
      heart.style.fontSize = 12 + Math.random() * 14 + 'px';
    });
  },

  methods: {

    async Enter () {
      if (this.convidado)
        if ($("#txtNome")[0].value.length > 0) {
          console.log("pegando convidado do banco")
          this.guest = await this.GetGuest($("#txtNome")[0].value.trim());
          if (this.guest != null) {
              localStorage.setItem('isAdmin', false);
              localStorage.setItem('marryDate', this.marry.marrydate);
              localStorage.setItem('guestId', this.guest.id);
              localStorage.setItem('isConfirmed', this.guest.confirmed);
              localStorage.setItem('userName', this.guest.name);
              Router.push('/homeGuest');
          }
          else
            this.showErrorName = true;
        }
        else
          this.showErrorName = true;
      else
        if ($("#txtSenha")[0].value.length > 0) {
          if (this.marry.password === $("#txtSenha")[0].value.trim()) {
            if (this.marry.password === 'SenhaTemp123!') {
              this.marry.password = '';
              this.showNewPassword = true
            }
            else {
              localStorage.setItem('isAdmin', true);
              localStorage.setItem('marryDate', this.marry.marrydate);
              localStorage.setItem('isConfirmed', 0);
              localStorage.setItem('userName', "noivo(a)");
              Router.push('/home');
            }
          }
          else
            this.showErrorPass = true;
        }
        else
          this.showErrorPass = true;
    },

    CloseConfirm() {
      this.showNewPassword = false;
    },

    async Confirm(pBool) {
      if (pBool) {
        await this.ChangePassword();
        this.marry = this.GetMarry();
        localStorage.setItem('isAdmin', true);
        localStorage.setItem('marryDate', this.marry.marrydate);
        localStorage.setItem('isConfirmed', 0);
        localStorage.setItem('userName', "noivo(a)");
        Router.push('/home');
      }

      this.showNewPassword = false;
    },

    async GetMarry() {
      try {
        const response = await api.get('/getMarry');
        if (response.data.hasData) {
          return response.data.data[0];
        }
        return null;
      } catch (error) {
        console.error('Erro ao buscar casamento:', error);
      return null;
      }
    },

    async ChangePassword() {
      try {
        const response = await api.put('/updatePassword', { marry: this.marry } )
        if (response.data.sucesso) {
          return response.data;
        }
        else {
          return false;
        }
      }
      catch (e) {
        console.error('Erro ao salvar alterações do presente:', e);
        return false;
      }
    },

    async GetGuest(pName) {
      try {
        const response = await api.get('/getGuest', {
          params: { nome: pName }
        });
        if (response.data.hasData) {
          return response.data.data[0];
        }
        return null;
      } catch (error) {
        console.error('Erro ao buscar convidado:', error);
        return null;
      }
    },
  }
}