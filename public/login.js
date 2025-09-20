"use strict";
const { createApp } = Vue;
import Router from './router.js'
import App from './app.js';

const loginComponent = {
  data() {
      return {
          senhaDev: "",
          nomeConv: null,
          api: window.axios.create({
              baseURL: 'https://casamento.up.railway.app/',
              //baseURL: 'http://localhost:3000/',
              timeout: 50000,
          })
      }
  },
  template: document.getElementById("login-template").innerHTML,
  methods: {
    abrirModalAdmin() {
      this.criarModal("INSIRA A SENHA", "Insira a senha de desenvolvedor", "Senha incorreta.", "");
    },
    abrirModalConvidado() {
      this.criarModal("INSIRA SEU NOME", "Insira seu nome", "Nome incorreto ou não consta na lista.", "");
    },
    abrirModalConfirmacao() {
      this.criarModal("INSIRA SEU NOME", "Insira seu nome para confirmar", "Nome incorreto ou não consta na lista.", "Sua presença é especial para nós! Confirme apenas se ter a certeza que irá comparecer.");
    },

    criarModal(pTitulo, pPlaceholder, pMensagemErro, pMensagemConfirmacao) {
      const novaDiv = document.createElement('div');
      novaDiv.id = "senha";
      novaDiv.innerHTML = `
        <div class="containersenha">
          <div class="titulo">
            <h1 id="h1b" class="h1box">${pTitulo}</h1>
            <button class="botaofechar">X</button>
          </div>
          <div class="bodybox">
            <p class="aviso-conf">${ pMensagemConfirmacao}</p>
            <input class="txtSenha" placeholder="${pPlaceholder}">
            <p class="invalido">${pMensagemErro}</p>
            <button id="confirmar">Confirmar</button>
          </div>
        </div>
      `;
            
      document.body.append(novaDiv);
      this.configurarModal(novaDiv, pTitulo, pPlaceholder, this);
    },

    configurarModal(novaDiv, pTitulo, pPlaceholder, pSelf) { 
      setTimeout(() => {
        const meuInput = novaDiv.querySelector('.txtSenha');
        const botaofechar = novaDiv.querySelector(".botaofechar");
        const botaoConfirmar = novaDiv.querySelector("#confirmar");

        if (meuInput) {
          meuInput.addEventListener('keyup', async (event) => {
            if (event.key === 'Enter') {
              await pSelf.processarInput(pTitulo, pPlaceholder, meuInput.value, novaDiv, pSelf);
            }
          });
        }
                
        if (botaofechar) {
          botaofechar.addEventListener("click", () => {
            pSelf.fechar(novaDiv);
          });
        }
                
        if (botaoConfirmar) {
          botaoConfirmar.addEventListener("click", async () => {
            await pSelf.processarInput(pTitulo, pPlaceholder, meuInput.value, novaDiv, pSelf);
          });
        }
      }, 0);
    },

    CriarModalManut() {
      const divmanut = document.createElement('div');
      divmanut.id = "resposta";
      divmanut.innerHTML = `
        <div class="containersenha">
          <div class="titulo">
            <h1 id="h1b" class="h1box">AVISO</h1>
            <button class="botaofechar" id="res">X</button>
          </div>
          <div class="bodybox">
            <p class="texto">Só mais um pouco, ainda estamos trabalhando na lista de presentes</p>
            <button class="ok">OK</button>
          </div>
        </div>
      `;
            
      document.body.append(divmanut);
      this.configurarMensagem(divmanut);
    },

    async processarInput(pTitulo, pPlaceholder, pValor, novaDiv, pSelf) {
      let retorno;
            
      if (pTitulo === "INSIRA A SENHA") {
        retorno = await pSelf.validarSenha(pValor, novaDiv, pSelf);
        if (retorno) {
          pSelf.fechar(novaDiv);
          localStorage.setItem('userRole', "Noivo/Noiva");
          Router.push('/presentes');
          //pSelf.CriarModalManut();
        }
      } 
      else if (pTitulo === "INSIRA SEU NOME" && pPlaceholder === "Insira seu nome") {
        retorno = await pSelf.validarConvidado(pValor, novaDiv, false);
        if (retorno) {
          pSelf.fechar(novaDiv);
          localStorage.setItem('userRole', "convidado");
          localStorage.setItem('userName', pSelf.nomeConv.nome);
          Router.push('/presentes');
        //pSelf.CriarModalManut();
        }
      }
      else if (pPlaceholder === "Insira seu nome para confirmar") {
        retorno = await pSelf.validarConvidado(pValor, novaDiv, true);
        if (retorno && !pSelf.nomeConv.confirmado) {
          const confirmado = await pSelf.validarConfirmacao(pValor, novaDiv, pSelf);
          if (confirmado) {
            pSelf.mostrarMensagemSucesso("Convidado confirmado com sucesso!");
          }
        }
        else if (pSelf.nomeConv?.confirmado) {
          pSelf.mostrarMensagemSucesso("Convidado já confirmado!");
        }
      }

      if (!retorno) {
        pSelf.mostrarErro(novaDiv);
      }
    },

    mostrarErro(novaDiv) {
      const erro = novaDiv.querySelector(".invalido");
      if (erro && !erro.classList.contains("mostrar")) {
        erro.classList.add("mostrar");
      }
    },

    mostrarMensagemSucesso(mensagem) {
      const divRes = document.createElement('div');
      divRes.id = "resposta";
      divRes.innerHTML = `
        <div class="containersenha">
          <div class="titulo">
            <h1 id="h1b" class="h1box">SUCESSO</h1>
            <button class="botaofechar" id="res">X</button>
          </div>
          <div class="bodybox">
            <p class="texto">${mensagem}</p>
            <button class="ok">OK</button>
          </div>
        </div>
      `;
            
      document.body.append(divRes);
      this.configurarMensagem(divRes);
    },

    configurarMensagem(divRes) {
      setTimeout(() => {
        const botaoFecharRes = divRes.querySelector("#res");
        const botaoOk = divRes.querySelector(".ok");
                
        const fechar = () => this.fechar(divRes);
                
        if (botaoFecharRes) botaoFecharRes.addEventListener("click", fechar);
        if (botaoOk) botaoOk.addEventListener("click", fechar);
      }, 0);
    },

    async validarConfirmacao(pValor, pElemento) {
      //let nome = this.processarNome(pValor);
      this.nomeConv = await this.ConfirmarConvidado(nome);
      return this.nomeConv?.nome != null && this.nomeConv?.sucesso;
    },

    async validarConvidado(pValor, pElemento, pConfirmando = false) {
      //let nome = this.processarNome(pValor);
      this.nomeConv = await this.BuscarConvidado(pValor);
      
      if (this.nomeConv?.length > 1) {
        this.nomeConv = await this.CriarModalNomeDuplicado(this)
      }

      if (this.nomeConv?.confirmado) {
        return true;
      }
      else if (this.nomeConv && !this.nomeConv.confirmado && !pConfirmando) {
        this.mostrarDivConfirmacao(pValor, pElemento);
        return false;
      }
      else if (pConfirmando !== false)
        return true;
      else
        return false;
    },

    CriarModalNomeDuplicado(pSelf) {
      return new Promise((resolve) => {
      const divNaoConfirmado = document.createElement('div');
      divNaoConfirmado.id = "escolherNome";
      divNaoConfirmado.innerHTML = `
        <div class="containersenha">
          <div class="titulo">
            <h1 id="h1b" class="h1box">QUAL SEU SOBRENOME?</h1>
            <button class="botaofechar">X</button>
          </div>
          <div class="bodybox">
            <p class="texto">Opa, encontrei dois convidados com esse nome, quem é você?</p>
            <button id="nome0" class="cancelar">${pSelf.nomeConv[0].nome}</button>
            <button id="nome1" class="confirmar">${pSelf.nomeConv[1].nome}</button>
          </div>
        </div>
      `;
            
      document.body.append(divNaoConfirmado);
      this.configurarDialogoNomeDup(divNaoConfirmado, resolve, pSelf);
      });
    },

    configurarDialogoNomeDup(pElemento, resolve, pSelf) {
        const botaoFechar = pElemento.querySelector(".botaofechar");
        const nome1 = pElemento.querySelector("#nome1");
        const nome0 = pElemento.querySelector("#nome0");
                
        const fechar = () =>  {
          pElemento.remove();
          resolve(null);
        }
                
        if (botaoFechar) botaoFechar.addEventListener("click", fechar);
                
        if (nome1) {
          nome1.addEventListener("click", () => {
            pElemento.remove();
            resolve(pSelf.nomeConv[1]);
          });
        }
        if (nome0) {
          nome0.addEventListener("click", () => {
            pElemento.remove();
            resolve(pSelf.nomeConv[0]);
          });
        }
    },

    mostrarDivConfirmacao(pValor, pElemento) {
      this.fechar(pElemento);
      const divNaoConfirmado = document.createElement('div');
      divNaoConfirmado.id = "naoConfirmado";
      divNaoConfirmado.innerHTML = `
        <div class="containersenha">
          <div class="titulo">
            <h1 id="h1b" class="h1box">NÃO CONFIRMADO</h1>
            <button class="botaofechar">X</button>
          </div>
          <div class="bodybox">
            <p class="texto">Você não confirmou sua presença, deseja confirmar?</p>
            <button class="cancelar">Não</button>
            <button class="confirmar">Sim</button>
          </div>
        </div>
      `;
            
      document.body.append(divNaoConfirmado);
      this.configurarDialogoConfirmacao(divNaoConfirmado, pValor);
    },

    configurarDialogoConfirmacao(pDiv, pValor) {
      var self = this;
      setTimeout(() => {
        const botaoFechar = pDiv.querySelector(".botaofechar");
        const botaoConfirmar = pDiv.querySelector(".confirmar");
        const botaoCancelar = pDiv.querySelector(".cancelar");
                
        const fechar = () => self.fechar(pDiv);
                
        if (botaoFechar) botaoFechar.addEventListener("click", fechar);
                
        if (botaoConfirmar) {
          botaoConfirmar.addEventListener("click", async () => {
            fechar();
            await self.ConfirmarConvidado(pValor);
            localStorage.setItem('userRole', "convidado");
            localStorage.setItem('userName', self.nomeConv.nome);
            Router.push('/presentes');
            //pSelf.CriarModalManut();
          });
        }
                
        if (botaoCancelar) {
          botaoCancelar.addEventListener("click", () => {
            fechar();
            localStorage.setItem('userRole', "convidado");
            localStorage.setItem('userName', self.nomeConv.nome);
            Router.push('/presentes');
            //pSelf.CriarModalManut();
          });
        }
      }, 0);
    },

    // processarNome(pNomeCompleto) {
    //   const preposicoes = ["de", "da", "das", "do", "dos", "e"];
    //   const partesNome = pNomeCompleto
    //   .split(" ")
    //   .filter(parte => !preposicoes.includes(parte.toLowerCase()));

    //   const primeiroNome = partesNome[0];
    //   const sobrenome = partesNome[1];
    //   const inicialSobrenome = sobrenome ? `${sobrenome.charAt(0)}.` : "";

    //   return primeiroNome + " " + inicialSobrenome;
    // },

    async validarSenha(pValor, pElemento, pSelf) {
      this.senhaDev = await this.buscarDadosDev();
            
      if (this.senhaDev === null) {
        this.mostrarDialogoSenha(pElemento, pSelf);
      }
      return this.senhaDev === pValor;
    },

    mostrarDialogoSenha(pElemento, pSelf) {
      this.fechar(pElemento);
      const divNovaSenha = document.createElement('div');
      divNovaSenha.id = "novasenha";
      divNovaSenha.innerHTML = `
        <div class="containersenha">
          <div class="titulo">
            <h1 id="h1b" class="h1box">SENHA NÃO DEFINIDA</h1>
            <button class="botaofechar">X</button>
          </div>
          <div class="bodybox">
            <p class="texto">Insira uma senha</p>
            <input class="txtSenha" placeholder="Nova senha">
            <button id="confirmar">Confirmar</button>
          </div>
        </div>
      `;
            
      document.body.append(divNovaSenha);
      this.configurarDialogoSenha(divNovaSenha, pSelf);
    },

    configurarDialogoSenha(pDiv, pSelf) {
      setTimeout(() => {
        const botaofechar = pDiv.querySelector(".botaofechar");
        const input = pDiv.querySelector(".txtSenha");
        const botaoConfirmar = pDiv.querySelector("#confirmar");
                
        const fechar = () => pSelf.fechar(pDiv);
        const confirmar = async () => {
          if (input.value) {
            pSelf.senhaDev = input.value;
            await pSelf.SalvarSenha(pSelf.senhaDev);
            fechar();
            localStorage.setItem('userRole', "Noivo/Noiva");
            Router.push('/presentes');
            //pSelf.CriarModalManut();
          }
        };
                
        if (botaofechar) botaofechar.addEventListener("click", fechar);
                
        if (input) {
          input.addEventListener('keyup', async(event) => {
            if (event.key === 'Enter') confirmar();
          });
        }
                
        if (botaoConfirmar) {
          botaoConfirmar.addEventListener("click", confirmar);
        }
      }, 0);
    },

    fechar(pElemento) {
      if (pElemento) pElemento.remove();
    },

    async buscarDadosDev() {
      try {
        const response = await api.get('/dadosDev');
        if (response.data.hasData) {
          return response.data.data[0].senha;
        }
        return null;
      } catch (error) {
        console.error('Erro ao buscar senha:', error);
      return null;
      }
    },

    async SalvarSenha(pSenha) {
      try {
        const response = await api.post('/SalvarSenha', null, { params: { senha: pSenha } });
        console.log(response);
        if (response.data.sucesso){
          return true;
        }
        else {
          return false;
        }
      }
      catch (e) {
        console.error("erro ao salvar a senha:", e)
      }
    },

    async BuscarConvidado(pNome) {
      try {
        const response = await api.get('/getConvidado', {
          params: { nome: pNome }
        });
        if (response.data.hasData) {
          return response.data.data;
        }
        return null;
      } catch (error) {
        console.error('Erro ao buscar convidado:', error);
        return null;
      }
    },

    async ConfirmarConvidado (pNome) {
      try {
        const response = await api.put('/ConfirmaConvidado', null, { params: { Nome: pNome } })
        if (response.data.sucesso) {
          return response.data;
        }
        else {
          return false;
        }
      }
      catch (e) {
        console.error('Erro ao confirmar convidado:', e);
        return false;
      }
    }
  },
  mounted() {
    window.api = this.api;
  }
}

export default loginComponent;

// const app = Vue.createApp(loginComponent);
// app.mount('#app');