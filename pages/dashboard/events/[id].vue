<template>
  <div v-if="event">
    
    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
      <div class="flex items-start gap-3">
        <NuxtLink to="/dashboard/events" class="w-9 h-9 rounded-xl glass flex items-center justify-center text-white/60 hover:text-white transition-colors mt-1 flex-shrink-0">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </NuxtLink>
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-2 mb-1">
            <h2 class="font-display text-xl lg:text-2xl font-bold text-white truncate">{{ event.name }}</h2>
            <UiBadge :variant="statusVariant(event.status)" dot>{{ statusLabel(event.status) }}</UiBadge>
          </div>
          <p class="text-white/45 text-sm">
            {{ formatDate(event.date) }} · {{ event.time }} · {{ event.venue }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2 flex-wrap flex-shrink-0">
        <UiButton
          variant="secondary"
          size="sm"
          :loading="downloading"
          :disabled="(event._count?.photos ?? 0) === 0 || features.cannot('download')"
          :title="features.cannot('download') ? `Requiere plan ${FEATURE_MIN_PLAN['download']}` : ''"
          @click="downloadPhotos"
        >
          <svg v-if="features.can('download')" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
          </svg>
          <span class="hidden sm:inline">Descargar fotos{{ features.can('download') && (event._count?.photos ?? 0) > 0 ? ` (${event._count?.photos})` : '' }}</span>
        </UiButton>
        <UiButton variant="secondary" size="sm" @click="showPreviewModal = true">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span class="hidden sm:inline">Vista previa</span>
        </UiButton>
        <UiButton variant="secondary" size="sm" @click="openEdit">
          Editar
        </UiButton>
      </div>
    </div>

    
    <div class="flex items-center gap-1 glass rounded-xl p-1 mb-6 w-fit">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="['px-4 py-2 rounded-lg text-sm font-medium transition-all', activeTab === tab.key ? 'bg-revel-gold text-revel-black' : 'text-white/50 hover:text-white']"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
        <span v-if="tab.count !== undefined" class="ml-1.5 opacity-70 text-xs">{{ tab.count }}</span>
      </button>
    </div>

    
    <div v-if="activeTab === 'overview'">
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <UiStatsCard :value="event._count?.guests ?? 0" label="Invitados" icon-bg="bg-blue-500/10">
          <template #icon><svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg></template>
        </UiStatsCard>
        <UiStatsCard :value="event._count?.photos ?? 0" label="Fotos" icon-bg="bg-purple-500/10">
          <template #icon><svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></template>
        </UiStatsCard>
        <UiStatsCard :value="event.tableCount" label="Mesas" icon-bg="bg-green-500/10">
          <template #icon><svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg></template>
        </UiStatsCard>
        <UiStatsCard :value="event._count?.messages ?? 0" label="Mensajes" icon-bg="bg-yellow-500/10">
          <template #icon><svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg></template>
        </UiStatsCard>
      </div>

      
      <div class="grid lg:grid-cols-2 gap-6">
        <div class="card-revel p-5">
          <h3 class="font-display text-base font-semibold text-white mb-4">Detalles del evento</h3>
          <dl class="space-y-3">
            <div class="flex gap-3">
              <dt class="text-xs text-white/35 w-28 flex-shrink-0 pt-0.5">Tipo</dt>
              <dd class="text-sm text-white/80">{{ eventTypeLabel(event.type) }}</dd>
            </div>
            <div class="flex gap-3">
              <dt class="text-xs text-white/35 w-28 flex-shrink-0 pt-0.5">Paquete</dt>
              <dd class="text-sm text-white/80">{{ event.package?.name }}</dd>
            </div>
            <div class="flex gap-3">
              <dt class="text-xs text-white/35 w-28 flex-shrink-0 pt-0.5">Dirección</dt>
              <dd class="text-sm text-white/80">{{ event.venueAddress || 'Sin dirección' }}</dd>
            </div>
            <div v-if="event.qrAlbumCode" class="flex gap-3">
              <dt class="text-xs text-white/35 w-28 flex-shrink-0 pt-0.5">QR Álbum</dt>
              <dd class="text-sm font-mono text-revel-gold">{{ event.qrAlbumCode }}</dd>
            </div>
          </dl>
        </div>

        
        <div class="card-revel p-5 flex flex-col gap-5">
          <h3 class="font-display text-base font-semibold text-white">Links del evento</h3>

          
          <div class="flex flex-col items-center gap-3 p-4 rounded-2xl border border-revel-gold/20 bg-revel-gold/5">
            <p class="text-xs text-revel-gold/70 font-medium uppercase tracking-wider">QR para mesas · Álbum digital</p>
            <div class="bg-white p-3 rounded-xl">
              <canvas ref="qrCanvas" class="w-40 h-40 block" />
            </div>
            <p class="text-xs text-white/40 text-center">Los invitados escanean este QR para subir sus fotos al álbum</p>
            <div class="flex items-center gap-2 w-full">
              <button
                class="flex-1 text-xs text-revel-gold border border-revel-gold/30 rounded-lg py-2 hover:bg-revel-gold/10 transition-colors"
                @click="copyLink(albumUrl)"
              >
                Copiar link
              </button>
              <button
                class="flex-1 text-xs text-revel-black bg-revel-gold rounded-lg py-2 font-semibold hover:opacity-90 transition-opacity"
                @click="downloadQR"
              >
                Descargar QR
              </button>
            </div>
          </div>

          
          <div class="space-y-2">
            <div
              v-for="link in eventLinks"
              :key="link.label"
              :class="['flex items-center justify-between p-3 rounded-xl border transition-all',
                link.locked ? 'border-white/5 opacity-50' :
                link.highlight ? 'border-revel-gold/30 bg-revel-gold/5 hover:border-revel-gold/50' :
                'border-white/5 hover:border-revel-gold/20']"
            >
              <div class="flex items-center gap-3">
                <div :class="link.highlight ? 'text-revel-gold' : 'text-revel-gold/70'" class="flex-shrink-0" v-html="link.svg" />
                <div>
                  <span :class="['text-sm', link.highlight ? 'text-white font-medium' : 'text-white/70']">{{ link.label }}</span>
                  <p v-if="link.description" class="text-[10px] text-white/35 mt-0.5">{{ link.description }}</p>
                  <p v-if="link.locked" class="text-[10px] text-revel-gold/60">Requiere plan {{ link.minPlan }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <svg v-if="link.locked" class="w-3.5 h-3.5 text-white/30" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
                </svg>
                <button
                  v-else
                  :class="['text-xs transition-colors', link.highlight ? 'text-revel-gold font-semibold hover:text-revel-gold-light' : 'text-revel-gold hover:text-revel-gold-light']"
                  @click="copyLink(link.url)"
                >
                  Copiar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    
    <div v-if="activeTab === 'guests'">
      <DashboardGuestsTab :event-id="event.id" :event-name="event.name" :package-type="event.package?.type" :event-slug="event.slug" />
    </div>

    
    <div v-if="activeTab === 'tables'">
      <UiFeatureLock
        v-if="features.cannot('tables')"
        :label="FEATURE_LABELS['tables']"
        :min-plan="FEATURE_MIN_PLAN['tables']"
        :blur-content="true"
      >
        <DashboardTablesTab :event-id="event.id" :tables="[]" />
      </UiFeatureLock>
      <DashboardTablesTab v-else :event-id="event.id" :tables="event.tables ?? []" />
    </div>
  </div>

  <!-- Modal: Editar evento -->
  <UiModal v-if="event" v-model="showEditModal" size="lg">
    <template #header>
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-revel-gold/15 flex items-center justify-center flex-shrink-0">
          <svg class="w-4.5 h-4.5 text-revel-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <div>
          <h2 class="font-display text-lg font-semibold text-white">Editar evento</h2>
          <p class="text-xs text-white/40 mt-0.5">{{ event.name }}</p>
        </div>
      </div>
    </template>

    <form class="space-y-5" @submit.prevent="saveEdit">
      <!-- Portada -->
      <div>
        <label class="block text-sm font-medium text-white/70 mb-2">Imagen de portada</label>
        <div class="flex gap-3 items-start">
          <div class="w-24 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-white/5 border border-white/10 flex items-center justify-center">
            <img v-if="editForm.coverImage" :src="editForm.coverImage" alt="" class="w-full h-full object-cover" />
            <svg v-else class="w-6 h-6 text-white/20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
          <div class="flex-1">
            <input ref="coverFileRef" type="file" accept="image/*" class="hidden" @change="uploadCover" />
            <button
              type="button"
              :disabled="uploadingCover"
              class="btn-secondary text-sm py-2 px-4 w-full justify-center disabled:opacity-50"
              @click="coverFileRef?.click()"
            >
              <svg v-if="!uploadingCover" class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <span>{{ uploadingCover ? 'Subiendo...' : (editForm.coverImage ? 'Cambiar portada' : 'Subir portada') }}</span>
            </button>
            <p class="text-xs text-white/25 mt-1.5">JPG, PNG o WebP. Se optimiza automáticamente.</p>
            <button v-if="editForm.coverImage" type="button" class="text-xs text-red-400/60 hover:text-red-400 mt-1 transition-colors" @click="editForm.coverImage = ''">
              Eliminar portada
            </button>
          </div>
        </div>
      </div>

      <!-- Fila 1: nombre + estado -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="sm:col-span-2">
          <UiInput v-model="editForm.name" label="Nombre del evento" required />
        </div>
        <UiSelect
          v-model="editForm.status"
          label="Estado"
          :options="[
            { label: 'Activo', value: 'ACTIVE' },
            { label: 'Archivado', value: 'FINISHED' },
            { label: 'Cancelado', value: 'CANCELLED' },
          ]"
        />
      </div>

      <!-- Fila 2: tipo + fecha + hora -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <UiSelect v-model="editForm.type" label="Tipo" :options="eventTypes" />
        <UiInput v-model="editForm.date" label="Fecha" type="date" required />
        <UiInput v-model="editForm.time" label="Hora" type="time" />
      </div>

      <!-- Fila 3: lugar -->
      <UiInput v-model="editForm.venue" label="Nombre del lugar" required />
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <UiInput v-model="editForm.venueAddress" label="Dirección" />
        <UiInput v-model="editForm.venueMapUrl" label="URL Google Maps" />
      </div>

      <!-- Fila 4: iglesia -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <UiInput v-model="editForm.churchName" label="Iglesia / Capilla" />
        <UiInput v-model="editForm.churchAddress" label="Dirección de la iglesia" />
      </div>

      <!-- Fila 5: mesas -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-white/70 mb-1.5">Número de mesas</label>
          <input v-model.number="editForm.tableCount" type="number" min="1" max="200" class="input-revel" />
        </div>
        <div>
          <label class="block text-sm font-medium text-white/70 mb-1.5">Capacidad por mesa</label>
          <input v-model.number="editForm.tableCapacity" type="number" min="1" max="50" class="input-revel" />
        </div>
      </div>

      <!-- Descripción + regalo -->
      <div>
        <label class="block text-sm font-medium text-white/70 mb-1.5">Descripción</label>
        <textarea v-model="editForm.description" rows="2" class="input-revel resize-none w-full" />
      </div>
      <UiInput v-model="editForm.giftListUrl" label="URL mesa de regalos" />
    </form>

    <template #footer>
      <UiButton variant="ghost" size="sm" @click="showEditModal = false">Cancelar</UiButton>
      <UiButton size="sm" :loading="saving" @click="saveEdit">Guardar cambios</UiButton>
    </template>
  </UiModal>

  <div v-else-if="loading" class="flex items-center justify-center py-32">
    <div class="text-center">
      <div class="w-12 h-12 border-2 border-revel-gold/30 border-t-revel-gold rounded-full animate-spin mx-auto mb-4" />
      <p class="text-white/40 text-sm">Cargando evento...</p>
    </div>
  </div>

  <!-- Modal: Vista previa de la invitación -->
  <Teleport to="body">
    <Transition name="preview-modal">
      <div v-if="showPreviewModal && event" class="fixed inset-0 z-[60] flex flex-col bg-revel-black">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-3 border-b border-white/8 bg-revel-gray-dark/90 backdrop-blur-sm flex-shrink-0">
          <div class="flex items-center gap-4">
            <h2 class="font-display text-base font-semibold text-white">Vista previa de la invitación</h2>
            <div class="flex items-center gap-1 glass rounded-xl p-1">
              <button
                :class="['flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all', previewMode === 'mobile' ? 'bg-revel-gold text-revel-black' : 'text-white/50 hover:text-white']"
                @click="previewMode = 'mobile'"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3" />
                </svg>
                Móvil
              </button>
              <button
                :class="['flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all', previewMode === 'desktop' ? 'bg-revel-gold text-revel-black' : 'text-white/50 hover:text-white']"
                @click="previewMode = 'desktop'"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
                </svg>
                Escritorio
              </button>
            </div>
            <p class="text-xs text-white/30 hidden sm:block">Los datos del invitado son de ejemplo</p>
          </div>
          <button
            class="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all"
            @click="showPreviewModal = false"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Preview area -->
        <div class="flex-1 overflow-auto flex items-start justify-center p-6 lg:p-10">
          <!-- Mobile: phone frame -->
          <template v-if="previewMode === 'mobile'">
            <div class="w-[390px] flex-shrink-0">
              <div class="relative bg-revel-gray-dark rounded-[3rem] p-[10px] shadow-2xl border border-white/15 ring-1 ring-white/5">
                <div class="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-revel-gray-mid rounded-full" />
                <div class="rounded-[2.5rem] overflow-hidden overflow-y-auto" style="max-height: 780px;">
                  <DashboardInvitationPreview :event="event" />
                </div>
              </div>
              <p class="text-center text-xs text-white/20 mt-4">390 × 844 px · iPhone 14</p>
            </div>
          </template>

          <!-- Desktop: browser chrome -->
          <template v-else>
            <div class="w-full max-w-5xl flex-shrink-0">
              <div class="bg-revel-gray-dark rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                <div class="flex items-center gap-2 px-4 py-3 border-b border-white/8 bg-revel-gray-mid/50">
                  <div class="flex gap-1.5">
                    <div class="w-3 h-3 rounded-full bg-red-500/50" />
                    <div class="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div class="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                  <div class="flex-1 mx-3">
                    <div class="bg-revel-gray-dark/80 rounded-md px-3 py-1 text-xs text-white/30 flex items-center gap-2 max-w-xs mx-auto">
                      <svg class="w-3 h-3 flex-shrink-0 text-green-400/60" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      revel-eventos.com/invitacion/XXXX-XXXX
                    </div>
                  </div>
                </div>
                <div style="max-height: 700px; overflow-y: auto;">
                  <DashboardInvitationPreview :event="event" />
                </div>
              </div>
              <p class="text-center text-xs text-white/20 mt-3">Vista escritorio · 1280 px</p>
            </div>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { useEventsStore } from '~/stores/events'
