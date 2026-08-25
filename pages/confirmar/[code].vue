<template>
  <div class="rsvp-page">

    <!-- Cover image header -->
    <div class="rsvp-header" :style="headerStyle">
      <div class="rsvp-header-overlay" />
      <div class="rsvp-header-content">
        <p class="rsvp-header-label">Invitación especial</p>
        <h1 class="rsvp-header-title">{{ data?.guest.event.name }}</h1>
        <p class="rsvp-header-date">{{ data ? formatDate(data.guest.event.date) : '' }}</p>
      </div>
    </div>

    <!-- Main content -->
    <div class="rsvp-body">

      <!-- Loading -->
      <div v-if="loading" class="rsvp-card rsvp-center">
        <div class="rsvp-spinner" />
        <p class="rsvp-muted">Cargando invitación...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="rsvp-card rsvp-center">
        <svg class="rsvp-icon-svg rsvp-icon-error" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
        </svg>
        <h2 class="rsvp-card-title">Enlace inválido</h2>
        <p class="rsvp-muted">{{ error }}</p>
      </div>

      <template v-else-if="data">

        <!-- Guest card -->
        <div class="rsvp-card">
          <div class="rsvp-guest-row">
            <div class="rsvp-avatar" :style="avatarStyle">{{ data.guest.name[0].toUpperCase() }}</div>
            <div>
              <p class="rsvp-avatar-label">Invitación para</p>
              <p class="rsvp-guest-name">{{ data.guest.name }}</p>
            </div>
          </div>

          <div class="rsvp-divider" />

          <div class="rsvp-event-details">
            <div class="rsvp-detail-row">
              <svg class="rsvp-detail-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <span>{{ data ? formatDate(data.guest.event.date) : '' }} · {{ data.guest.event.time }}</span>
            </div>
            <div class="rsvp-detail-row">
              <svg class="rsvp-detail-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <a v-if="data.guest.event.venueMapUrl" :href="data.guest.event.venueMapUrl" target="_blank" class="rsvp-map-link">
                {{ data.guest.event.venue }}
              </a>
              <span v-else>{{ data.guest.event.venue }}</span>
            </div>
          </div>

          <div v-if="data.guest.table" class="rsvp-table-badge" :style="badgeStyle">
            <svg class="rsvp-table-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
            </svg>
            Mesa: <strong>{{ data.guest.table.name }}</strong>
          </div>
        </div>

        <!-- Confirmed state -->
        <div v-if="confirmed" class="rsvp-card rsvp-center">
          <div class="rsvp-confirm-icon" :style="iconBgStyle">
            <svg v-if="rsvpStatus === 'CONFIRMED'" class="rsvp-check-svg" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
            <svg v-else class="rsvp-check-svg" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </div>
          <h3 class="rsvp-card-title">
            {{ rsvpStatus === 'CONFIRMED' ? '¡Nos vemos pronto!' : 'Ausencia registrada' }}
          </h3>
          <p class="rsvp-muted">
            {{ rsvpStatus === 'CONFIRMED' ? '¡Te esperamos con mucho cariño!' : 'Gracias por avisarnos.' }}
          </p>
        </div>

        <!-- RSVP pending -->
        <div v-else-if="data.guest.rsvpStatus === 'PENDING'" class="rsvp-card">
          <h3 class="rsvp-card-title rsvp-center">¿Podrás acompañarnos?</h3>

          <div class="rsvp-options">
            <button
              :class="['rsvp-option', selectedStatus === 'CONFIRMED' ? 'rsvp-option--yes' : '']"
              :style="selectedStatus === 'CONFIRMED' ? selectedYesStyle : {}"
              @click="selectedStatus = 'CONFIRMED'"
            >
              <svg class="rsvp-option-icon" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
              <span>Sí asistiré</span>
            </button>
            <button
              :class="['rsvp-option', selectedStatus === 'DECLINED' ? 'rsvp-option--no' : '']"
              @click="selectedStatus = 'DECLINED'"
            >
              <svg class="rsvp-option-icon" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              <span>No podré ir</span>
            </button>
          </div>

          <!-- Companions -->
          <Transition name="slide-down">
            <div v-if="selectedStatus === 'CONFIRMED' && data.guest.companions > 0" class="rsvp-companions">
              <p class="rsvp-companions-label">
                ¿Cuántos acompañantes llevarás?
                <span class="rsvp-companions-max">(máx. {{ data.guest.companions }})</span>
              </p>
              <div class="rsvp-counter">
                <button class="rsvp-counter-btn" :disabled="companions <= 0" @click="companions = Math.max(0, companions - 1)">−</button>
                <span class="rsvp-counter-num">{{ companions }}</span>
                <button class="rsvp-counter-btn" :disabled="companions >= data.guest.companions" @click="companions = Math.min(data.guest.companions, companions + 1)">+</button>
              </div>
            </div>
          </Transition>

          <!-- Message -->
          <div class="rsvp-field">
            <label class="rsvp-field-label">Deja un mensaje (opcional)</label>
            <textarea
              v-model="message"
              rows="3"
              placeholder="Un deseo para este día especial..."
              class="rsvp-textarea"
            />
          </div>

          <button
            class="rsvp-btn-confirm"
            :class="{ 'rsvp-btn--disabled': !selectedStatus || confirming }"
            :style="confirmBtnStyle"
            :disabled="!selectedStatus || confirming"
            @click="confirmRsvp"
          >
            <span v-if="confirming" class="rsvp-btn-spinner" />
            <span v-else>Confirmar asistencia</span>
          </button>
        </div>

        <!-- Already responded -->
        <div v-else class="rsvp-card rsvp-center">
          <div class="rsvp-confirm-icon" :style="iconBgStyle">
            <svg v-if="data.guest.rsvpStatus === 'CONFIRMED'" class="rsvp-check-svg" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
            <svg v-else class="rsvp-check-svg" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </div>
          <p class="rsvp-already">
            {{ data.guest.rsvpStatus === 'CONFIRMED' ? '¡Ya confirmaste tu asistencia!' : 'Ya registraste que no asistirás.' }}
          </p>
        </div>

      </template>
    </div>

    <p class="rsvp-footer">Powered by Rével</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

