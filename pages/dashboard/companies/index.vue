<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="font-display text-2xl font-bold text-white mb-1">Empresas</h2>
        <p class="text-white/45 text-sm">Gestiona las empresas clientes y sus encargados</p>
      </div>
      <UiButton size="sm" @click="showAddModal = true">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nueva empresa
      </UiButton>
    </div>

    <div class="card-revel overflow-hidden">
      <table class="table-revel">
        <thead>
          <tr>
            <th>Empresa</th>
            <th>Encargado</th>
            <th>Contacto</th>
            <th>Usuarios</th>
            <th>Estado</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="company in companies" :key="company.id" class="group">
            <td>
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-revel-gold/15 flex items-center justify-center text-revel-gold text-xs font-bold flex-shrink-0">
                  {{ (company.name[0] ?? '?').toUpperCase() }}
                </div>
                <div>
                  <p class="font-medium text-white text-sm">{{ company.name }}</p>
                  <p v-if="company.address" class="text-xs text-white/40">{{ company.address }}</p>
                </div>
              </div>
            </td>
            <td>
              <div v-if="encargadoOf(company)" class="text-sm">
                <p class="text-white font-medium">{{ encargadoOf(company)?.name }}</p>
                <p class="text-white/40 text-xs">{{ encargadoOf(company)?.email }}</p>
              </div>
              <span v-else class="text-white/30 text-xs">Sin encargado</span>
            </td>
            <td class="text-white/50 text-sm">{{ company.email || '—' }}</td>
            <td>
              <span class="inline-flex items-center gap-1 text-sm text-white/60">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {{ company._count?.users ?? 0 }}
              </span>
            </td>
            <td>
              <UiBadge :variant="company.isActive ? 'success' : 'danger'" dot>
                {{ company.isActive ? 'Activa' : 'Inactiva' }}
              </UiBadge>
            </td>
            <td class="text-center">
              <div class="flex items-center justify-center gap-2">
                <button
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-revel-gold border border-revel-gold/25 hover:bg-revel-gold/10 transition-all"
                  @click="openEdit(company)"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </button>
                <button
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 border border-red-400/25 hover:bg-red-400/10 transition-all"
                  @click="confirmDelete(company)"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="!companies.length && !loading">
            <td colspan="6" class="text-center py-8 text-white/30 text-sm">Sin empresas registradas</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal: Nueva empresa -->
    <UiModal v-model="showAddModal" size="lg">
      <template #header>
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-revel-gold/15 flex items-center justify-center flex-shrink-0">
            <svg class="w-4.5 h-4.5 text-revel-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h2 class="font-display text-lg font-semibold text-white">Nueva empresa</h2>
            <p class="text-xs text-white/40 mt-0.5">Completa los datos de la empresa y su encargado</p>
          </div>
        </div>
      </template>

      <form @submit.prevent="createCompany">
        <div class="grid grid-cols-2 gap-4">
          <!-- Columna empresa -->
          <div class="rounded-xl bg-white/[0.03] border border-white/8 p-4 space-y-3">
            <div class="flex items-center gap-2 mb-4">
              <div class="w-7 h-7 rounded-lg bg-revel-gold/10 flex items-center justify-center flex-shrink-0">
                <svg class="w-3.5 h-3.5 text-revel-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span class="text-xs font-semibold uppercase tracking-widest text-revel-gold/80">Empresa</span>
            </div>
            <UiInput v-model="newForm.companyName" label="Nombre" placeholder="Ej. Eventos Luna SA" required>
              <template #prefix>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </template>
            </UiInput>
            <UiInput v-model="newForm.companyEmail" label="Correo de contacto" type="email" placeholder="empresa@correo.com">
              <template #prefix>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </template>
            </UiInput>
            <UiInput v-model="newForm.companyPhone" label="Teléfono" placeholder="+52 55 0000 0000">
              <template #prefix>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </template>
            </UiInput>
            <UiInput v-model="newForm.companyAddress" label="Dirección" placeholder="Ciudad de México, MX">
              <template #prefix>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </template>
            </UiInput>
          </div>

          <!-- Columna encargado -->
          <div class="rounded-xl bg-white/[0.03] border border-white/8 p-4 space-y-3">
            <div class="flex items-center gap-2 mb-4">
              <div class="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <svg class="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span class="text-xs font-semibold uppercase tracking-widest text-blue-400/80">Encargado</span>
            </div>
            <UiInput v-model="newForm.encargadoName" label="Nombre completo" placeholder="Ej. María García" required>
              <template #prefix>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </template>
            </UiInput>
            <UiInput v-model="newForm.encargadoEmail" label="Correo" type="email" placeholder="encargado@empresa.com" required>
              <template #prefix>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </template>
            </UiInput>
            <UiInput v-model="newForm.encargadoPassword" label="Contraseña" type="password" placeholder="Mínimo 6 caracteres" required>
              <template #prefix>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </template>
            </UiInput>

          </div>
        </div>
      </form>

      <template #footer>
        <UiButton variant="ghost" size="sm" @click="showAddModal = false">Cancelar</UiButton>
        <UiButton size="sm" :loading="creating" @click="createCompany">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Crear empresa
        </UiButton>
      </template>
    </UiModal>

    <!-- Modal: Editar empresa -->
    <UiModal v-model="showEditModal">
      <template #header>
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-revel-gold/15 flex items-center justify-center flex-shrink-0">
            <svg class="w-4.5 h-4.5 text-revel-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <h2 class="font-display text-lg font-semibold text-white">Editar empresa</h2>
            <p class="text-xs text-white/40 mt-0.5">{{ editForm.name }}</p>
          </div>
        </div>
      </template>

      <form class="space-y-3" @submit.prevent="saveEdit">
        <UiInput v-model="editForm.name" label="Nombre de la empresa" required>
          <template #prefix>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </template>
        </UiInput>
        <UiInput v-model="editForm.email" label="Correo de contacto" type="email">
          <template #prefix>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </template>
        </UiInput>
        <UiInput v-model="editForm.phone" label="Teléfono">
          <template #prefix>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </template>
        </UiInput>
        <UiInput v-model="editForm.address" label="Dirección">
          <template #prefix>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </template>
        </UiInput>

        <div class="pt-1">
          <label class="block text-sm font-medium text-white/70 mb-2">Estado</label>
          <div class="grid grid-cols-2 gap-2">
            <button
              type="button"
              :class="[
                'flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all',
                editActiveValue === 'true'
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                  : 'bg-white/[0.03] border-white/10 text-white/40 hover:border-white/20'
              ]"
              @click="editActiveValue = 'true'"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
              Activa
            </button>
            <button
              type="button"
              :class="[
                'flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all',
                editActiveValue === 'false'
                  ? 'bg-red-500/15 border-red-500/40 text-red-400'
                  : 'bg-white/[0.03] border-white/10 text-white/40 hover:border-white/20'
              ]"
              @click="editActiveValue = 'false'"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
              Inactiva
            </button>
          </div>
        </div>
      </form>

      <template #footer>
        <UiButton variant="ghost" size="sm" @click="showEditModal = false">Cancelar</UiButton>
        <UiButton size="sm" :loading="saving" @click="saveEdit">Guardar cambios</UiButton>
      </template>
    </UiModal>

    <!-- Modal: Confirmar eliminar -->
    <UiModal v-model="showDeleteModal" title="Eliminar empresa">
      <div class="text-center py-2">
        <div class="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
          <svg class="w-7 h-7 text-red-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <p class="text-white/70 text-sm">¿Eliminar <strong class="text-white">{{ companyToDelete?.name }}</strong>?</p>
        <p class="text-white/35 text-xs mt-1">Se eliminarán todos los usuarios asociados. Esta acción no se puede deshacer.</p>
      </div>
      <template #footer>
        <UiButton variant="ghost" size="sm" @click="showDeleteModal = false">Cancelar</UiButton>
        <UiButton variant="danger" size="sm" :loading="deleting" @click="deleteCompany">Eliminar</UiButton>
      </template>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { useUiStore } from '~/stores/ui'
