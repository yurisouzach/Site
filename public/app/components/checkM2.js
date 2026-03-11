import template from '../templates/M2/model2Check.js';

export default {
    name: 'check',
    template,

    data() {
        return {
            isResetting: false,
            autoScrollInterval: null,
            autoScrollPaused: false,
            modalTitle: '',
            filterStatus: 'all',
            suggestions: [],
            checks: {
                data: [],
            },
            check: {
                title: '',
                description: '',
                duedate: null,
                done: false
            },
            showEditModal: false,
            update: false,
            api: window.axios.create({
                baseURL: '/',
                timeout: 50000,
            })
        }
    },

    beforeUnmount() {
        this.stopAutoScroll();
    },

    async mounted() {
        window.api = this.api;

        this.startAutoScroll();

        this.suggestions = await this.GetSugestions();

        this.checks = await this.GetChecks();
    },

    computed: {
        progressPercent() {
            if (this.totalChecks === 0) return 0
                return Math.round((this.checkDone / this.totalChecks) * 100)
        },

        filteredChecks() {
            if (this.filterStatus === 'pending')
                return this.checks.data.filter(c => !c.done).sort(c => c.duedate)

            if (this.filterStatus === 'done')
                return this.checks.data.filter(c => c.done).sort(c => c.duedate)

            return [...this.checks.data].sort((a, b) => {

                const aLate = this.isLate(a)
                const bLate = this.isLate(b)

                if (aLate !== bLate) return aLate ? -1 : 1

                if (a.done !== b.done) return a.done ? 1 : -1

                return new Date(a.duedate) - new Date(b.duedate)
            })
        },

        filteredSuggestions() {
            return this.suggestions.filter(
                sug => !this.suggestionExistsInChecklist(sug.title)
            );  
        },

        totalChecks() {
            return this.checks.count;
        },

        checkDone() {
            return this.checks.data.filter(c => c.done).length
        },    

        checkPending() {
            return this.checks.data.filter(c => !c.done).length
        },

        today() {
            const t = new Date()
            t.setHours(0, 0, 0, 0)
            return t
        },

    },

    methods: {

        startAutoScroll() {
            const el = this.$refs.suggestionCarousel;
            if (!el) return;

            this.autoScrollInterval = setInterval(() => {
            if (this.autoScrollPaused || this.isResetting) return;

                el.scrollLeft += 0.5;

                if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 1) {
                    this.isResetting = true;
                    el.scrollTo({ left: 0, behavior: 'smooth' });

                    setTimeout(() => {
                        this.isResetting = false;
                    }, 600);
                }
            }, 10);
        },

        stopAutoScroll() {
            clearInterval(this.autoScrollInterval);
            this.autoScrollInterval = null;
        },

        pauseAutoScroll() {
            this.autoScrollPaused = true;
        },

        resumeAutoScroll() {
            this.autoScrollPaused = false;
        },

        formatDate(pDate) {
            if (!pDate) return ''
                return new Date(pDate).toLocaleDateString('pt-BR')
        },

        normalize(text) {
            return text
                .toLowerCase()
                .normalize('NFD')
                .replace(/\b(definir|contratar|escolher|organizar|comprar)\b/g, '')
                .replace(/[\u0300-\u036f]/g, '') // remove acentos
                .replace(/[^a-z0-9\s]/g, '')    // remove símbolos
                .trim();
        },

        suggestionExistsInChecklist(suggestionTitle) {
            const sug = this.normalize(suggestionTitle);

            return this.checks.data.some(item => {
                const itemText = this.normalize(item.title).trim();
                if (!itemText) return false
                return itemText.includes(sug) || sug.includes(itemText);
            });
        },


        async addCheckFromSuggestion(pSugestion) {
            let title = pSugestion.title;
            const due = new Date()
            due.setDate(due.getDate() + 30)
            this.check = {
                title: title,
                description: '',
                duedate: due,
                done: false
            }
            await this.InsertCheck();
            this.checks = await this.GetChecks();
        },

        openEditCheck(check) {
            this.check = { ...check }
            this.check.duedate = this.check.duedate.slice(0, 10);
            this.update = true
            this.openNewCheck()
        },

        async ChangeCheck(pCheck) {
            this.check = { ...pCheck }
            this.check.duedate = this.check.duedate.slice(0, 10);
            this.check.done = !this.check.done;
            await this.UpdateCheck();
        },

        closeModal() {
            this.showEditModal = false
            this.update = false
        },

        isLate(check) {
            if (check.done || !check.duedate) return false
            return new Date(check.duedate) < this.today
        },

        openNewCheck() {
            if (!this.check.done || !this.update) {
                if (!this.update) {
                    this.check.title = '';
                    this.check.description = '';
                    this.check.duedate = ''; 
                    this.check.done = false;  
                    this.modalTitle = 'Nova tarefa';
                }
                else {
                    this.modalTitle = 'Editar tarefa';
                }
                this.showEditModal = true;
            }
        },

        async removeCheck(pCheck) {
            this.closeModal();
            this.check = { ...pCheck };
            await this.DeleteCheck();
            this.checks = await this.GetChecks();
        },

        async saveCheck() {
            if (!this.update) {
                if (!this.check.title.trim() || !this.check.duedate) return
            
                await this.InsertCheck();
            }
            else {
                if (!this.check.title.trim() || !this.check.duedate) return

                await this.UpdateCheck();
            }

            this.checks = await this.GetChecks();
            this.closeModal(true)
        },

        async GetChecks() {
            try {
            const response = await api.get('/getChecks');
            if (response.data.hasData) {
              return response.data;
            }
            return {
                data: [],
                count: 0
            };
          } catch (error) {
            console.error('Erro ao buscar tarefas:', error);
            return null;
          }
        },

        async UpdateCheck()  {
          try {
            const response = await api.put('/updateCheck', { check: this.check })
            if (response.data.sucesso) {
              return response.data;
            }
            else {
              return false;
            }
          }
          catch (e) {
            console.error('Erro ao salvar alterações da tarefa:', e);
            return false;
          }
        },

        async InsertCheck() {
          try {
            const response = await api.post('/saveCheck', { check: this.check })
            if (response.data.sucesso) {
              return response.data;
            }
            else {
              return false;
            }
          }
          catch (e) {
            console.error('Erro ao salvar tarefa:', e);
            return false;
          }
        },

        async DeleteCheck() {
          try {
            const response = await api.delete(`/deleteCheck/${this.check.id}`)
            if (response.data.sucesso) {
              true;
            }
            else {
              return false;
            }
          }
          catch (e) {
            console.error('Erro ao excluir tarefa:', e);
            return false;
          }
        },

        async GetSugestions() {
            try {
                const response = await api.get('/getSugestions');
                if (response.data.hasData) {
                    return response.data.data;
                }
                return null;
            } catch (error) {
                console.error('Erro ao buscar sugestões:', error);
                return null;
            }
        }
    }
}