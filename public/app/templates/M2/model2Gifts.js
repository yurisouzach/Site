export default `
    <div class="gifts-page">
    
        <!-- HEADER -->
        <section class="gifts-header">
            <h1>Lista de Presentes</h1>
            <p class="subtitle">
                Cada presente é um gesto de carinho para o nosso novo começo
            </p>
            <div v-if="isAdmin" class="admin-indicators">
                <div class="indicator">
                    <strong>{{ giftsReserved }}</strong>
                    <span>Reservados</span>
                </div>

                <div class="indicator">
                    <strong>{{ giftsRemaining }}</strong>
                    <span>Disponíveis</span>
                </div>

                <div class="indicator">
                <strong>{{ giftsTotal }}</strong>
                <span>Total</span>
                </div>
            </div>
        </section>

        <!-- CONTROLES -->
        <section class="gifts-controls">
            <input
            type="text"
            placeholder="Buscar presente..."
            v-model="searchGift"
            class="search-input"
            />

            <div class="filters">
                <button
                class="filter-btn"
                :class="{ active: activeFilter === 'all' }"
                @click="activeFilter = 'all'"
                >
                Todos
                </button>

                <button
                class="filter-btn"
                :class="{ active: activeFilter === 'available' }"
                @click="activeFilter = 'available'"
                >
                Disponíveis
                </button>

                <button
                class="filter-btn"
                :class="{ active: activeFilter === 'reserved' }"
                @click="activeFilter = 'reserved'"
                >
                Reservados
                </button>
            </div>

            <button v-if="isAdmin" class="btn-add-gift" @click="openAddGift">
            + Adicionar presente
            </button>
        </section>    

        <!-- GRID DE PRESENTES -->
        <section class="gifts-grid">
            <div v-for="gift in filteredGifts" :key="gift.id" class="gift-card" :class="{ reserved: gift.reservedby }" @click="selectGift(gift)">

                <img
                v-if="gift.imagePreview || gift.imagefile"
                :src="gift.imagePreview != null ? gift.imagePreview : gift.imagefile"
                alt="Imagem do presente"
                class="gift-image"/>

                <span
                v-else
                class="material-symbols-rounded placeholder-icon"
                >
                card_giftcard
                </span>

                <h3 style="overflow-wrap: anywhere;">{{ gift.name }}</h3>
                <span class="gift-category">{{ gift.giftcategory }}</span>

                <div class="gift-status">
                    <span v-if="gift.reservedby === null">💝 Disponível</span>
                    <span v-else>🎉 Reservado por {{ gift.reservedby }}</span>
                </div>

                <div class="gift-value">
                    <span class="currency">R$</span>
                    <span class="amount">{{ gift.price }}</span>
                </div>

                <div class="gift-actions">

                    <!-- NOIVO(A) -->
                    <div v-if="isAdmin" class="admin-actions">
                        <button class="icon-btn edit" @click="editGift(gift)">
                        <span class="material-symbols-rounded">edit</span>
                        </button>
                        <button class="icon-btn delete" @click="removeGift(gift)" @click.stop>
                        <span class="material-symbols-rounded">delete</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- INSIGHTS -->
        <section class="gifts-insights">
            <p v-if="giftsRemaining > 0">
            💖 Faltam apenas {{ giftsRemaining }} presentes para completar a lista
            </p>

            <p v-else>
            🎉 Todos os presentes já foram escolhidos com carinho
            </p>
        </section>

        <div class="modal-overlay" v-if="showGifttModal" @click.self="closeModal">

            <div class="guest-modal" id="gift-modal">
    
                <header class="modal-header">
                    <h2>{{ modalTitle }}</h2>
                    <span class="material-icons close" @click="closeModal">close</span>
                </header>
                <div style="display: flex; justify-content: space-around;">
                    <div>
                        <div class="modal-body">

                            <div class="image-upload">

                                <label class="image-upload-box">
                                    <input type="file" accept="image/*" @change="onImageChange" hidden>

                                    <div v-if="!gift.imagePreview && !gift.imagefile" class="upload-placeholder">
                                        <span class="material-symbols-rounded">image</span>
                                        <p>Adicionar imagem</p>
                                    </div>

                                    <img v-else :src="gift.imagePreview != null ? gift.imagePreview : gift.imagefile" alt="Preview do presente">
                                </label>

                            </div>

                            <!-- Nome -->
                            <div class="input-group" id="user">
                                <input type="text" id="user-txt" v-model="gift.name" required />

                                <label>Nome do presente</label>
                            </div>

                            <div class="input-group" id="user">
                                <input type="text" id="txtTelefone" v-model="gift.giftcategory" required placeholder=" ">
                                <label for="txtTelefone">Categoria</label>
                            </div>
      
                            <div class="input-group" id="user">
                                <input type="number" id="txtTelefone" v-model="gift.price" required placeholder=" ">
                                <label for="txtTelefone">Valor</label>
                            </div>
      
                        </div>
      
                        <footer class="modal-footer">
                            <button class="btn-secondary" @click="closeModal">Cancelar</button>
                            <button class="btn-primary" id="save" @click="saveGift">Salvar Presente</button>
                        </footer>
                    </div>
      
                    <div class="gift-preview">

                        <div class="gift-card-preview">

                            <div class="gift-image">
                                <img v-if="gift.imagePreview || gift.imagefile" :src="gift.imagePreview != null ? gift.imagePreview : gift.imagefile">
                                <span v-else class="material-symbols-rounded">card_giftcard</span>
                            </div>

                            <div class="gift-info">
                                <h3 style="overflow-wrap: anywhere;">{{ gift.name || 'Nome do presente' }}</h3>
                                <span class="gift-category">{{ gift.giftcategory || 'Categoria' }}</span>

                                <div class="gift-value">
                                    <span>R$ {{ gift.price || '0,00' }}</span>
                                </div>
                            </div>

                        </div>
  
                    </div>
                </div>
    

            </div>
      
        </div>

        <div class="shadow" v-if="showConfirm">
            <div class="conf-container" id="gift_confirm">
                <div class="conf-cab">
                    <h1 class="title-conf">Reservar presente</h1>
                    <button class="btn-close" @click="CloseConfirm">X</button>
                </div>
                <span>Tem certeza de que deseja reservar este presente?</span>
                <span>Ele ficará reservado para você e ajudará a tornar nossa casa ainda mais especial 💕</span>
                <div class="conf-buttons">
                    <button class="btn-yes" @click="Confirm(true)">Sim!</button>
                    <button class="btn-no" @click="Confirm(false)">Agora não</button>
                </div>
            </div>
        </div>
    </div>
`