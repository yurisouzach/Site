const { createApp, ref, computed } = Vue;
var Titulo = document.querySelector("#titulo");
var pesquisa = document.querySelector("#pesquisa");
var lista = document.querySelector("#listapresentes");

const presentesComponent = {
    setup() {
        const titulo = ref('Bem vindo Fulano!');
        const mostrarModal = ref(false);
        const imagemFile = ref(null);
        const novoPresente = ref({
            nome: '',
            descricao: '',
            valor: ''
        });
        const termoBusca = ref('');
        const presentes = ref([
            // Exemplo de dados - substitua pelos seus presentes reais
            { id: 1, nome: "Jantar Romântico", descricao: "Um jantar especial para duas pessoas", valor: 150.00, imagem: "./Images/fundo.jpg" },
            { id: 2, nome: "Cama Queen Size", descricao: "Cama de casal de ótima qualidade", valor: 1200.00, imagem: "./Images/fundo.jpg" },
            { id: 3, nome: "Cama Queen Size", descricao: "Cama de casal de ótima qualidade", valor: 1200.00, imagem: "./Images/fundo.jpg" },
            { id: 4, nome: "Cama Queen Size", descricao: "Cama de casal de ótima qualidade", valor: 1200.00, imagem: "./Images/fundo.jpg" },
            { id: 5, nome: "Cama Queen Size", descricao: "Cama de casal de ótima qualidade", valor: 1200.00, imagem: "./Images/fundo.jpg" },
            { id: 6, nome: "Cama Queen Size", descricao: "Cama de casal de ótima qualidade", valor: 1200.00, imagem: "./Images/fundo.jpg" },
            { id: 7, nome: "Cama Queen Size", descricao: "Cama de casal de ótima qualidade", valor: 1200.00, imagem: "./Images/fundo.jpg" },
            { id: 8, nome: "Cama Queen Size", descricao: "Cama de casal de ótima qualidade", valor: 1200.00, imagem: "./Images/fundo.jpg" },
            { id: 9, nome: "Cama Queen Size", descricao: "Cama de casal de ótima qualidade", valor: 1200.00, imagem: "./Images/fundo.jpg" },
            { id: 10, nome: "Cama Queen Size", descricao: "Cama de casal de ótima qualidade", valor: 1200.00, imagem: "./Images/fundo.jpg" },
            // Adicione mais itens conforme necessário
        ]);

        const presentesFiltrados = computed(() => {
            if (!termoBusca.value) return presentes.value;
            const termo = termoBusca.value.toLowerCase();
            return presentes.value.filter(presente => 
                presente.nome.toLowerCase().includes(termo) || 
                presente.descricao.toLowerCase().includes(termo)
            );
        });

        const CriarModalPresente = () => {
            mostrarModal.value = true;
        }

        const adicionarPresente = () => {

        }

        const handleImageUpload = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    imagemFile.value = e.target.result; // Atualiza a imagemPreview
                };
                reader.readAsDataURL(file);
            } else {
                imagemFile.value = null;
            }
        };

        return { titulo, termoBusca, presentesFiltrados, CriarModalPresente, mostrarModal, novoPresente, adicionarPresente, handleImageUpload, imagemFile };
    }
}

export default presentesComponent;

if (typeof window !== 'undefined') {
  const app = createApp(presentesComponent);
  app.mount('#app');
}
