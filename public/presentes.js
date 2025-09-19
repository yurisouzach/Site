const { ref, computed, onMounted } = Vue;

const presentesComponent = {
    template: document.getElementById("presentes-template").innerHTML,
    setup() {
        //controle de acesso
         const userRole = ref(localStorage.getItem('userRole'));
         const acessoDev = computed(() => {
            return userRole.value !== 'convidado';
        });
        //titulo
        const titulo = ref('Bem vindo Fulano!');
        //telas
        const mostrarModalCriar = ref(false);
        const mostrarModalSelecionado = ref(false);
        const mostrarModalParte = ref(false);
        const mostrarModalTotal = ref(false);
        //propriedades
        const salvando = ref(false);
        const erros = ref({});
        const presentes = ref([]);
        const presenteSelecionado = ref(null);
        const valorDoacao = ref(0);
        const imagemFile = ref(null);
        const imagemArquivo = ref(null);
        const novoPresente = ref({
            nome: '',
            descricao: '',
            valor: '',
            imagem: ''
        });

         const api = window.axios.create({
            baseURL: 'https://site-production-a8bd-casamento.up.railway.app/',
            //baseURL: 'http://localhost:3000/',
            timeout: 5000,
        });

        const termoBusca = ref('');

        //lista provisoria
        const carregarPresentes = async () => {
            try {
                const response = await api.get('/ObterPresentes')
                if (response.data.hasData) {
                    presentes.value = response.data.data
                }
                else {
                    presentes.value = [];
                }
            }
            catch (error) {
                console.error('Erro ao buscar presentes:', error);
                presentes.value = [];
            }
        }

        const validarFormulario = () => {
            if (!novoPresente.value.nome?.trim()) {
                erros.value.nome = 'Nome é obrigatório';
            }
  
            if (!novoPresente.value.valor || parseFloat(novoPresente.value.valor) <= 0) {
                erros.value.valor = 'Valor deve ser maior que zero';
            }
  
            return Object.keys(erros.value).length === 0;
        };

        onMounted(() => {
            carregarPresentes();
        });

        //metodos
        const presentesFiltrados = computed(() => {
            if (!termoBusca.value) return presentes.value;
            const termo = termoBusca.value.toLowerCase();
            return presentes.value.filter(presente => 
                presente.NomePresente.toLowerCase().includes(termo) || 
                presente.DescPresente.toLowerCase().includes(termo)
            );
        });
        
        const CriarModalPresente = () => {
            mostrarModalCriar.value = true;
        }

        const adicionarPresente = async () => {
            erros.value = {};
    
            if (!validarFormulario()) {
                return;
            }
            try {
                salvando.value = true;
                const formData = new FormData();
                formData.append('nome', novoPresente.value.nome);
                formData.append('descricao', novoPresente.value.descricao || '');
                formData.append('valor', novoPresente.value.valor);
                if (imagemArquivo.value) {
                    formData.append('imagem', imagemArquivo.value);
                }

                const req = await api.post('/SalvarPresente', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                
                if (req.data.sucesso) {
                    novoPresente.value = {
                        nome: '',
                        descricao: '',
                        valor: '',
                        imagem: ''
                    };
                    imagemFile.value = null;
                    imagemArquivo.value = null;
                    mostrarModalCriar.value = false;
                    await carregarPresentes();
                }
                else {
                    alert('Erro ao salvar presente: ' + response.data.error);
                }
            }
            catch (e) {
                console.error('Erro ao adicionar presente:', e);
                alert('Erro ao salvar presente: ' + e.message);
            }
            finally {
                salvando.value = false;
            }
        }

        const handleImageUpload = (event) => {
            const file = event.target.files[0];
            if (file) {
                imagemArquivo.value = file;
                const reader = new FileReader();
                reader.onload = (e) => {
                    imagemFile.value = e.target.result; // Atualiza a imagemPreview
                };
                reader.readAsDataURL(file);
            } else {
                imagemFile.value = null;
            }
        };

        
        const selecionarPresente = (presente) => {
            presenteSelecionado.value= presente;
            mostrarModalSelecionado.value = true;
        };

        const darParte = () => {
            mostrarModalSelecionado.value = false;
            mostrarModalParte.value = true
        };

        const total = async () => {
            if (valorDoacao.value > presenteSelecionado.value.ValorPresente) {
                return erros.value.Valor = "Valor deve ser menor ou igual ao valor do presente."
            }
            mostrarModalSelecionado.value = false;
            if (mostrarModalParte.value) {
                if (valorDoacao.value === 0) {
                    return erros.value.Valor = "Valor deve ser maior que zero."
                }
                mostrarModalParte.value = false;
                try {

                    const req = await api.put('/DoarParte', null, { params: { valordoado: valorDoacao.value, usuario: "ver como pegar", cdPresente: presenteSelecionado.value.cdPresente } });
                    if (req.data.sucesso) {
                        valorDoacao.value = 0;
                        await carregarPresentes();
                    }
                    else {
                        alert('Erro ao salvar presente: ' + response.data.error);
                    }
                }
                catch (e) {
                    console.error('Erro ao dar valor parcial:', e);
                    alert('Erro ao dar valor parcial: ' + e.message);
                }
            }
            else {
                try {

                    const req = await api.put('/DoarTotal', null, { params: { valorDaodo: presenteSelecionado.value.ValorPresente, usuario: "ver como pegar", cdPresente: presenteSelecionado.value.cdPresente}})
                    if (req.data.sucesso) {
                        await carregarPresentes();
                    }
                    else {
                        alert('Erro ao salvar presente: ' + response.data.error);
                    }
                }
                catch (e) {
                    console.error('Erro ao dar valor total:', e);
                    alert('Erro ao dar valor total: ' + e.message);
                }
            }
            mostrarModalTotal.value = true;
        }

        return { 
            titulo,
            termoBusca,
            novoPresente,
            imagemFile,
            presentesFiltrados,
            mostrarModalCriar,
            mostrarModalSelecionado,
            mostrarModalParte,
            mostrarModalTotal,
            userRole,
            acessoDev,
            erros,
            salvando,
            valorDoacao,
            total,
            darParte,
            selecionarPresente,
            CriarModalPresente,
            adicionarPresente,
            handleImageUpload,
        };
    }
}

export default presentesComponent;
