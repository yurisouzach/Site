const { createApp, ref, computed } = Vue;
var Titulo = document.querySelector("#titulo");
var pesquisa = document.querySelector("#pesquisa");
var lista = document.querySelector("#listapresentes");

const presentesComponent = {
    setup() {
        const titulo = ref('Bem vindo Fulano!');
        const termoBusca = ref('');
        const presentes = ref([
            // Exemplo de dados - substitua pelos seus presentes reais
            { id: 1, nome: "Jantar Romântico", descricao: "Um jantar especial para duas pessoas", valor: 150.00 },
            { id: 2, nome: "Cama Queen Size", descricao: "Cama de casal de ótima qualidade", valor: 1200.00 },
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

        const CriarModalPresente = computed(() => {
            
        })

        return { titulo, termoBusca, presentesFiltrados, CriarModalPresente };
    }
}

export default presentesComponent;

if (typeof window !== 'undefined') {
  const app = createApp(presentesComponent);
  app.mount('#app');
}
