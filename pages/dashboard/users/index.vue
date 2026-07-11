<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="font-display text-2xl font-bold text-white mb-1">Usuarios</h2>
        <p class="text-white/45 text-sm">Administra los usuarios de la plataforma</p>
      </div>
      <UiButton size="sm" @click="showAddModal = true">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nuevo usuario
      </UiButton>
    </div>

    <div class="card-revel overflow-hidden">
      <table class="table-revel">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Creado</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="group">
            <td>
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-revel-gold/15 flex items-center justify-center text-revel-gold text-xs font-bold">
                  {{ user.name[0] }}
                </div>
                <div>
                  <p class="font-medium text-white text-sm">{{ user.name }}</p>
                  <p class="text-xs text-white/40">{{ user.email }}</p>
                </div>
              </div>
            </td>
            <td>
              <UiBadge :variant="roleVariant(user.role)">{{ roleLabel(user.role) }}</UiBadge>
            </td>
            <td>
              <UiBadge :variant="user.isActive ? 'success' : 'danger'" dot>
                {{ user.isActive ? 'Activo' : 'Inactivo' }}
              </UiBadge>
            </td>
            <td class="text-white/40 text-sm">{{ formatDate(user.createdAt) }}</td>
            <td class="text-center">
              <div class="flex items-center justify-center gap-2">
                <button
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-revel-gold border border-revel-gold/25 hover:bg-revel-gold/10 transition-all"
                  @click="openEdit(user)"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  Editar
                </button>
                <button
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 border border-red-400/25 hover:bg-red-400/10 transition-all"
                  @click="confirmDelete(user)"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="!users.length && !loading">
            <td colspan="5" class="text-center py-8 text-white/30 text-sm">Sin usuarios</td>
          </tr>
        </tbody>
      </table>
    </div>

    
    <UiModal v-model="showAddModal" title="Crear usuario">
      <form class="space-y-4" @submit.prevent="createUser">
        <UiInput v-model="newUser.name" label="Nombre completo" required />
        <UiInput v-model="newUser.email" label="Correo" type="email" required />
        <UiInput v-model="newUser.password" label="Contraseña" type="password" required />
        <UiSelect v-model="newUser.role" label="Rol" :options="roleOptions" required />
      </form>
      <template #footer>
        <UiButton variant="ghost" size="sm" @click="showAddModal = false">Cancelar</UiButton>
        <UiButton size="sm" :loading="creating" @click="createUser">Crear</UiButton>
      </template>
    </UiModal>

    
    <UiModal v-model="showEditModal" title="Editar usuario">
      <form class="space-y-4" @submit.prevent="saveEdit">
        <UiInput v-model="editUser.name" label="Nombre completo" required />
        <UiInput v-model="editUser.email" label="Correo" type="email" required />
        <UiInput v-model="editUser.password" label="Nueva contraseña" type="password" placeholder="Dejar vacío para no cambiar" />
        <UiSelect v-model="editUser.role" label="Rol" :options="roleOptions" required />
      </form>
      <template #footer>
        <UiButton variant="ghost" size="sm" @click="showEditModal = false">Cancelar</UiButton>
        <UiButton size="sm" :loading="saving" @click="saveEdit">Guardar cambios</UiButton>
      </template>
    </UiModal>

    
    <UiModal v-model="showDeleteModal" title="Eliminar usuario">
      <div class="text-center py-2">
        <div class="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
          <svg class="w-7 h-7 text-red-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </div>
        <p class="text-white/70 text-sm">¿Eliminar a <strong class="text-white">{{ userToDelete?.name }}</strong>?</p>
        <p class="text-white/35 text-xs mt-1">Esta acción no se puede deshacer.</p>
      </div>
      <template #footer>
        <UiButton variant="ghost" size="sm" @click="showDeleteModal = false">Cancelar</UiButton>
        <UiButton variant="danger" size="sm" :loading="deleting" @click="deleteUser">Eliminar</UiButton>
      </template>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { useUiStore } from '~/stores/ui'
import { useAuthStore } from '~/stores/auth'
import type { User } from '~/types'

const { get, post, put, del } = useApi()
const ui = useUiStore()
const auth = useAuthStore()

const isAdmin = computed(() => auth.user?.role === 'ADMIN')

