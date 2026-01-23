export default `
            <div class="presentes-page">
                <div class="headder">
                    <h1 id="titulo-prsnt">{{ titulo }}</h1>
                    <p id="texto">Nesta página, você encontrará uma lista dos presentes que escolhemos com muito carinho. Como estamos em um momento especial de organização, pedimos gentilmente o valor em vez do presente físico. <br><br> Assim, quando for possível, vamos adquirir cada item com a mesma alegria que vocês tiveram ao nos presentear. Agradecemos de coração pelo carinho e compreensão! <br> <br> Aviso: Se o valor do presente for alto, você pode contribuir com o valor que preferir. É só escolher o presente e clicar em “dar parte”.</p>
                </div>
                <div class="body">
                <div class="pesquisa">
                    <input id="search" type="text" v-model="termoBusca" placeholder="Buscar presente..." class="search-input">
                    <button v-if="acessoDev" id="btncriar" @click="CriarModalPresente">Criar Presente</button>
                </div>
                <div id="listapresentes" class="presentes">
                    <div v-for="presente in presentesFiltrados" :key="presente.id" class="presente-item" :class='{ "selecionado": presente.ValorPresente === "0" }'>
                        <img v-if="presente.Imagem" :src="presente.Imagem" :alt="presente.NomePresente" class="image">
                        <div class="presente-conteudo">
                            <h3 class="presente-nome">{{ presente.NomePresente }}</h3>
                            <p class="presente-descricao">{{ presente.DescPresente }}</p>
                            <p class="presente-valor">Valor: R$ {{ presente.ValorPresente }}</p>
                        </div>
                        <!-- <p v-if="direito" class="desenv">{{ presente.Convidados }}</p>
                        <p v-if="direito" class="desenv"> {{ presente.Valores}} </p> -->
                        <button v-if='presente.ValorPresente !== "0"' @click="selecionarPresente(presente)" class="btn-selecionar">Selecionar Presente</button>
                    </div>
                </div>
            </div>
            <div v-if="mostrarModalCriar" class="modal-overlay">
                <div class="conteiner-geral">
                    <div class="titulo-prsnt">
                        <h1 class="h1box-prsnt">Criar Presentes</h1>
                        <button class="botaofechar-prsnt" @click="mostrarModalCriar = false">X</button>
                    </div>
                    <div class="bodycp">
                        <div class="create">
                            <p class="lbl">Imagem</p>
                            <input  @change="handleImageUpload" type="file" accept="image/*" class="inpimg">
                            <p class="lbl">Nome</p>
                            <input v-model="novoPresente.nome" class="txt-prsnt" placeholder="Nome do Presente">
                            <span v-if="erros.nome" class="erro">{{ erros.nome }}</span>
                            <p class="lbl">Descrição</p>
                            <input v-model="novoPresente.descricao" class="txt-prsnt" placeholder="Descrição do Presente">
                            <p class="lbl">Valor</p>
                            <input v-model="novoPresente.valor" class="txt-prsnt" id="valor" placeholder="Valor do Presente" type="number">
                            <span v-if="erros.valor" class="erro">{{ erros.valor }}</span>
                        </div>
                        <div class="preview">
                            <div v-if="novoPresente.nome || novoPresente.descricao || novoPresente.valor || imagemFile" class="preview-item">
                                <div class="presente-item">
                                    <img v-if="imagemFile" :src="imagemFile" alt="Preview" class="image">
                                    <div class="presente-conteudo">
                                        <h4 class="presente-nome">{{ novoPresente.nome || "Nome do Presente" }}</h4>
                                        <p class="presente-descricao">{{ novoPresente.descricao || "Descrição do presente" }}</p>
                                        <p class="presente-valor">Valor: R$ {{ novoPresente.valor || "0,00" }}</p>
                                    </div>
                                </div>
                            </div>
                            <p v-else id="texto-else">Os dados do presente aparecerão aqui...</p>
                        </div>
                        <button id="adicionar" @click="adicionarPresente" :disabled="salvando"> {{ salvando ? 'Salvando...' : 'Salvar Presente' }}</button>
                    </div>
                </div>
            </div>
            <div v-if="mostrarModalSelecionado" class="modal-overlay">
                <div class="conteiner-geral">
                    <div class="titulo-prsnt">
                        <h1 class="h1box-prsnt" id="slc">Olá!</h1>
                        <button class="botaofechar-prsnt" @click="mostrarModalSelecionado = false">X</button>
                    </div>
                    <div class="conteudo">
                        <p>Ficamos felizes com sua generosidade e apoio para nossas futuras conquistas!</p>
                        <p>Agora me diga, você vai:</p>
                        <div class="botoes">
                            <button class="btn-repensar" @click="mostrarModalSelecionado = false"> Vou repensar</button>
                            <button class="btn-parte" @click="darParte">Dar parte do valor</button>
                            <button class="btn-total" @click="total">Dar o valor total</button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="mostrarModalParte" class="modal-overlay">
                <div class="conteiner-geral">
                    <div class="titulo-prsnt">
                        <h1 class="h1box-prsnt" id="slc">Certo!</h1>
                        <button class="botaofechar-prsnt" @click="mostrarModalParte = false">X</button>
                    </div>
                    <div class="conteudo" id="parte">
                        <p>agora me diga, quanto tem em mente?</p>
                        <input type="number" class="txt-prsnt" id="valordoacao" placeholder="Digite o valor" v-model="valorDoacao">
                        <span v-if="erros.Valor" class="erro">{{ erros.Valor }}</span>
                        <button class="btn-confirmar" @click="total">Confirmar</button>
                    </div>
                </div>
            </div>
            <div v-if="mostrarModalTotal" class="modal-overlay">
                <div class="conteiner-geral">
                    <div class="titulo-prsnt">
                        <h1 class="h1box-prsnt" id="slc">Muito obrigado!</h1>
                        <button class="botaofechar-prsnt" @click="mostrarModalTotal = false">X</button>
                    </div>
                        <div class="conteudo" id="total">
                            <p>agora estamos um passo mais proximo do nosso sonho, abaixo o QRcode caso queira nos dar agora o presente</p>
                            <img src="Images/qrcode.png" class="QRcode">
                            <p>ou então guarde nossa chave: eduardacornely@hotmail.com para pagamentos posteriores</p>
                            <button class="btn-feito" @click="mostrarModalTotal = false">Feito!</button>
                        </div>
                    </div>
                </div>
            </div>
`