interface RsvpEvent {
  id: string
  name: string
  date: string
  time: string
  venue: string
  venueAddress?: string | null
  venueMapUrl?: string | null
  coverImage?: string | null
  customColor?: string | null
  type: string
}

interface RsvpGuest {
  id: string
  name: string
  rsvpStatus: string
  companions: number
  table?: { id: string; name: string; number: number } | null
  event: RsvpEvent
}

interface RsvpData {
  guest: RsvpGuest
}

const route = useRoute()
const code = route.params.code as string

const loading = ref(true)
const error = ref('')
const data = ref<RsvpData | null>(null)
const selectedStatus = ref<'CONFIRMED' | 'DECLINED' | ''>('')
const companions = ref(0)
const message = ref('')
const confirming = ref(false)
const confirmed = ref(false)
const rsvpStatus = ref('')

const accentColor = computed(() => data.value?.guest.event.customColor || '#C8A96E')

const headerStyle = computed(() => {
  const cover = data.value?.guest.event.coverImage
  return cover
    ? { backgroundImage: `url(${cover})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }
})

const avatarStyle = computed(() => ({
  background: `linear-gradient(135deg, ${accentColor.value}cc, ${accentColor.value})`,
}))

const badgeStyle = computed(() => ({
  borderColor: `${accentColor.value}40`,
  color: accentColor.value,
  background: `${accentColor.value}12`,
}))

const iconBgStyle = computed(() => ({
  background: `${accentColor.value}20`,
  border: `2px solid ${accentColor.value}40`,
}))

const selectedYesStyle = computed(() => ({
  borderColor: accentColor.value,
  background: `${accentColor.value}15`,
  color: accentColor.value,
}))

const confirmBtnStyle = computed(() => ({
  background: `linear-gradient(135deg, ${accentColor.value}, ${accentColor.value}cc)`,
  boxShadow: `0 4px 16px ${accentColor.value}40`,
}))

async function loadData() {
  try {
    const res = await $fetch<{ success: boolean; data: RsvpData }>(`/api/rsvp/${code}`)
    data.value = res.data
  } catch {
    error.value = 'El enlace de invitación no es válido o ha expirado.'
  } finally {
    loading.value = false
  }
}

async function confirmRsvp() {
  if (!selectedStatus.value) return
  confirming.value = true
  try {
    await $fetch('/api/rsvp/confirm', {
      method: 'POST',
      body: {
        code,
        status: selectedStatus.value,
        message: message.value,
        companions: selectedStatus.value === 'CONFIRMED' ? companions.value : 0,
      },
    })
    rsvpStatus.value = selectedStatus.value
    confirmed.value = true
  } catch {
    // silencioso
  } finally {
    confirming.value = false
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('es-MX', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

onMounted(loadData)
</script>

<style scoped>
/* ── Base ── */
.rsvp-page {
  min-height: 100vh;
  background: #0d0d14;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: system-ui, -apple-system, sans-serif;
  color: #e8e0d0;
}

/* ── Header ── */
.rsvp-header {
  width: 100%;
  min-height: 260px;
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.rsvp-header-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(13,13,20,0.2) 0%, rgba(13,13,20,0.85) 100%);
}
.rsvp-header-content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 2rem 1.5rem 2.5rem;
  width: 100%;
  max-width: 480px;
}
.rsvp-header-label {
  font-size: 0.68rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(200, 169, 110, 0.8);
  margin-bottom: 0.5rem;
}
.rsvp-header-title {
  font-size: 2rem;
  font-weight: 300;
  color: #fff;
  margin: 0 0 0.4rem;
  line-height: 1.2;
  letter-spacing: 0.01em;
}
.rsvp-header-date {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.6);
  font-style: italic;
  margin: 0;
}

/* ── Body ── */
.rsvp-body {
  width: 100%;
  max-width: 440px;
  padding: 1.25rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
}

/* ── Card ── */
.rsvp-card {
  background: #16161f;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 1.25rem;
  padding: 1.5rem;
}
.rsvp-center { text-align: center; }

/* ── Guest row ── */
.rsvp-guest-row {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin-bottom: 1.25rem;
}
.rsvp-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  color: #fff;
  font-weight: 600;
  flex-shrink: 0;
}
.rsvp-avatar-label {
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.35);
  margin: 0 0 0.2rem;
}
.rsvp-guest-name {
  font-size: 1.1rem;
  color: #fff;
  margin: 0;
  font-weight: 400;
}

/* ── Divider ── */
.rsvp-divider {
  height: 1px;
  background: rgba(255,255,255,0.06);
  margin-bottom: 1.1rem;
}

/* ── Event details ── */
.rsvp-event-details {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.rsvp-detail-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.85rem;
  color: rgba(255,255,255,0.55);
}
.rsvp-detail-icon {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  color: rgba(255,255,255,0.3);
}
.rsvp-map-link {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-color: rgba(255,255,255,0.2);
}

/* ── Table badge ── */
.rsvp-table-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 1rem;
  border: 1px solid;
  border-radius: 2rem;
  padding: 0.3rem 0.9rem;
  font-size: 0.78rem;
}
.rsvp-table-icon { width: 13px; height: 13px; }

/* ── Card title ── */
.rsvp-card-title {
  font-size: 1.1rem;
  font-weight: 400;
  color: #fff;
  margin: 0 0 0.5rem;
}

/* ── Confirm icon ── */
.rsvp-confirm-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}
.rsvp-check-svg {
  width: 26px;
  height: 26px;
  color: #C8A96E;
}

/* ── RSVP options ── */
.rsvp-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}
.rsvp-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0.75rem;
  border-radius: 1rem;
  border: 1.5px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.03);
  cursor: pointer;
  font-size: 0.85rem;
  color: rgba(255,255,255,0.5);
  transition: all 0.2s;
  font-family: inherit;
}
.rsvp-option:hover {
  border-color: rgba(255,255,255,0.2);
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.8);
}
.rsvp-option--no {
  border-color: rgba(239,68,68,0.4);
  background: rgba(239,68,68,0.08);
  color: rgba(239,100,100,0.9);
}
.rsvp-option-icon { width: 22px; height: 22px; }

/* ── Companions ── */
.rsvp-companions {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 1rem;
  padding: 1rem;
  margin-bottom: 1rem;
  text-align: center;
}
.rsvp-companions-label {
  font-size: 0.82rem;
  color: rgba(255,255,255,0.45);
  margin-bottom: 0.75rem;
}
.rsvp-companions-max { color: rgba(255,255,255,0.3); }
.rsvp-counter {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
}
.rsvp-counter-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1.5px solid rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.7);
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  font-family: inherit;
}
.rsvp-counter-btn:disabled { opacity: 0.25; cursor: not-allowed; }
.rsvp-counter-btn:not(:disabled):hover { background: rgba(255,255,255,0.1); }
.rsvp-counter-num {
  font-size: 2rem;
  color: #fff;
  min-width: 2.5rem;
  text-align: center;
  font-weight: 300;
}

/* ── Field ── */
.rsvp-field { margin-bottom: 1.25rem; }
.rsvp-field-label {
  display: block;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.35);
  margin-bottom: 0.45rem;
  letter-spacing: 0.04em;
}
.rsvp-textarea {
  width: 100%;
  background: rgba(255,255,255,0.04);
  border: 1.5px solid rgba(255,255,255,0.1);
  border-radius: 0.75rem;
  padding: 0.7rem 0.9rem;
  font-family: inherit;
  font-size: 0.88rem;
  color: rgba(255,255,255,0.8);
  resize: none;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
.rsvp-textarea:focus { border-color: rgba(255,255,255,0.25); }
.rsvp-textarea::placeholder { color: rgba(255,255,255,0.2); }

/* ── Confirm button ── */
.rsvp-btn-confirm {
  width: 100%;
  border: none;
  border-radius: 2rem;
  padding: 0.9rem;
  color: #fff;
  font-family: inherit;
  font-size: 0.95rem;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
.rsvp-btn-confirm:not(.rsvp-btn--disabled):hover {
  opacity: 0.9;
  transform: translateY(-1px);
}
.rsvp-btn--disabled { opacity: 0.4; cursor: not-allowed; }
.rsvp-btn-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* ── Already responded ── */
.rsvp-already {
  font-size: 0.95rem;
  color: rgba(255,255,255,0.6);
  font-style: italic;
  margin: 0;
}

/* ── Helpers ── */
.rsvp-muted { font-size: 0.85rem; color: rgba(255,255,255,0.4); margin: 0; }
.rsvp-icon-svg { width: 48px; height: 48px; margin: 0 auto 0.75rem; display: block; }
.rsvp-icon-error { color: rgba(239,68,68,0.6); }

/* ── Spinner ── */
.rsvp-spinner {
  width: 32px;
  height: 32px;
  border: 2.5px solid rgba(255,255,255,0.1);
  border-top-color: #C8A96E;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 0.75rem;
}

/* ── Footer ── */
.rsvp-footer {
  margin: 1.5rem 0 2rem;
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  color: rgba(255,255,255,0.18);
  text-transform: uppercase;
}

/* ── Animations ── */
@keyframes spin { to { transform: rotate(360deg); } }

.slide-down-enter-active { transition: all 0.3s ease; }
.slide-down-leave-active { transition: all 0.2s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-8px); }

/* ── Responsive ── */
@media (max-width: 480px) {
  .rsvp-header { min-height: 220px; }
  .rsvp-header-title { font-size: 1.6rem; }
}
</style>