const users = ref<User[]>([])
const loading = ref(true)
const showAddModal = ref(false)
const creating = ref(false)

const newUser = reactive({ name: '', email: '', password: '', role: 'ORGANIZER' })

const showEditModal = ref(false)
const saving = ref(false)
const editUser = reactive({ id: '', name: '', email: '', password: '', role: 'ORGANIZER' })

const showDeleteModal = ref(false)
const deleting = ref(false)
const userToDelete = ref<User | null>(null)

function openEdit(user: User) {
  Object.assign(editUser, { id: user.id, name: user.name, email: user.email, password: '', role: user.role })
  showEditModal.value = true
}

async function saveEdit() {
  saving.value = true
  try {
    const payload: Record<string, string> = { name: editUser.name, email: editUser.email, role: editUser.role }
    if (editUser.password) payload.password = editUser.password
    const res = await put<{ success: boolean; data: User }>(`/api/users/${editUser.id}`, payload)
    const idx = users.value.findIndex((u) => u.id === editUser.id)
    if (idx !== -1) users.value[idx] = res.data
    ui.success('Usuario actualizado', editUser.name)
    showEditModal.value = false
  } catch (e: unknown) {
    const msg = (e as { data?: { message?: string } })?.data?.message ?? 'Error al actualizar'
    ui.error('Error', msg)
  } finally {
    saving.value = false
  }
}

function confirmDelete(user: User) {
  userToDelete.value = user
  showDeleteModal.value = true
}

async function deleteUser() {
  if (!userToDelete.value) return
  deleting.value = true
  try {
    await del(`/api/users/${userToDelete.value.id}`)
    users.value = users.value.filter((u) => u.id !== userToDelete.value!.id)
    ui.success('Usuario eliminado', userToDelete.value.name)
    showDeleteModal.value = false
  } catch (e: unknown) {
    const msg = (e as { data?: { message?: string } })?.data?.message ?? 'Error al eliminar'
    ui.error('Error', msg)
  } finally {
    deleting.value = false
  }
}

const roleOptions = computed(() => {
  if (isAdmin.value) {
    return [
      { label: 'Organizador', value: 'ORGANIZER' },
      { label: 'Escáner', value: 'SCANNER' },
      { label: 'Pantalla', value: 'SCREEN' },
      { label: 'Administrador', value: 'ADMIN' },
    ]
  }
  return [
    { label: 'Organizador', value: 'ORGANIZER' },
    { label: 'Escáner', value: 'SCANNER' },
    { label: 'Pantalla', value: 'SCREEN' },
  ]
})

function roleLabel(role: string) {
  const map: Record<string, string> = { ADMIN: 'Admin', ENCARGADO: 'Encargado', ORGANIZER: 'Organizador', SCANNER: 'Escáner', SCREEN: 'Pantalla', GUEST: 'Invitado' }
  return map[role] ?? role
}

function roleVariant(role: string): 'gold' | 'info' | 'neutral' | 'success' | 'danger' {
  const map: Record<string, 'gold' | 'info' | 'neutral' | 'success' | 'danger'> = {
    ADMIN: 'gold', ENCARGADO: 'danger', ORGANIZER: 'info', SCANNER: 'success', SCREEN: 'neutral',
  }
  return map[role] ?? 'neutral'
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })
}

async function createUser() {
  if (!newUser.name || !newUser.email || !newUser.password) return
  creating.value = true
  try {
    const res = await post<{ success: boolean; data: User }>('/api/users', { ...newUser })
    users.value.unshift(res.data)
    ui.success('Usuario creado', newUser.name)
    showAddModal.value = false
    Object.assign(newUser, { name: '', email: '', password: '', role: 'ORGANIZER' })
  } catch (e: unknown) {
    const msg = (e as { data?: { message?: string } })?.data?.message ?? 'Error al crear usuario'
    ui.error('Error', msg)
  } finally {
    creating.value = false
  }
}

onMounted(async () => {
  try {
    const res = await get<{ success: boolean; data: User[] }>('/api/users')
    users.value = res.data
  } catch {
    ui.error('Error', 'No se pudo cargar la lista de usuarios')
  } finally {
    loading.value = false
  }
})
</script>
