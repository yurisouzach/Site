export default `
<div class="home">
    <div class="container-home">
        <div class="home-welcome">
            <h1 class="h1-welcome">Bem vindo Noivo(a)</h1>
            <span class="span-welcome">Aqui é onde cada detalhe do seu grande dia começa a ganhar forma.</span>
        </div>
        <div class="home-summary">

            <div class="summary-card">
                <span class="summary-label">Convidados confirmados</span>
                <h2 class="summary-value">{{confirmedGuests}}</h2>
            </div>

            <div class="summary-card">
                <span class="summary-label">Presentes escolhidos</span>
                <h2 class="summary-value">{{giftsChosen}}</h2>
            </div>

            <div class="summary-card">
                <span class="summary-label">Checklist concluído</span>
                <h2 class="summary-value">{{checkDone}}%</h2>
            </div>

        </div>

        <div class="container-buttons">
            <div class="btn-home" id="btn-convidados" @click="GoGuest">
                <div class="btn-home-header">
                    <h1 class="h1-btn-home">Convidados</h1>
                    <span class="material-icons btn-icon">groups</span>
                </div>

                <span class="btn-description">
                    Pessoas que participarão do seu grande dia
                </span>
                <span class="span-btn-home">Numero de convidados: {{numInvited}} </span>
            </div>
            <div class="btn-home" id="btn-presentes" @click="GoGift">
                <div class="btn-home-header">
                    <h1 class="h1-btn-home">Presentes</h1>
                    <span class="material-icons btn-icon">card_giftcard</span>
                </div>

                <span class="btn-description">
                    Um gesto de carinho dos seus convidados
                </span>
                <span class="span-btn-home">Presentes disponíveis: {{presentAvaliable}} </span>
            </div>
            <div class="btn-home" id="btn-checklist" @click="GoCheck">
                <div class="btn-home-header">
                    <h1 class="h1-btn-home">Checklist</h1>
                    <span class="material-icons btn-icon">checklist</span>
                </div>

                <span class="btn-description">
                    Tudo o que falta para o grande dia
                </span>
                <span class="span-btn-home">Pendentes: {{checkPending}} </span>
            </div>
        </div>
        <div class="container-btn-editview">
            <div class="btn-home" id="btn-editguestview" @click="GoEditView">
                <span class="material-symbols-rounded" id="icon-edit">table_edit</span>
                <h1 class="h1-btn-home" id="h1-edit">Editar tela inicial dos convidados</h1>
            </div>
        </div>
        <div class="contaiener-next-status">
            <div class="next-steps">
                <h2 class="next-title">Próximos passos</h2>

                <ul class="steps-list">
                    <li
                        v-for="step in nextSteps"
                        :key="step.id"
                        :class="{ done: step.done }"
                    >
                        <span class="material-symbols-outlined">
                            favorite
                        </span>
                        {{ step.text }}
                    </li>
                </ul>
            </div>

            <div class="wedding-status">
                <span class="status-label">Status do casamento</span>
                <h2 class="status-title">{{status}}</h2>
                <p class="status-description">
                    {{subStatus}}
                </p>
            </div>
        </div>

        <div class="countdown">
            <span class="countdown-label" v-if="daysCountdown > 0">Faltam</span>
            <h2 class="countdown-value" v-if="daysCountdown > 0">{{daysCountdown}} dias</h2>
            <span class="countdown-sub" v-if="daysCountdown > 0">para o grande dia 💍</span>
            <h2 class="countdown-value" v-else> É hoje! 💖 </h2>
        </div>


        <div class="home-footer">
            <span class="footer-quote">
                “Onde há amor, Deus habita.”
            </span>
        </div>


    </div>
</div>
`