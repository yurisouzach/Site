import template from '../templates/M2/model2User.js';

export default {
    name: 'user',
    template,

    data() {
      return {
        modalTitle: '',
        guests: {
          data: [],
        },
        showGuestModal: false,
        search: '',
        filterConfirmed: false,
        filterPending: false,
        guest: {
            name: '',
            phone: null,
            confirmed: 0,
            description: ''
        },
        update: false,
        tempGuest: null,
        api: window.axios.create({
          baseURL: '/',
          timeout: 50000,
        })
      }
  },

  async mounted() {
    window.api = this.api

    this.guests = await this.GetGuests();
  },

  computed: {
  filteredGuests() {
    return this.guests != null ?
      this.guests.data.filter(g => {
        const matchSearch =
          g.name.toLowerCase().includes(this.search.toLowerCase())

        const matchConfirmed =
          !this.filterConfirmed || g.confirmed === 1

        const matchPending =
          !this.filterPending || g.confirmed === 0

        return matchSearch && matchConfirmed && matchPending
      }) : []
  },

  totalGuests() {
    return this.guests != null ? this.guests.count : 0;
  },

  confirmedGuests() {
    return this.guests != null ? this.guests.data.filter(x => x.confirmed === 1).length : 0;
  },

  pendingGuests() {
    return this.guests != null ? this.guests.data.filter(x => x.confirmed != 1).length : 0;
  }
},

    methods: {
        formatPhone() {
            this.guest.phone = this.guest.phone
            .replace(/\D/g, '')
            .replace(/^(\d{2})(\d)/g, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .slice(0, 15)
        },

        toggleFilter(type) {
            if (type === 'confirmed' && this.filterConfirmed) {
                this.filterPending = false
            }

            if (type === 'pending' && this.filterPending) {
                this.filterConfirmed = false
            }
        },

        openModal() {
          if (!this.update) {
            this.guest.name = '';
            this.guest.phone = null;
            this.guest.confirmed = 0;
            this.guest.description = '';
            this.modalTitle = 'Novo Convidado';
          }
          else {
            this.modalTitle = 'Editar Convidado';
          }
          this.showGuestModal = true
        },
        
        closeModal() {
          this.update = false
          this.showGuestModal = false;
        },

        toggleStatus() {
          this.guest.confirmed =
          this.guest.confirmed === 1 ? 0 : 1
        },

        async saveGuest() {
          if (!this.update) {
            if (!this.guest.name.trim()) return
            
            await this.InsertGuest();
          }
          else {
            if (!this.guest.name.trim()) return

            this.guest.confirmed = this.guest.confirmed === 1 ? 1 : 0
            await this.UpdateGuest();
          }

          this.guests = await this.GetGuests()
          this.closeModal(true)
        },

        editGuest(pGuest) {
          this.guest = { ...pGuest };
          this.update = true;
          this.openModal();
        },

        async removeGuest(pGuest) {
          this.guest = { ...pGuest };
          await this.DeleteGuest();
          this.guests = await this.GetGuests();
        },

        async GetGuests() {
          try {
            const response = await api.get('/getGuests');
            if (response.data.hasData) {
              return response.data;
            }
            return null;
          } catch (error) {
            console.error('Erro ao buscar convidados:', error);
            return null;
          }
        },

        async UpdateGuest()  {
          try {
            if (this.guest.phone != null)
              this.guest.phone = this.guest.phone.replace('(', '').replace(')', '').replace('-', '').replace(' ', '')
            const response = await api.put('/updateGuest', { guest: this.guest })
            if (response.data.sucesso) {
              return response.data;
            }
            else {
              return false;
            }
          }
          catch (e) {
            console.error('Erro ao salvar alterações do convidado:', e);
            return false;
          }
        },

        async InsertGuest() {
          try {
            if (this.guest.phone != null)
              this.guest.phone = this.guest.phone.replace('(', '').replace(')', '').replace('-', '').replace(' ', '')
            const response = await api.post('/saveGuest', { guest: this.guest })
            if (response.data.sucesso) {
              return response.data;
            }
            else {
              return false;
            }
          }
          catch (e) {
            console.error('Erro ao salvar convidado:', e);
            return false;
          }
        },

        async DeleteGuest() {
          try {
            const response = await api.delete(`/deleteGuest/${this.guest.id}`)
            if (response.data.sucesso) {
              true;
            }
            else {
              return false;
            }
          }
          catch (e) {
            console.error('Erro ao excluir convidado:', e);
            return false;
          }
        }
    }
}