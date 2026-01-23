import template from '../templates/M2/model2GuestHome.js';
import router from '../router.js';

export default {
    name: 'homeGuest',
    template,

    data() {
      return {
        guestView: null,
        deadline: null,
        guestId: localStorage.getItem('guestId'),
        confirmed: Number(localStorage.getItem('isConfirmed')),
        editContext: {
            type: '',
            title: '',
            fields: [],
            model: {}
        },
        showEditModal: false,
        ender: {},
        infs: [],
        inf: {
            text: ''
        },
        warnings: [],
        warning: {
            text: ''
        },
        update: false,
        showWarning: false,
        showInf: false,
        welcome: '',
        subtitle: '',
        saudation: '',
        GuestName: localStorage.getItem('userName'),
        isAdmin: localStorage.getItem('isAdmin') === 'true',
        marryDate: new Date(localStorage.getItem('marryDate').slice(0, 10)),
        now: new Date(),
        api: window.axios.create({
          baseURL: '/',
          timeout: 50000,
        })
      }
  },

    async mounted() {
        window.api = this.api;

        this.timer = setInterval(() => {
            this.updateNow()
        }, 1000 * 60 * 60)

        this.guestView = await this.GetGuestView();
        this.saudation = this.guestView.data[0].saudation;
        this.subtitle = this.guestView.data[0].subtitle;
        this.welcome = this.guestView.data[0].welcome;
        this.deadline = this.guestView.data[0].deadline;
        this.showWarning = this.guestView.data[0].showwarning;
        this.showInf = this.guestView.data[0].showinformation;

        if (this.showWarning)
            this.warnings = await this.GetWarnings();

        if (this.showInf) {
            this.infs = await this.GetInfs();

            this.ender = await this.GetEnder();
        }
    },

    beforeUnmount() {
        clearInterval(this.timer)
    },

  computed: {
    daysCountdown() {
        const oneDay = 1000 * 60 * 60 * 24

        const diffTime = this.marryDate - this.now
        const diffDays = Math.ceil(diffTime / oneDay)

        return diffDays >= 0 ? diffDays : 0
    },

    warningsToShow() {
        return this.warnings.slice(0,4);
    },

    infsToShow() {
        return this.infs.slice(0, 4);
    },

    mapsLink() {
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(this.ender.ender)}`
    }
},

    methods: {
        formatDate(pDate) {
            if (!pDate) return ''
                return new Date(pDate).toLocaleDateString('pt-BR')
        },
        
        closeModal() {
            this.showEditModal = false;
        },

        async SaveEdit() {
            switch (this.editContext.type) {
                case 'welcome':
                    this.saudation = this.editContext.model.saudation
                    this.subtitle = this.editContext.model.subtitle
                    await this.UpdateGuestView();
                break

                case 'message':
                    this.welcome = this.editContext.model.welcome
                    await this.UpdateGuestView()
                break

                case 'warning':
                    if (this.update) {
                        this.warning.description = this.editContext.model.text
                        this.UpdateWarning()
                    }
                    else {
                        this.warning.description = this.editContext.model.text
                        await this.InsertWarning()
                        this.warnings = await this.GetWarnings()
                    }
                    
                break
                
                case 'inf':
                    if (this.update) {
                        this.inf.description = this.editContext.model.text
                        this.UpdateInf()
                    }
                    else {
                        this.inf.description = this.editContext.model.text
                        await this.InsertInf()
                        this.infs = await this.GetInfs()
                    }
                    
                break

                case 'ender':
                    this.ender.ender = this.editContext.model.text
                    await this.UpdateEnder()
                break

                case 'deadline':
                    this.deadline = this.editContext.model.deadline
                    await this.UpdateGuestView();
                break
            }

            this.closeModal()
        },

        openWelcomeHeadder() {
            this.editContext = {
                type: 'welcome',
                title: 'Editar boas-vindas',
                fields: [
                    { key: 'saudation', type: 'input', label: 'Saudação' },
                    { key: 'subtitle', type: 'textarea', label: 'Subtítulo' }
                ],
                model: {
                    saudation: this.saudation,
                    subtitle: this.subtitle
                }
            }

            this.showEditModal = true
        },

        openWelcome() {
            this.editContext = {
                type: 'message',
                title: 'Editar mensagem principal',
                fields: [
                    { key: 'welcome', type: 'textarea', label: 'Mensagem' }
                ],
                model: {
                    welcome: this.welcome
                }
            }

            this.showEditModal = true
        },

        openWarning() {
            this.warning = {
                id: null,
                text: ''
            }
            this.editContext = {
                type: "warning",
                title: 'Adicionar Aviso',
                fields: [
                    {
                        key: 'text', type: 'input', label: 'Aviso'
                    },
                ],
                model: {
                    text: this.warning.description
                }
            }

            this.showEditModal = true
        },

        editWarning(pWarning) {
            this.update = true;
            this.warning = pWarning
            this.editContext = {
                type: "warning",
                title: 'Editar Aviso',
                fields: [
                    {
                        key: 'text', type: 'input', label: 'Aviso'
                    },
                ],
                model: {
                    text: this.warning.description
                }
            }

            this.showEditModal = true
        },

        openInfs() {
            this.inf = {
                id: null,
                text: ''
            }
            this.editContext = {
                type: "inf",
                title: 'Adicionar Informação',
                fields: [
                    {
                        key: 'text', type: 'input', label: 'Informação'
                    },
                ],
                model: {
                    text: this.inf.description
                }
            }

            this.showEditModal = true
        },

        editInfs(pInf) {
            this.update = true
            this.inf = pInf
            this.editContext = {
                type: "inf",
                title: 'Editar Informação',
                fields: [
                    {
                        key: 'text', type: 'input', label: 'Informação'
                    },
                ],
                model: {
                    text: this.inf.description
                }
            }

            this.showEditModal = true
        },

        editEnder() {
            this.editContext = {
                type: "ender",
                title: 'Editar Endereço',
                fields: [
                    {
                        key: 'text', type: 'input', label: 'Endereço'
                    },
                ],
                model: {
                    text: this.ender.ender
                }
            }

            this.showEditModal = true;
        },

        openDeadLine() {
            this.deadline = this.deadline.slice(0, 10);
            this.editContext = {
                type: "deadline",
                title: 'Editar data de confirmação',
                fields: [
                    {
                        key: 'deadline', type: 'input', label: 'Confirmar até'
                    },
                ],
                model: {
                    deadline: this.deadline
                }
            }

            this.showEditModal = true;
        },

        async RemoveWarning(pWarning) {
            this.warning = { ...pWarning };
            await this.DeleteWarning();
            this.warnings = await this.GetWarnings();
        },

        async RemoveInf(pInf) {
            this.inf = { ...pInf };
            await this.DeleteInf();
            this.infs = await this.GetInfs();
        },

        async confirmPresence(pBool) {
            if (!this.isAdmin) {
                if (pBool) {
                    this.confirmed = 1;
                    await this.ConfirmGuest();
                }
                else {
                    this.confirmed = 2;
                    await this.ConfirmGuest();
                }
            }
        },

        goGift() {
            router.push('/gift')
        },

        async ToggleWarning() {
            this.showWarning = !this.showWarning;
            if (this.showWarning) {
                this.warnings = await this.GetWarnings();
            }
            this.UpdateGuestView();
        },

        async ToggleInf() {
            this.showInf = !this.showInf;
            if (this.showInf) {
                this.infs = await this.GetInfs();
                this.ender = await this.GetEnder();
            }
            this.UpdateGuestView();
        },

        async GetGuestView() {
            try {
                const response = await api.get('/getGuestView');
                if (response.data.hasData) {
                    return response.data;
                }
                return null;
            } catch (error) {
                console.error('Erro ao buscar informações da tela:', error);
                return null;
            }
        },

        async GetWarnings() {
            try {
                const response = await api.get('/getWarnings');
                if (response.data.hasData) {
                    return response.data.data;
                }
                return [];
            } catch (error) {
                console.error('Erro ao buscar os avisos:', error);
                return null;
            }
        },

        async GetInfs() {
            try {
                const response = await api.get('/getInfs');
                if (response.data.hasData) {
                    return response.data.data;
                }
                return [];
            } catch (error) {
                console.error('Erro ao buscar as informações:', error);
                return null;
            }
        },

        async GetEnder() {
            try {
                const response = await api.get('/getEnder');
                if (response.data.hasData) {
                    return response.data.data[0];
                }
                return null;
            } catch (error) {
                console.error('Erro ao buscar o endereço:', error);
                return null;
            }
        },

        async UpdateGuestView() {
            try {
                this.guestView.data[0].saudation = this.saudation
                this.guestView.data[0].subtitle = this.subtitle
                this.guestView.data[0].welcome = this.welcome
                this.guestView.data[0].deadline = this.deadline
                this.guestView.data[0].showinformation = this.showInf
                this.guestView.data[0].showwarning = this.showWarning

            const response = await api.put('/updateGuestView', { guestView: this.guestView.data[0] })
            if (response.data.sucesso) {
              return response.data;
            }
            else {
              return false;
            }
          }
          catch (e) {
            console.error('Erro ao alterar as informações da tela:', e);
            return false;
          }
        },

        async UpdateWarning() {
            try {
            const response = await api.put('/updateWarning', { warning: this.warning })
            if (response.data.sucesso) {
              return response.data;
            }
            else {
              return false;
            }
          }
          catch (e) {
            console.error('Erro ao alterar o aviso:', e);
            return false;
          }
        },

        async UpdateInf() {
            try {
            const response = await api.put('/updateInf', { inf: this.inf })
            if (response.data.sucesso) {
              return response.data;
            }
            else {
              return false;
            }
          }
          catch (e) {
            console.error('Erro ao alterar a informação:', e);
            return false;
          }
        },

        async UpdateEnder() {
            try {
            const response = await api.put('/updateEnder', { ender: this.ender })
            if (response.data.sucesso) {
              return response.data;
            }
            else {
              return false;
            }
          }
          catch (e) {
            console.error('Erro ao alterar a informação:', e);
            return false;
          }
        },

        async InsertWarning() {
            try {
                this.warning.guestViewId = this.guestView.data[0].id;
            const response = await api.post('/insertWarning', { warning: this.warning })
            if (response.data.sucesso) {
              return response.data;
            }
            else {
              return false;
            }
          }
          catch (e) {
            console.error('Erro ao adicionar aviso:', e);
            return false;
          }
        },

        async InsertInf() {
            try {
                this.inf.guestViewId = this.guestView.data[0].id;
            const response = await api.post('/insertInf', { inf: this.inf })
            if (response.data.sucesso) {
              return response.data;
            }
            else {
              return false;
            }
          }
          catch (e) {
            console.error('Erro ao adicionar informação:', e);
            return false;
          }
        },

        async DeleteWarning() {
            try {
            const response = await api.delete(`/deleteWarning/${this.warning.id}`)
            if (response.data.sucesso) {
              true;
            }
            else {
              return false;
            }
          }
          catch (e) {
            console.error('Erro ao excluir aviso:', e);
            return false;
          }
        },

        async DeleteInf() {
            try {
            const response = await api.delete(`/deleteInf/${this.inf.id}`)
            if (response.data.sucesso) {
              true;
            }
            else {
              return false;
            }
          }
          catch (e) {
            console.error('Erro ao excluir informação:', e);
            return false;
          }
        },

        async ConfirmGuest() {
            const guest = {
                confirmed: this.confirmed,
                id: this.guestId
            }

            try {
            const response = await api.put('/confGuest', { guest: guest })
            if (response.data.sucesso) {
              return response.data;
            }
            else {
              return false;
            }
          }
          catch (e) {
            console.error('Erro ao alterar a informação:', e);
            return false;
          }

        },
    }
}