import { useUiStore } from '~/stores/ui'
import { useEventFeatures, FEATURE_LABELS, FEATURE_MIN_PLAN } from '~/composables/useEventFeatures'
import type { Event } from '~/types'

const route = useRoute()
const eventsStore = useEventsStore()
const ui = useUiStore()

const loading = ref(true)
const event = ref<Event | null>(null)
const activeTab = ref('overview')
const showEditModal = ref(false)
const showPreviewModal = ref(false)
const previewMode = ref<'mobile' | 'desktop'>('mobile')
const saving = ref(false)
const downloading = ref(false)
const uploadingCover = ref(false)
const coverFileRef = ref<HTMLInputElement | null>(null)

const eventTypes = [
  { label: 'Boda', value: 'wedding' },
  { label: 'Cumpleaños', value: 'birthday' },
  { label: 'Quinceañera', value: 'quinceañera' },
  { label: 'Corporativo', value: 'corporate' },
  { label: 'Baby Shower', value: 'baby_shower' },
  { label: 'Graduación', value: 'graduation' },
  { label: 'Otro', value: 'other' },
]

const editForm = reactive({
  name: '',
  description: '',
  type: '',
  date: '',
  time: '',
  venue: '',
  venueAddress: '',
  venueMapUrl: '',
  churchName: '',
  churchAddress: '',
  tableCount: 10,
  tableCapacity: 8,
  giftListUrl: '',
  coverImage: '',
  status: 'ACTIVE',
})

