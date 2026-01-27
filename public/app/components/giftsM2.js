import template from '../templates/M2/model2Gifts.js';

export default {
    name: 'gift',
    template,

    data() {
      return {
        originalImage: null,
        image: null,
        isAdmin: localStorage.getItem('isAdmin') === 'true',
        guestName: localStorage.getItem('userName'),
        searchGift: '',
        activeFilter: 'all',
        showGifttModal: false,
        update: false,
        showConfirm: false,
        gifts: {
            data: [],
        },
        gift: {
            imagefile: null,
            imagePreview: '',
            name: '',
            giftcategory: '',
            price: null,
            reservedby: null
        },
        modalTitle: '',
        api: window.axios.create({
          baseURL: '/',
          timeout: 50000,
        })
      }
  },

  async mounted() {
    window.api = this.api;

    this.gifts = await this.GetGifts();
  },

    computed: {
        filteredGifts() {
            if (this.activeFilter === 'available') {
                    return this.gifts != null ? [ ...this.gifts.data].filter(g => g.reservedby === null).sort((a, b) => { return a.price - b.price }) : []
            }

            if (this.activeFilter === 'reserved' && this.isAdmin) {
                return this.gifts != null ? [ ...this.gifts.data].filter(g => g.reservedby != null).sort((a, b) => { return a.price - b.price }) : []
            }
            else if (this.activeFilter === 'reserved' && !this.isAdmin) {
                return this.gifts != null ? [ ...this.gifts.data].filter(g => g.reservedby === this.guestName) : []
            }

            if (this.isAdmin) {

                return this.gifts != null ? [...this.gifts.data].sort((a, b) => {
                    const aReserved = a.reservedby !== null
                    const bReserved = b.reservedby !== null
                    
                    if (aReserved && !bReserved) return 1
                    if (!aReserved && bReserved) return -1
                    
                    if (!aReserved && !bReserved) {
                        return a.price - b.price
                    }
                    
                    return 0
                }) : []
            }
            else {
                const available = this.gifts != null ? this.gifts.data
                    .filter(g => g.reservedby === null)
                    .sort((a, b) => a.price - b.price) : []

                const reservedByGuest = this.gifts != null ? this.gifts.data
                    .filter(g => g.reservedby === this.guestName) : []

                return [...available, ...reservedByGuest]
            }
        },
        
        giftsTotal() {
            return this.gifts != null ? this.gifts.count : 0
        },

        giftsReserved() {
            return this.gifts != null ? this.gifts.data.filter(g => g.reservedby).length : 0
        },

        giftsRemaining() {
            return this.giftsTotal - this.giftsReserved
        }
    },

    methods: {
        openAddGift() {
            if (!this.update) {
                this.gift.imagefile = null;
                this.gift.imagePreview = null;
                this.gift.name = '';
                this.gift.giftcategory = '';
                this.gift.price = null;
                this.gift.imagePreview = null;
                this.modalTitle = 'Novo presente';
            }
            else {
                this.modalTitle = 'Editar presente';
            }
            this.showGifttModal = true;
        },

        closeModal() {
            this.update = false;
            this.showGifttModal = false;
        },

        onImageChange(event) {
            const file = event.target.files[0]
            if (!file) return

            this.gift.imagefile = file
            this.gift.imagePreview = URL.createObjectURL(file)
        },

        async saveGift() {
            if (!this.update) {
            if (!this.gift.name.trim()) return
            
            await this.InsertGift();
          }
          else {
            if (!this.gift.name.trim()) return

            await this.UpdateGift();
          }

          this.gifts = await this.GetGifts();
          this.closeModal();
        },

        editGift(pGift) {
            this.gift = { ...pGift };
            this.originalImage = this.gift.imagefile
            this.update = true;
            this.openAddGift();
        },

        async removeGift(pGift) {
            this.gift = { ...pGift };
            await this.DeleteGift();
            this.gifts = await this.GetGifts();
        },

        selectGift(pGift) {
            if (!this.showGifttModal && pGift.reservedby === null) {
                this.gift = {...pGift};
                this.showConfirm = true;
            }
        },

        CloseConfirm() {
            this.showConfirm = false;
        },

        async Confirm(pConfirm) {
            if (pConfirm) {
                this.gift.reservedby = this.guestName;
                this.gift.price = 0;
                await this.UpdateGift()
                this.gifts = await this.GetGifts();
            }
            this.showConfirm = false;
        },

        async GetGifts() {
            try {
                const response = await api.get('/getGifts');
                if (response.data.hasData) {
                    return response.data;
                }
                return null;
            } catch (error) {
                console.error('Erro ao buscar presentes:', error);
                return null;
            }
        },

        async UpdateGift()  {
          try {
            const formData = new FormData()

            formData.append('id', this.gift.id)
            formData.append('name', this.gift.name)
            formData.append('giftcategory', this.gift.giftcategory)
            formData.append('reservedby', this.gift.reservedby)
            formData.append('price', this.gift.price === null ? 0 : this.gift.price)

            if (this.gift.imagefile instanceof File) {
                formData.append('image', this.gift.imagefile)
            }

            const response = await api.put('/updateGift', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
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

        async InsertGift() {
          try {
            const formData = new FormData()

            formData.append('name', this.gift.name)
            formData.append('giftcategory', this.gift.giftcategory)
            formData.append('reservedby', this.gift.reservedby)
            formData.append('price', this.gift.price === null ? 0 : this.gift.price)

            if (this.gift.imagefile) {
                formData.append('image', this.gift.imagefile)
            }

            const response = await api.post('/saveGift', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            if (response.data.sucesso) {
              return response.data;
            }
            else {
              return false;
            }
          }
          catch (e) {
            console.error('Erro ao salvar presentes:', e);
            return false;
          }
        },

        async DeleteGift() {
          try {
            const response = await api.delete(`/deleteGift/${this.gift.id}`)
            if (response.data.sucesso) {
              true;
            }
            else {
              return false;
            }
          }
          catch (e) {
            console.error('Erro ao excluir presente:', e);
            return false;
          }
        }
    }
}