import type { Company } from '~/types'

const { get, post, put, del } = useApi()
const ui = useUiStore()

const companies = ref<Company[]>([])
const loading = ref(true)

const showAddModal = ref(false)
const creating = ref(false)
const newForm = reactive({
  companyName: '',
  companyEmail: '',
  companyPhone: '',
  companyAddress: '',
  encargadoName: '',
  encargadoEmail: '',
  encargadoPassword: '',
})

const showEditModal = ref(false)
const saving = ref(false)
const editForm = reactive({ id: '', name: '', email: '', phone: '', address: '' })
const editActiveValue = ref('true')

const showDeleteModal = ref(false)
const deleting = ref(false)
const companyToDelete = ref<Company | null>(null)

function encargadoOf(company: Company) {
  return company.users?.[0] ?? null
}

function openEdit(company: Company) {
  Object.assign(editForm, {
    id: company.id,
    name: company.name,
    email: company.email ?? '',
    phone: company.phone ?? '',
    address: company.address ?? '',
  })
  editActiveValue.value = company.isActive ? 'true' : 'false'
  showEditModal.value = true
}

function confirmDelete(company: Company) {
  companyToDelete.value = company
  showDeleteModal.value = true
}

async function createCompany() {
  if (!newForm.companyName || !newForm.encargadoName || !newForm.encargadoEmail || !newForm.encargadoPassword) return
  creating.value = true
  try {
    const res = await post<{ success: boolean; data: { company: Company } }>('/api/companies', {
      company: {
        name: newForm.companyName,
        email: newForm.companyEmail || undefined,
        phone: newForm.companyPhone || undefined,
        address: newForm.companyAddress || undefined,
      },
      encargado: {
        name: newForm.encargadoName,
        email: newForm.encargadoEmail,
        password: newForm.encargadoPassword,
      },
    })
    await loadCompanies()
    ui.success('Empresa creada', newForm.companyName)
    showAddModal.value = false
    Object.assign(newForm, {
      companyName: '', companyEmail: '', companyPhone: '', companyAddress: '',
      encargadoName: '', encargadoEmail: '', encargadoPassword: '',
    })
  } catch (e: unknown) {
    const msg = (e as { data?: { message?: string } })?.data?.message ?? 'Error al crear empresa'
    ui.error('Error', msg)
  } finally {
    creating.value = false
  }
}