function openEdit() {
  if (!event.value) return
  Object.assign(editForm, {
    name: event.value.name,
    description: event.value.description ?? '',
    type: event.value.type,
    date: event.value.date.slice(0, 10),
    time: event.value.time,
    venue: event.value.venue,
    venueAddress: event.value.venueAddress ?? '',
    venueMapUrl: event.value.venueMapUrl ?? '',
    churchName: event.value.churchName ?? '',
    churchAddress: event.value.churchAddress ?? '',
    tableCount: event.value.tableCount,
    tableCapacity: event.value.tableCapacity,
    giftListUrl: event.value.giftListUrl ?? '',
    coverImage: event.value.coverImage ?? '',
    status: event.value.status,
  })
  showEditModal.value = true
}

async function uploadCover(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploadingCover.value = true
  try {
    const base64 = await fileToBase64(file)
    const res = await apiFetch<{ success: boolean; url: string }>('/api/upload/cover', {
      method: 'POST',
      body: { imageBase64: base64 },
    })
    editForm.coverImage = res.url
  } catch {
    ui.error('Error', 'No se pudo subir la imagen')
  } finally {
    uploadingCover.value = false
    if (coverFileRef.value) coverFileRef.value.value = ''
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function saveEdit() {
  if (!event.value) return
  saving.value = true
  try {
    const updated = await eventsStore.updateEvent(event.value.id, { ...editForm })
    event.value = updated
    ui.success('Evento actualizado', editForm.name)
    showEditModal.value = false
  } catch (e: unknown) {
    ui.error('Error', (e as { data?: { message?: string } })?.data?.message ?? 'No se pudo guardar')
  } finally {
    saving.value = false
  }
}

const features = computed(() => useEventFeatures(event.value?.package?.type))

const tabs = computed(() => [
  { key: 'overview', label: 'Resumen' },
  { key: 'guests', label: 'Invitados', count: event.value?._count?.guests },
  { key: 'tables', label: 'Mesas' },
])

const appUrl = useRuntimeConfig().public.appUrl
const albumUrl = computed(() => `${appUrl}/album/${event.value?.id}`)

const registroUrl = computed(() => `${appUrl}/registro/${event.value?.slug}`)

const eventLinks = computed(() => [
  {
    svg: '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>',
    label: 'Registro de invitados',
    description: 'Comparte este link para que tus invitados se registren solos',
    url: registroUrl.value,
    locked: false,
    minPlan: '',
    highlight: true,
  },
  {
    svg: '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>',
    label: 'Confirmación RSVP',
    description: '',
    url: `${appUrl}/confirmar`,
    locked: false,
    minPlan: '',
    highlight: false,
  },
  {
    svg: '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>',
    label: 'Pantalla proyección',
    description: '',
    url: `${appUrl}/pantalla/${event.value?.id}`,
    locked: features.value.cannot('screen'),
    minPlan: FEATURE_MIN_PLAN['screen'],
    highlight: false,
  },
])

const qrCanvas = ref<HTMLCanvasElement | null>(null)

async function generateQR() {
  if (!qrCanvas.value || !event.value) return
  const QRCode = await import('qrcode')
  await QRCode.toCanvas(qrCanvas.value, albumUrl.value, {
    width: 160,
    margin: 0,
    color: { dark: '#000000', light: '#ffffff' },
  })
}

function downloadQR() {
  if (!qrCanvas.value || !event.value) return
  const link = document.createElement('a')
  link.download = `qr-album-${event.value.name.replace(/\s+/g, '-').toLowerCase()}.png`
  link.href = qrCanvas.value.toDataURL('image/png')
  link.click()
}

function copyLink(url: string) {
  navigator.clipboard.writeText(url)
  ui.success('Copiado', 'Enlace copiado al portapapeles')
}

function statusLabel(status: string) {
  const map: Record<string, string> = { DRAFT: 'Borrador', ACTIVE: 'Activo', FINISHED: 'Archivado', CANCELLED: 'Cancelado' }
  return map[status] ?? status
}

function statusVariant(status: string): 'gold' | 'success' | 'neutral' | 'danger' {
  const map: Record<string, 'gold' | 'success' | 'neutral' | 'danger'> = { DRAFT: 'neutral', ACTIVE: 'success', FINISHED: 'gold', CANCELLED: 'danger' }
  return map[status] ?? 'neutral'
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function eventTypeLabel(type: string) {
  const map: Record<string, string> = { wedding: 'Boda', birthday: 'Cumpleaños', quinceañera: 'Quinceañera', corporate: 'Corporativo', other: 'Otro' }
  return map[type] ?? type
}

async function downloadPhotos() {
  if (!event.value) return
  downloading.value = true
  try {
    const { getHeaders } = useApi()
    const res = await fetch(`/api/events/${event.value.id}/download-photos`, {
      headers: getHeaders(),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message ?? 'Error al generar el ZIP')
    }
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fotos-${event.value.name.replace(/\s+/g, '-').toLowerCase()}.zip`
    a.click()
    URL.revokeObjectURL(url)
    ui.success('Descarga lista', `${event.value._count?.photos} fotos empaquetadas`)
  } catch (e: unknown) {
    ui.error('Error', (e as Error).message ?? 'No se pudo descargar')
  } finally {
    downloading.value = false
  }
}

onMounted(async () => {
  const data = await eventsStore.fetchEvent(route.params.id as string)
  event.value = data
  loading.value = false
  await nextTick()
  await generateQR()
})
</script>

<style scoped>
.preview-modal-enter-active,
.preview-modal-leave-active {
  transition: opacity 0.2s ease;
}
.preview-modal-enter-from,
.preview-modal-leave-to {
  opacity: 0;
}
</style>
