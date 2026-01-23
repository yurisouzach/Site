export default `
    <div class="contcab">
        <h1 class="titulocab">Bem vindo ao casamento de Yuri e Eduarda</h1>
    </div>
    <div class="container">
        <h1 id="h1b">LISTA DE PRESENTES</h1>
        <button class="botao" id="bb1" @click="abrirModalAdmin">Entrar como Noivo/Noiva</button>
        <button class="botao" id="bb2" @click="abrirModalConvidado">Entrar como Convidado</button>
        <h1 id="h1b">CONFIRMAR PRESENÇA</h1>
        <button class="botao" id="bb3" @click="abrirModalConfirmacao">Confirmar Presença</button>
    </div>
`