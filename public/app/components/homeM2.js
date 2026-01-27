import template from '../templates/M2/model2Home.js';
import Router from '../router.js';

export default {
    name: 'home',
    template,

    data() {
      return {
        api: window.axios.create({
          baseURL: '/',
          timeout: 50000,
        }),
        nextSteps: [],
        guests: {},
        numInvited: 0,
        confirmedGuests: 0,
        gifts: {},
        presentAvaliable: 0,
        giftsChosen: 0,
        checks: {},
        totalChecks: 20,
        checkPending: 10,
        checkDone: 0,
        marryDate: new Date(localStorage.getItem('marryDate').slice(0,10)),
        now: new Date(),
        status: "",
        subStatus: "",
      }
  },

  async mounted() {
    window.api = this.api;

    this.guests = await this.GetGuests();
    this.numInvited = this.guests != null ? this.guests.count : 0;
    this.confirmedGuests = this.guests != null ? this.guests.data.filter(x => x.confirmed === 1).length : 0

    this.gifts = await this.GetGifts();
    this.presentAvaliable = this.gifts != null ? this.gifts.data.filter(x => x.reservedby === null).length : 0;
    this.giftsChosen = this.gifts != null ? this.gifts.data.filter(x => x.reservedby != null).length : 0;

    this.checks = await this.GetChecks();
    this.totalChecks = this.checks != null ? this.checks.count : 0;
    this.checkPending = this.checks != null ?  this.checks.data.filter(x => !x.done).length : 0
    const checksDone = this.totalChecks - this.checkPending
    if (checksDone > 0)
        this.checkDone = Math.round((checksDone / this.totalChecks) * 100);
    else
        this.checkDone = 0;

    let scrollTimeout

    window.addEventListener('scroll', () => {
    document.body.classList.add('show-scrollbar')

    clearTimeout(scrollTimeout)
    scrollTimeout = setTimeout(() => {
        document.body.classList.remove('show-scrollbar')
        }, 800)
    })

    this.timer = setInterval(() => {
        this.updateNow()
    }, 1000 * 60 * 60)



    let lastId = 0
    let templist = []

    if (this.numInvited < 15) {
        let item = {
            id: lastId++,
            text: 'Adicionar convidados'
        }
        templist.push(item);
    }
    if (this.presentAvaliable < 5) {
        let item = {
            id: lastId++,
            text: 'Adicionar Presentes'
        }
        templist.push(item);
    }
    if (this.checkPending > 10) {
        let item = {
            id: lastId++,
            text: 'Realizar tarefas'
        }
        templist.push(item);
    }
    if (this.daysCountdown < 20 && (this.confirmedGuests / this.numInvited) > 0.5) 
    {
        let item = {
            id: lastId++,
            text: 'Mandar confirmação aos convidados'
        }
        templist.push(item);
    }
    if (this.daysCountdown < 10) {
        let item1 = {
            id: lastId++,
            text: 'O grande dia se aproxima!'
        }
        templist.push(item1);
        let item2 = {
            id: lastId++,
            text: 'Apenas descanse enquanto o seu dia chegue!'
        }
        templist.push(item2);
        let item3 = {
            id: lastId++,
            text: 'Tudo vai dar certo!'
        }
        templist.push(item3);
    }
    else {
        let item1 = {
            id: lastId++,
            text: 'Verifique os convidados'
        }
        templist.push(item1);
        let item2 = {
            id: lastId++,
            text: 'Verifique os presentes'
        }
        templist.push(item2);
        let item3 = {
            id: lastId++,
            text: 'Verifique o check-list'
        }
        templist.push(item3);
    }
    this.nextSteps = templist.slice(0,3);

    if (this.checkDone === 100) {
        this.status = 'Planejamento concluído';
        this.subStatus = '✨ Tudo pronto para celebrar o grande dia!'
    }
    else if (this.checkDone > 0) {
        this.status = 'Planejamento em andamento'
        if (this.checkDone > 80) {
            this.subStatus = '💗 Quase tudo pronto — agora só os últimos detalhes'
        }
        else {
            this.subStatus = '💗 Cada detalhe está sendo cuidado com carinho'
        }
    }
    else {
        this.status = 'Planejamento não iniciado'
        this.subStatus = '💍 Comece agora a planejar cada detalhe do seu grande dia'
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
  }
},

  methods: {
    GoGuest() {
        Router.push('/user');
    },
 
    GoGift() {
        localStorage.setItem('isAdmin', true);
        localStorage.setItem('userName', "Noivo(a)");
        Router.push('/gift');
    },

    GoCheck() {
        Router.push('/check');
    },

    GoEditView() {
        router.push('/homeGuest')
    },

    UpdateNow() {
        this.now = new Date()
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

    async GetGifts() {
        try {
            const response = await api.get('/getGifts');
            if (response.data.hasData) {
                return response.data;
            }
            return null;
        }
        catch(e) {
            console.error('Erro ao buscar presentes:', e);
            return null;
        }
    },

    async GetChecks() {
        try {
            const response = await api.get('/getChecks');
            if (response.data.hasData) {
                return response.data;
            }
            return null;
        }
        catch(e) {
            console.error('Erro ao buscar check-list:', e);
            return null;
        }
    }
  }

}