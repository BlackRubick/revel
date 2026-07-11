<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="font-display text-2xl font-bold text-white mb-1">Proveedores</h2>
        <p class="text-white/45 text-sm">Catálogo de proveedores recomendados</p>
      </div>
      <UiButton v-if="isAdmin" size="sm" @click="openAdd">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nuevo proveedor
      </UiButton>
    </div>

    <!-- Filtros -->
    <div class="flex gap-2 mb-5 flex-wrap">
      <button
        v-for="cat in ['Todos', ...CATEGORIES]"
        :key="cat"
        :class="[
          'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
          activeFilter === cat
            ? 'bg-revel-gold/15 border-revel-gold/40 text-revel-gold'
            : 'bg-white/[0.03] border-white/8 text-white/50 hover:border-white/20 hover:text-white/80'
        ]"
        @click="activeFilter = cat"
      >
        {{ cat }}
        <span v-if="cat === 'Todos'" class="ml-1 text-white/30">({{ suppliers.length }})</span>
        <span v-else class="ml-1 text-white/30">({{ suppliers.filter(s => s.category === cat).length }})</span>
      </button>
    </div>

    <!-- Grid de tarjetas -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="i in 6" :key="i" class="h-44 shimmer rounded-2xl" />
    </div>

    <div v-else-if="filtered.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="supplier in filtered"
        :key="supplier.id"
        class="card-revel p-5 flex flex-col gap-3 group hover:border-white/12 transition-all"
      >
        <!-- Top row -->
        <div class="flex items-start justify-between gap-2">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white/70"
              :style="{ background: categoryColor(supplier.category) }"
              v-html="categoryIcon(supplier.category)"
            />
            <div class="min-w-0">
              <p class="font-semibold text-white text-sm truncate">{{ supplier.name }}</p>
              <span class="inline-flex items-center px-2 py-0.5 rounded-md bg-white/5 text-white/50 text-xs mt-0.5">
                {{ supplier.category }}
              </span>
            </div>
          </div>
          <UiBadge :variant="supplier.isActive ? 'success' : 'neutral'" dot class="flex-shrink-0 mt-0.5">
            {{ supplier.isActive ? 'Activo' : 'Inactivo' }}
          </UiBadge>
        </div>

        <!-- Contacto -->
        <div class="space-y-1.5">
          <a
            v-if="supplier.phone"
            :href="`https://wa.me/52${supplier.phone.replace(/\D/g,'')}`"
            target="_blank"
            class="flex items-center gap-2 text-xs text-white/50 hover:text-green-400 transition-colors group/wa"
          >
            <svg class="w-3.5 h-3.5 flex-shrink-0 group-hover/wa:text-green-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.104.547 4.066 1.503 5.771L0 24l6.336-1.461A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.812 9.812 0 01-5.003-1.368l-.36-.214-3.76.866.9-3.646-.235-.374A9.795 9.795 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182c5.43 0 9.818 4.388 9.818 9.818 0 5.43-4.388 9.818-9.818 9.818z"/>
            </svg>
            {{ supplier.phone }}
          </a>
          <a
            v-if="supplier.email"
            :href="`mailto:${supplier.email}`"
            class="flex items-center gap-2 text-xs text-white/50 hover:text-revel-gold transition-colors"
          >
            <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {{ supplier.email }}
          </a>
          <a
            v-if="supplier.website"
            :href="supplier.website.startsWith('http') ? supplier.website : `https://${supplier.website}`"
            target="_blank"
            class="flex items-center gap-2 text-xs text-white/50 hover:text-blue-400 transition-colors truncate"
          >
            <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            {{ supplier.website }}
          </a>
          <p v-if="supplier.address" class="flex items-center gap-2 text-xs text-white/40">
            <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {{ supplier.address }}
          </p>
        </div>

        <!-- Notas -->
        <p v-if="supplier.notes" class="text-xs text-white/35 line-clamp-2 leading-relaxed border-t border-white/6 pt-3">
          {{ supplier.notes }}
        </p>

        <!-- Acciones (solo ADMIN) -->
        <div v-if="isAdmin" class="flex gap-2 mt-auto pt-2 border-t border-white/6">
          <button
            class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-revel-gold border border-revel-gold/20 hover:bg-revel-gold/8 transition-all"
            @click="openEdit(supplier)"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar
          </button>
          <button
            class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 border border-red-400/20 hover:bg-red-400/8 transition-all"
            @click="confirmDelete(supplier)"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="card-revel p-16 text-center">
      <div class="w-16 h-16 rounded-2xl bg-revel-gold/8 flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-revel-gold/60" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
      <p class="text-white/40 text-sm mb-1">
        {{ activeFilter === 'Todos' ? 'Aún no tienes proveedores registrados' : `Sin proveedores en "${activeFilter}"` }}
      </p>
      <p class="text-white/25 text-xs mb-5">Aún no hay proveedores recomendados en el catálogo</p>
      <UiButton v-if="isAdmin" size="sm" @click="openAdd">Agregar proveedor</UiButton>
    </div>

    <!-- Modal: Crear / Editar -->
    <UiModal v-model="showModal" size="lg">
      <template #header>
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-revel-gold/15 flex items-center justify-center flex-shrink-0">
            <svg class="w-4.5 h-4.5 text-revel-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <h2 class="font-display text-lg font-semibold text-white">{{ isEditing ? 'Editar proveedor' : 'Nuevo proveedor' }}</h2>
            <p class="text-xs text-white/40 mt-0.5">{{ isEditing ? form.name : 'Completa los datos del proveedor' }}</p>
          </div>
        </div>
      </template>

      <form class="space-y-0" @submit.prevent="saveSupplier">
        <div class="grid grid-cols-2 gap-4">
          <!-- Columna izquierda -->
          <div class="space-y-3">
            <UiInput v-model="form.name" label="Nombre del proveedor" placeholder="Ej. Flores del Valle" required>
              <template #prefix>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </template>
            </UiInput>

            <!-- Categoría -->
            <div>
              <label class="block text-sm font-medium text-white/70 mb-1.5">
                Categoría <span class="text-revel-gold">*</span>
              </label>
              <div class="grid grid-cols-2 gap-1.5 max-h-44 overflow-y-auto pr-1">
                <button
                  v-for="cat in CATEGORIES"
                  :key="cat"
                  type="button"
                  :class="[
                    'flex items-center px-2.5 py-2 rounded-lg border text-xs font-medium transition-all text-left',
                    form.category === cat
                      ? 'bg-revel-gold/12 border-revel-gold/35 text-revel-gold'
                      : 'bg-white/[0.02] border-white/8 text-white/50 hover:border-white/18 hover:text-white/80'
                  ]"
                  @click="form.category = cat"
                >
                  {{ cat }}
                </button>
              </div>
            </div>

            <UiInput v-model="form.address" label="Dirección" placeholder="Ciudad, Estado">
              <template #prefix>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </template>
            </UiInput>
          </div>

          <!-- Columna derecha -->
          <div class="space-y-3">
            <UiInput v-model="form.phone" label="Teléfono / WhatsApp" placeholder="55 0000 0000">
              <template #prefix>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </template>
            </UiInput>
            <UiInput v-model="form.email" label="Correo" type="email" placeholder="proveedor@correo.com">
              <template #prefix>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </template>
            </UiInput>
            <UiInput v-model="form.website" label="Sitio web / Redes sociales" placeholder="instagram.com/proveedor">
              <template #prefix>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </template>
            </UiInput>

            <div>
              <label class="block text-sm font-medium text-white/70 mb-1.5">Notas</label>
              <textarea
                v-model="form.notes"
                rows="4"
                placeholder="Precios, disponibilidad, referencias..."
                class="input-revel resize-none w-full text-sm"
              />
            </div>
          </div>
        </div>

        <!-- Estado (solo edición) -->
        <div v-if="isEditing" class="pt-4">
          <label class="block text-sm font-medium text-white/70 mb-2">Estado</label>
          <div class="grid grid-cols-2 gap-2">
            <button
              type="button"
              :class="[
                'flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all',
                form.isActive
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                  : 'bg-white/[0.03] border-white/10 text-white/40 hover:border-white/20'
              ]"
              @click="form.isActive = true"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
              Activo
            </button>
            <button
              type="button"
              :class="[
                'flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all',
                !form.isActive
                  ? 'bg-red-500/15 border-red-500/40 text-red-400'
                  : 'bg-white/[0.03] border-white/10 text-white/40 hover:border-white/20'
              ]"
              @click="form.isActive = false"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
              Inactivo
            </button>
          </div>
        </div>
      </form>

      <template #footer>
        <UiButton variant="ghost" size="sm" @click="showModal = false">Cancelar</UiButton>
        <UiButton size="sm" :loading="saving" :disabled="!form.name || !form.category" @click="saveSupplier">
          {{ isEditing ? 'Guardar cambios' : 'Crear proveedor' }}
        </UiButton>
      </template>
    </UiModal>

    <!-- Modal: Confirmar eliminar -->
    <UiModal v-model="showDeleteModal" title="Eliminar proveedor">
      <div class="text-center py-2">
        <div class="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
          <svg class="w-7 h-7 text-red-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <p class="text-white/70 text-sm">¿Eliminar a <strong class="text-white">{{ supplierToDelete?.name }}</strong>?</p>
        <p class="text-white/35 text-xs mt-1">Esta acción no se puede deshacer.</p>
      </div>
      <template #footer>
        <UiButton variant="ghost" size="sm" @click="showDeleteModal = false">Cancelar</UiButton>
        <UiButton variant="danger" size="sm" :loading="deleting" @click="deleteSupplier">Eliminar</UiButton>
      </template>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { useUiStore } from '~/stores/ui'