async function saveEdit() {
  saving.value = true
  try {
    const res = await put<{ success: boolean; data: Company }>(`/api/companies/${editForm.id}`, {
      name: editForm.name,
      email: editForm.email || undefined,
      phone: editForm.phone || undefined,
      address: editForm.address || undefined,
      isActive: editActiveValue.value === 'true',
    })
    await loadCompanies()
    ui.success('Empresa actualizada', editForm.name)
    showEditModal.value = false
  } catch (e: unknown) {
    const msg = (e as { data?: { message?: string } })?.data?.message ?? 'Error al actualizar'
    ui.error('Error', msg)
  } finally {
    saving.value = false
  }
}

async function deleteCompany() {
  if (!companyToDelete.value) return
  deleting.value = true
  try {
    await del(`/api/companies/${companyToDelete.value.id}`)
    companies.value = companies.value.filter((c) => c.id !== companyToDelete.value!.id)
    ui.success('Empresa eliminada', companyToDelete.value.name)
    showDeleteModal.value = false
  } catch (e: unknown) {
    const msg = (e as { data?: { message?: string } })?.data?.message ?? 'Error al eliminar'
    ui.error('Error', msg)
  } finally {
    deleting.value = false
  }
}

async function loadCompanies() {
  const res = await get<{ success: boolean; data: Company[] }>('/api/companies')
  companies.value = res.data
}

onMounted(async () => {
  try {
    await loadCompanies()
  } catch {
    ui.error('Error', 'No se pudo cargar la lista de empresas')
  } finally {
    loading.value = false
  }
})
</script>
