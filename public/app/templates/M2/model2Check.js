export default `
    <div class="checklist-page">

  <!-- 🔝 PROGRESSO -->
  <section class="checklist-progress">
    <div style="display: flex; flex-direction: column; align-items: center">
        <h2 v-if="progressPercent === 100">O casamento esta pronto! 💕</h2>
        <h2 v-else-if="checkDone >= 1">Vocês estão avançando 💕</h2>
        <h2 v-else="totalChecks = 0">Comece a planejar o grande dia 💕</h2>
    </div>

    <p v-if="progressPercent === 100">Tudo foi planejado com carinho e dedicação para esse momento</p>
    <p v-else-if="checkDone >= 1">Cada tarefa concluída deixa o grande dia mais perto</p>
    <p v-else="totalChecks = 0">O seu dia merece essa organização!</p>

    <div class="progress-card">
  <div class="progress-header">
    <span class="progress-title">Progresso do checklist</span>
    <span class="progress-percent">{{ progressPercent }}%</span>
  </div>

  <div class="progress-bar">
    <div
      class="progress-fill"
      :style="{ width: progressPercent + '%' }"
    ></div>
  </div>

  <div class="progress-meta">
    <span>✔ {{ checkDone }} concluídos</span>
    <span>⏳ {{ checkPending }} pendentes</span>
  </div>
</div>

  </section>

  <!-- 📋 CHECKS ATIVOS -->
  <section class="checklist-content">

    <header class="checklist-header">
      <h3>Suas tarefas</h3>

      <div class="checklist-actions">
        <button
  class="filter"
  :class="{ active: filterStatus === 'all' }"
  @click="filterStatus = 'all'"
>
  Todos
</button>

<button
  class="filter"
  :class="{ active: filterStatus === 'pending' }"
  @click="filterStatus = 'pending'"
>
  Pendentes
</button>

<button
  class="filter"
  :class="{ active: filterStatus === 'done' }"
  @click="filterStatus = 'done'"
>
  Concluídos
</button>

        <button class="btn-add" @click="openNewCheck">+ Nova tarefa</button>
      </div>
    </header>

    <div class="checklist-list">

        <div
  class="check-item"
  :class="{ done: check.done }"
  v-for="check in filteredChecks"
  :key="check.id"
  @click="openEditCheck(check)"
>
  <label @click.stop>
    <input type="checkbox" v-model="check.done">
    <span class="custom-check"></span>
  </label>

  <div class="check-info">
    <h4>{{ check.title }}</h4>
    <p v-if="check.description">{{ check.description }}</p>
  </div>

    <div class="check-meta">
        <button class="icon-btn delete" id="check-remove" @click="removeCheck(check)" v-if="!check.done" @click.stop>
        <span class="material-symbols-rounded">delete</span>
      </button>
        <span v-if="isLate(check)" class="badge late">Atrasado</span>

        <span v-else-if="check.done" class="badge done">Concluído</span>

        <span v-else class="badge pending">
            📍 Até {{ formatDate(check.duedate) }}
        </span>
    </div>
</div>

    </div>
  </section>

  <section class="checklist-suggestions" v-show="filteredSuggestions.length > 0">
    <h3>Sugestões para vocês ✨</h3>

    <div class="carousel-wrapper" 
    @mouseenter="pauseAutoScroll"
    @mouseleave="resumeAutoScroll"
    @touchstart="pauseAutoScroll"
    @touchend="resumeAutoScroll">
      <div class="suggestion-carousel" ref="suggestionCarousel">
        <button
          class="suggestion"
          v-for="suggestion in filteredSuggestions"
          :key="suggestion.id"
          @click="addCheckFromSuggestion(suggestion)"
        >
          <p>{{ suggestion.title }}</p>
        </button>
      </div>
    </div>
  </section>

  <!-- 💕 FRASE FINAL -->
  <footer class="checklist-footer">
    <span>“Tudo fez o Senhor formoso no seu tempo.”</span>
  </footer>

    <div class="modal-overlay" v-if="showEditModal" @click.self="closeModal">

  <div class="guest-modal">

    <header class="modal-header">
    <h2>{{ modalTitle }}</h2>
    <span class="material-icons close" @click="closeModal">close</span>
    </header>
    
    <div class="modal-body">
    
    <!-- Nome -->
    <div class="input-group" id="user">
    <input type="text" id="user-txt" v-model="check.title" required />
    
    <label>Titulo</label>
    </div>
      
      <!-- Observação -->
      <textarea
      v-model="check.description"
      placeholder="Observações (opcional)"
      ></textarea>

      
    <div class="input-group" id="user">
        <input type="date"- id="txtTelefone" v-model="check.duedate" required placeholder=" ">
        <label for="txtTelefone" id="date">Prazo</label>
    </div>
      
      </div>
      
      <footer class="modal-footer">
      <button class="btn-secondary" @click="closeModal">Cancelar</button>
      <button class="btn-primary" id="save" @click="saveCheck">Salvar tarefa</button>
      </footer>
      
      </div>
      </div>

</div>

`