import { useAuthStore } from '~/stores/auth'
import type { Supplier } from '~/types'

const { get, post, put, del } = useApi()
const ui = useUiStore()
const auth = useAuthStore()
const isAdmin = computed(() => auth.user?.role === 'ADMIN')

const CATEGORIES = [
  'Catering / Banquetes',
  'Fotografía',
  'Videografía',
  'Flores / Decoración',
  'Música / Banda',
  'DJ / Sonido',
  'Iluminación',
  'Pastelería',
  'Invitaciones',
  'Mobiliario',
  'Transporte',
  'Seguridad',
  'Salón / Venue',
  'Animación',
  'Otro',
]

const ICON_MAP: Record<string, string> = {
  'Catering / Banquetes': `<svg class="w-5 h-5" style="color:currentColor" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>`,
  'Fotografía': `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
  'Videografía': `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"/></svg>`,
  'Flores / Decoración': `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>`,
  'Música / Banda': `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/></svg>`,
  'DJ / Sonido': `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 18v-6a9 9 0 0118 0v6"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg>`,
  'Iluminación': `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>`,
  'Pastelería': `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/></svg>`,
  'Invitaciones': `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`,
  'Mobiliario': `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>`,
  'Transporte': `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>`,
  'Seguridad': `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>`,
  'Salón / Venue': `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>`,
  'Animación': `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>`,
  'Otro': `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>`,
}

