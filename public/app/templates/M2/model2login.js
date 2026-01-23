export default `
<div class="hearts-bg">
  <span v-for="n in 20" :key="n">❤</span>
</div>

<div class="scene">

    <div class="container" :class="{ flip: !convidado }">

    <!-- FRENTE -->
    <div class="face face-front">

      <div class="cab">
        <h1>UniLuv</h1>
        <p class="subtitle">E serão ambos uma só carne</p>
      </div>

      <div id="error">
        <div class="input-group">
            <input type="text" id="txtNome" required>
            <label for="txtNome">Seu nome</label>
        </div>
        <span v-if="showErrorName" class="error-name">Nome incorreto ou não consta na lista</span>
      </div>

      <div class="container-buttons">
        <button class="btn-entrar" @click="Enter">Entrar</button>

        <div class="role-toggle">
          <span :class="{ active: convidado }">Convidado</span>

          <div class="switch"
               :class="{ active: !convidado }"
               @click="convidado = !convidado">
            <div class="thumb"></div>
          </div>

          <span :class="{ active: !convidado }">Noivo(a)</span>
        </div>
      </div>

    </div>

    <!-- VERSO -->
    <div class="face face-back">

      <div class="cab">
        <h1>UniLuv</h1>
        <p class="subtitle">Área dos Noivos</p>
      </div>

      <div id="error">
        <div class="input-group">
            <input type="password" id="txtSenha" required>
            <label for="txtSenha">Senha</label>
        </div>
        <span v-if="showErrorPass" class="error-name">Senha incorreta</span>
      </div>

      <div class="container-buttons">
        <button @click="Enter">Entrar</button>
        <div class="role-toggle">
          <span :class="{ active: convidado }">Convidado</span>

          <div class="switch"
               :class="{ active: !convidado }"
               @click="convidado = !convidado">
            <div class="thumb"></div>
          </div>

          <span :class="{ active: !convidado }">Noivo(a)</span>
        </div>
      </div>

    </div>

    </div>
    <div class="shadow" v-if="showNewPassword">
            <div class="conf-container" id="gift_confirm">
                <div class="conf-cab">
                    <h1 class="title-conf">Trocar senha</h1>
                    <button class="btn-close" @click="CloseConfirm">X</button>
                </div>
                <span>Escolha uma senha para acessar a área dos noivos</span>
                <div class="input-group" id="user">
                  <input type="password" class="login-pass" id="user-txt" v-model="marry.password" required />

                  <label class="login-pass">Senha</label>
                </div>
                <div class="conf-buttons">
                    <button class="btn-yes" @click="Confirm(true)">Salvar</button>
                    <button class="btn-no" @click="Confirm(false)">Cancelar</button>
                </div>
            </div>
        </div>
</div>
`