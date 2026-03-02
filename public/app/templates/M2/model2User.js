export default `
    <div class="guests-page">

  <!-- Header -->
  <section class="guests-header">
    <h1>Convidados</h1>
    <p class="subtitle">
      Gerencie quem fará parte do seu grande dia
    </p>
    <span class="emotional">
      Cada nome aqui representa alguém especial 🤍
    </span>
  </section>

  <!-- Summary -->
  <section class="guests-summary">
    <div class="summary-card">
      <h2>{{ totalGuests }}</h2>
      <span>Total</span>
    </div>

    <div class="summary-card confirmed">
      <h2>{{ confirmedGuests }}</h2>
      <span>Confirmados</span>
    </div>

    <div class="summary-card pending">
      <h2>{{ pendingGuests }}</h2>
      <span>Pendentes</span>
    </div>
  </section>

  <section class="guests-actions">

  <div class="actions-left">
    <button class="add-guest-btn" @click="openModal">
      <span class="material-icons">person_add</span>
      Adicionar convidado
    </button>
  </div>

  <div class="actions-right">

    <!-- Search -->
    <div class="search-box">
      <span class="material-icons">search</span>
      <input
        type="text"
        v-model="search"
        placeholder="Buscar convidado..."
      />
    </div>

    <!-- Filters -->
    <div class="filters">
      <label class="filter-checkbox">
        <input type="checkbox" v-model="filterConfirmed" @change="toggleFilter('confirmed')">
        <span class="custom-check"></span>
        Confirmados
      </label>

      <label class="filter-checkbox">
        <input type="checkbox" v-model="filterPending" @change="toggleFilter('pending')">
        <span class="custom-check"></span>
        Pendentes
      </label>
    </div>

  </div>

</section>

  <!-- List -->
  <section class="guests-list">
    <div
      v-for="guest in filteredGuests"
      :key="guest.id"
      class="guest-card"
    >
      <div class="guest-info">
        <div style="display: flex; justify-content: center">
          <h3>{{ guest.name }}</h3>
        </div>
        <span>{{ guest.phone }}</span>
        <br>
        <span style="overflow-wrap: anywhere;">{{guest.description}}</span>
      </div>

      <div style="display: flex; justify-content: center">
        <div class="guest-status" :class="guest.confirmed === 1 ? 'confirmed' : guest.confirmed === 0 ? 'pending' : 'denied'">
          {{ guest.confirmed === 1 ? 'Confirmado' : guest.confirmed === 0 ? 'Pendente' : 'Recusado' }}
        </div>
      </div>

      <div class="admin-actions">
      <button class="icon-btn edit" @click="editGuest(guest)">
        <span class="material-symbols-rounded">edit</span>
      </button>
      <button class="icon-btn delete" @click="removeGuest(guest)">
        <span class="material-symbols-rounded">delete</span>
      </button>
    </div>

    </div>
  </section>

  
  <div class="modal-overlay" v-if="showGuestModal" @click.self="closeModal">

  <div class="guest-modal">

    <header class="modal-header">
    <h2>{{ modalTitle }}</h2>
    <span class="material-icons close" @click="closeModal">close</span>
    </header>
    
    <div class="modal-body">
    
    <!-- Nome -->
    <div class="input-group" id="user">
    <input type="text" id="user-txt" v-model="guest.name" required />
    
    <label>Nome do convidado</label>
    </div>

    <div class="input-group" id="user">
        <input type="tel" @input="formatPhone" id="txtTelefone" v-model="guest.phone" required placeholder=" ">
        <label for="txtTelefone">Telefone (WhatsApp)</label>
    </div>
    
    <!-- Status -->
      <div class="status-toggle">
      <span :class="{active: guest.confirmed === 0}">Pendente</span>
      
      <div
      class="switch"
      :class="{active: guest.confirmed === 1}"
      @click="toggleStatus"
      >
      <div class="thumb"></div>
      </div>
      
      <span :class="{active: guest.confirmed === 1}">Confirmado</span>
      </div>
      
      <!-- Observação -->
      <textarea
      v-model="guest.description"
      placeholder="Observações (opcional)"
      ></textarea>
      
      </div>
      
      <footer class="modal-footer">
      <button class="btn-secondary" @click="closeModal">Cancelar</button>
      <button class="btn-primary" id="save" @click="saveGuest">Salvar convidado</button>
      </footer>
      
      </div>
      </div>
    </div>  
`