const COLOR_MAP: Record<string, string> = {
  'Catering / Banquetes': 'rgba(251,146,60,0.12)',
  'Fotografía': 'rgba(167,139,250,0.12)',
  'Videografía': 'rgba(96,165,250,0.12)',
  'Flores / Decoración': 'rgba(244,114,182,0.12)',
  'Música / Banda': 'rgba(52,211,153,0.12)',
  'DJ / Sonido': 'rgba(251,191,36,0.12)',
  'Iluminación': 'rgba(253,224,71,0.12)',
  'Pastelería': 'rgba(249,168,212,0.12)',
  'Invitaciones': 'rgba(212,175,55,0.12)',
  'Mobiliario': 'rgba(148,163,184,0.12)',
  'Transporte': 'rgba(34,211,238,0.12)',
  'Seguridad': 'rgba(148,163,184,0.12)',
  'Salón / Venue': 'rgba(212,175,55,0.15)',
  'Animación': 'rgba(192,132,252,0.12)',
  'Otro': 'rgba(255,255,255,0.06)',
}

function categoryIcon(cat: string) { return ICON_MAP[cat] ?? ICON_MAP['Otro'] }
function categoryColor(cat: string) { return COLOR_MAP[cat] ?? 'rgba(255,255,255,0.06)' }

