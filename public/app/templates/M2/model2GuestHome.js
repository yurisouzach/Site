export default `
<div class="home-guest">
    <div class="container-home-guest">

        <div class="homeGuest-welcome">
            <div class="homeGuest-headder" :class="{ editable: isAdmin }" @click="isAdmin && openWelcomeHeadder()">
                <h1 class="h1-homeGuest-headder">{{ saudation + " " + GuestName }}</h1>
                <span v-if="subtitle != null"> {{ subtitle }} </span>
            </div> 

            <div class="homeGuest-body" :class="{ editable: isAdmin }" @click="isAdmin && openWelcome()">
                <span> {{ welcome }} </span>
            </div>
        </div>

        <div style="display: flex">
                <div v-if="isAdmin" class="toggle-wrapper">
                    <span class="toggle-label">
                        Exibir avisos para os convidados
                    </span>

                    <label class="toggle-switch">
                        <input type="checkbox" @click="ToggleWarning" v-model="this.showWarning">
                        <span class="slider"></span>
                    </label>
                </div>

            
                <div v-if="isAdmin" class="toggle-wrapper">
                    <span class="toggle-label">
                        Exibir informações para os convidados
                    </span>

                    <label class="toggle-switch">
                        <input type="checkbox" @click="ToggleInf" v-model="this.showInf">
                        <span class="slider"></span>
                    </label>
                </div>
            </div>

        <div class="container-warning-inf" v-if="showWarning || showInf || isAdmin" :class="{ solo:!showWarning || !showInf }">

            <div class="container-warning" v-if="showWarning">
                <div class="next-steps" id="widthadjust">
                    <div class="headder-warning">
                        <h2 class="next-title" id="warning-headder">Avisos</h2>
                        <span @click="isAdmin && openWarning()" v-if="isAdmin" class="material-symbols-rounded editable">
                            add
                        </span>
                    </div>

                    <ul class="steps-list">
                        <li
                            :class="{ editable: isAdmin }"
                            @click="isAdmin && editWarning(warning)"
                            v-for="warning in warningsToShow"
                            :key="warning.id"
                        >
                            <span class="material-symbols-rounded">
                                priority_high
                            </span>
                            {{ warning.description }}
                             <div v-if="isAdmin" style="margin-left: auto">
                                <button class="icon-btn delete" id="check-remove" @click="RemoveWarning(warning)" @click.stop>
                                    <span class="material-symbols-rounded">delete</span>
                                </button> 
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="container-inf" v-if="showInf">
                <div class="next-steps" id="widthadjust">
                    <div class="headder-warning">
                        <h2 class="next-title">Informações</h2>
                        <span @click="isAdmin && openInfs()" v-if="isAdmin" class="material-symbols-rounded editable">
                            add
                        </span>
                    </div>

                    <ul class="steps-list">
                        <li
                            :class="{ editable: isAdmin }" 
                            @click="isAdmin && editInfs(inf)"
                            v-for="inf in infsToShow"
                            :key="inf.id"
                        >
                            <span class="material-symbols-rounded">
                                info
                            </span>
                            {{ inf.description }}
                            <div v-if="isAdmin" style="margin-left: auto">
                                <button class="icon-btn delete" id="check-remove" @click="RemoveInf(inf)" @click.stop>
                                    <span class="material-symbols-rounded">delete</span>
                                </button> 
                            </div>
                        </li>

                        <li v-if="ender != null && ender != '' || isAdmin" :class="{ editable: isAdmin }" 
                            @click="isAdmin && editEnder()">
                            <span class="material-symbols-rounded">
                                location_on
                            </span>
                            <span class="label">Local:</span>

                            <a
                                :href="mapsLink"
                                target="_blank"
                                rel="noopener"
                                class="map-link"
                            >
                                {{ ender.ender}}
                                <span class="material-icons map-icon">map</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="rsvp-card" v-if="confirmed === 0">

            <div class="rsvp-header">
                <span class="material-symbols-rounded">favorite</span>
                <h2>Confirmação de Presença</h2>
            </div>

            <p class="rsvp-text">
                Você poderá estar conosco neste dia tão especial?
            </p>

            <div class="rsvp-actions">
                <button class="btn-confirm" id="conf-button" @click="confirmPresence(true)">
                    💕 Sim, estarei lá
                </button>

                <button class="btn-decline" id="conf-button" @click="confirmPresence(false)">
                    😢 Não poderei ir
                </button>
            </div>

            <span class="rsvp-deadline" :class="{ editable: isAdmin }"  @click="isAdmin && openDeadLine()" v-if="deadline != null || isAdmin">
                ⏳ Confirme até {{ formatDate(deadline) }}
            </span>

        </div>

        <div class="rsvp-card confirmed" v-if="confirmed === 1">

            <div class="rsvp-success">
                <span class="material-symbols-rounded check-icon">
                    favorite
                </span>
            </div>

            <h2 class="confirmed-title">
                Presença confirmada 💕
            </h2>

            <p class="confirmed-text">
                Ficamos imensamente felizes em saber que você estará conosco
                neste dia tão especial.
            </p>

            <span class="confirmed-sub">
                💍 Nos vemos em breve!
            </span>

        </div>

        <div class="rsvp-card declined" v-if="confirmed === 2">

            <div class="rsvp-icon">
                <span class="material-symbols-rounded decline-icon">
                    heart_broken
                </span>
            </div>

            <h2 class="declined-title">
                Sentiremos sua falta 🤍
            </h2>

            <p class="declined-text">
                Agradecemos muito por nos avisar.
                Você estará em nossos pensamentos nesse dia tão especial.
            </p>

            <span class="declined-sub">
                Com carinho, esperamos te ver em breve ✨
            </span>
        </div>

        <div class="gift-cta" :class="{ highlight: confirmed === 1 }">
            <div class="gift-content">
                <span class="material-symbols-rounded gift-icon">card_giftcard</span>

                <div class="gift-text">
                    <h2>Um gesto de carinho</h2>
                    <p>
                        Sua presença já é especial, mas se desejar,
                        preparamos uma lista com muito carinho.
                    </p>
                </div>

                <button class="gift-button" @click="goGift">
                    Ver lista de presentes
                </button>
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
    <div class="modal-overlay" v-if="showEditModal" @click.self="closeModal">
        <div class="guest-modal" id="homeguest">

            <header class="modal-header">
                <h2>{{ editContext.title }}</h2>
                <span class="material-icons close" @click="closeModal">close</span>
            </header>
    
            <div class="modal-body">
    
                <div
                    class="input-group" id="input-group-homeguest"
                    v-for="field in editContext.fields"
                    :key="field.key"
                >
                    <input class="input-homeGuest"
                        v-if="field.type === 'input'"
                        :type="editContext.type === 'deadline' ? 'date' : 'text'"
                        v-model="editContext.model[field.key]"
                        required
                    />
  
                    <textarea class="text-homeGuest" :class="{textwelcome: editContext.type === 'message'}"
                        v-else-if="field.type === 'textarea'"
                        :placeholder="field.label"
                        v-model="editContext.model[field.key]"
                    ></textarea>

                    <label v-if="field.type != 'textarea'">{{ field.label }}</label>
                </div>

                <footer class="modal-footer">
                    <button class="btn-secondary" @click="closeModal">Cancelar</button>
                    <button class="btn-primary" id="save-edit" @click="SaveEdit">Salvar</button>
                </footer>
            </div>
        </div>
    </div>
</div>
`