const suppliers = ref<Supplier[]>([])
const loading = ref(true)
const activeFilter = ref('Todos')

const filtered = computed(() =>
  activeFilter.value === 'Todos'
    ? suppliers.value
    : suppliers.value.filter((s) => s.category === activeFilter.value),
)

const showModal = ref(false)
const saving = ref(false)
const isEditing = ref(false)
const editingId = ref('')

const emptyForm = () => ({ name: '', category: '', email: '', phone: '', website: '', address: '', notes: '', isActive: true })
const form = reactive(emptyForm())

const showDeleteModal = ref(false)
const deleting = ref(false)
const supplierToDelete = ref<Supplier | null>(null)

function openAdd() {
  isEditing.value = false
  editingId.value = ''
  Object.assign(form, emptyForm())
  showModal.value = true
}

function openEdit(supplier: Supplier) {
  isEditing.value = true
  editingId.value = supplier.id
  Object.assign(form, {
    name: supplier.name,
    category: supplier.category,
    email: supplier.email ?? '',
    phone: supplier.phone ?? '',
    website: supplier.website ?? '',
    address: supplier.address ?? '',
    notes: supplier.notes ?? '',
    isActive: supplier.isActive,
  })
  showModal.value = true
}

function confirmDelete(supplier: Supplier) {
  supplierToDelete.value = supplier
  showDeleteModal.value = true
}

async function saveSupplier() {
  if (!form.name || !form.category) return
  saving.value = true
  try {
    const payload = {
      name: form.name,
      category: form.category,
      email: form.email || undefined,
      phone: form.phone || undefined,
      website: form.website || undefined,
      address: form.address || undefined,
      notes: form.notes || undefined,
      ...(isEditing.value ? { isActive: form.isActive } : {}),
    }

    if (isEditing.value) {
      const res = await put<{ success: boolean; data: Supplier }>(`/api/suppliers/${editingId.value}`, payload)
      const idx = suppliers.value.findIndex((s) => s.id === editingId.value)
      if (idx !== -1) suppliers.value[idx] = res.data
      ui.success('Proveedor actualizado', form.name)
    } else {
      const res = await post<{ success: boolean; data: Supplier }>('/api/suppliers', payload)
      suppliers.value.unshift(res.data)
      ui.success('Proveedor creado', form.name)
    }
    showModal.value = false
  } catch (e: unknown) {
    const msg = (e as { data?: { message?: string } })?.data?.message ?? 'Error al guardar'
    ui.error('Error', msg)
  } finally {
    saving.value = false
  }
}

async function deleteSupplier() {
  if (!supplierToDelete.value) return
  deleting.value = true
  try {
    await del(`/api/suppliers/${supplierToDelete.value.id}`)
    suppliers.value = suppliers.value.filter((s) => s.id !== supplierToDelete.value!.id)
    ui.success('Proveedor eliminado', supplierToDelete.value.name)
    showDeleteModal.value = false
  } catch (e: unknown) {
    const msg = (e as { data?: { message?: string } })?.data?.message ?? 'Error al eliminar'
    ui.error('Error', msg)
  } finally {
    deleting.value = false
  }
}

onMounted(async () => {
  try {
    const res = await get<{ success: boolean; data: Supplier[] }>('/api/suppliers')
    suppliers.value = res.data
  } catch {
    ui.error('Error', 'No se pudo cargar el catálogo de proveedores')
  } finally {
    loading.value = false
  }
})
</script>
