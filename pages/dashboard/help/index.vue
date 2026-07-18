<template>
  <div>
    <div class="mb-8">
      <h2 class="font-display text-2xl font-bold text-white mb-1">Centro de ayuda</h2>
      <p class="text-white/45 text-sm">Todo lo que necesitas saber para usar Rével sin complicaciones</p>
    </div>

    <!-- Buscador -->
    <div class="relative mb-6">
      <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
      </svg>
      <input
        v-model="search"
        type="text"
        placeholder="Busca una pregunta, por ejemplo: ¿cómo creo un evento?"
        class="input-revel pl-10 w-full"
      />
    </div>

    <!-- Filtros por categoría -->
    <div class="flex flex-wrap gap-2 mb-8">
      <button
        v-for="cat in categories"
        :key="cat.id"
        class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all"
        :class="activeCategory === cat.id
          ? 'bg-revel-gold text-revel-black'
          : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'"
        @click="activeCategory = activeCategory === cat.id ? 'all' : cat.id"
      >
        <span>{{ cat.emoji }}</span>
        {{ cat.label }}
      </button>
    </div>

    <!-- Sin resultados -->
    <div v-if="filteredItems.length === 0" class="text-center py-16">
      <div class="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-3 text-3xl">🔍</div>
      <p class="text-white/50 text-sm">No encontramos preguntas con "<strong class="text-white">{{ search }}</strong>"</p>
      <button class="text-revel-gold text-sm mt-2 hover:underline" @click="search = ''">Limpiar búsqueda</button>
    </div>

    <!-- Preguntas agrupadas por categoría -->
    <div v-else class="space-y-8">
      <div v-for="cat in visibleCategories" :key="cat.id">
        <div class="flex items-center gap-2.5 mb-3">
          <span class="text-xl">{{ cat.emoji }}</span>
          <h3 class="font-display text-base font-semibold text-white">{{ cat.label }}</h3>
        </div>

        <div class="space-y-2">
          <div
            v-for="item in itemsByCategory(cat.id)"
            :key="item.id"
            class="rounded-xl border transition-all duration-200"
            :class="openItems.has(item.id)
              ? 'bg-white/5 border-revel-gold/30'
              : 'bg-white/[0.03] border-white/8 hover:border-white/15'"
          >
            <button
              class="w-full flex items-center justify-between gap-4 px-4 py-3.5 text-left"
              @click="toggle(item.id)"
            >
              <span class="text-sm font-medium text-white leading-snug">{{ item.question }}</span>
              <svg
                class="w-4 h-4 text-white/40 flex-shrink-0 transition-transform duration-200"
                :class="openItems.has(item.id) ? 'rotate-180 text-revel-gold' : ''"
                fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            <Transition name="expand">
              <div v-if="openItems.has(item.id)" class="overflow-hidden">
                <div class="px-4 pb-4">
                  <div class="h-px bg-white/6 mb-3" />
                  <div class="text-sm text-white/60 leading-relaxed space-y-2" v-html="item.answer" />
                  <div v-if="item.tip" class="mt-3 flex items-start gap-2 bg-revel-gold/8 border border-revel-gold/20 rounded-lg px-3 py-2.5">
                    <span class="text-base flex-shrink-0">💡</span>
                    <p class="text-xs text-revel-gold/80 leading-relaxed">{{ item.tip }}</p>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-12 card-revel text-center py-8">
      <p class="text-2xl mb-2">🙋</p>
      <p class="text-white font-medium text-sm mb-1">¿No encontraste lo que buscabas?</p>
      <p class="text-white/40 text-xs">Contacta a tu administrador o escribe al soporte de Rével</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const search = ref('')
const activeCategory = ref('all')
const openItems = ref(new Set<string>())

function toggle(id: string) {
  if (openItems.value.has(id)) {
    openItems.value.delete(id)
  } else {
    openItems.value.add(id)
  }
}

const categories = [
  { id: 'all',       emoji: '✨', label: 'Todo' },
  { id: 'start',     emoji: '🚀', label: 'Primeros pasos' },
  { id: 'events',    emoji: '🎉', label: 'Eventos' },
  { id: 'guests',    emoji: '👥', label: 'Invitados' },
  { id: 'tables',    emoji: '🪑', label: 'Mesas' },
  { id: 'album',     emoji: '📷', label: 'Álbum de fotos' },
  { id: 'qr',        emoji: '📲', label: 'Códigos QR' },
  { id: 'users',     emoji: '🔐', label: 'Usuarios y roles' },
]

const faqItems = [
  // PRIMEROS PASOS
  {
    id: 'start-1',
    category: 'start',
    question: '¿Qué es Rével y para qué sirve?',
    answer: 'Rével es una plataforma para organizar eventos de manera profesional. Desde aquí puedes crear eventos como bodas, cumpleaños o fiestas, gestionar tu lista de invitados, organizar las mesas del salón, recopilar fotos de los asistentes y controlar quién entra con códigos QR. Todo en un solo lugar, desde tu computadora o celular.',
    tip: 'No necesitas saber de tecnología para usar Rével. Si puedes usar WhatsApp, puedes usar esto.',
  },
  {
    id: 'start-2',
    category: 'start',
    question: '¿Por dónde empiezo si es mi primer evento?',
    answer: 'El orden ideal es este:<br><br><strong class="text-white">1.</strong> Ve a <strong class="text-white">Eventos</strong> y crea tu primer evento con el nombre, fecha y lugar.<br><strong class="text-white">2.</strong> Entra al evento y agrega tus <strong class="text-white">Invitados</strong>.<br><strong class="text-white">3.</strong> Si vas a tener mesas asignadas, ve a <strong class="text-white">Mesas</strong> y organiza el plano del salón.<br><strong class="text-white">4.</strong> El día del evento usa el <strong class="text-white">Escáner QR</strong> para registrar las llegadas.',
    tip: 'Puedes ir completando la información poco a poco. No todo tiene que estar listo desde el principio.',
  },

  // EVENTOS
  {
    id: 'events-1',
    category: 'events',
    question: '¿Cómo creo un evento?',
    answer: 'Haz clic en <strong class="text-white">Eventos</strong> en el menú de la izquierda, luego en el botón <strong class="text-white">"Nuevo evento"</strong> que está arriba a la derecha. Llena el nombre del evento, la fecha, el lugar y elige de qué tipo es (boda, cumpleaños, quinceañera, etc.). Al terminar presiona <strong class="text-white">"Crear evento"</strong> y ¡listo!',
    tip: 'Ponle un nombre claro al evento, por ejemplo "Boda de Ana y Carlos - Junio 2025". Así lo encontrarás fácil después.',
  },
  {
    id: 'events-2',
    category: 'events',
    question: '¿Qué significa cada estado del evento?',
    answer: '<strong class="text-white">Borrador:</strong> El evento está en preparación. Todavía no está activo y puedes editarlo con calma.<br><br><strong class="text-white">Activo:</strong> El evento ya está en marcha. Los invitados pueden confirmar asistencia y subir fotos.<br><br><strong class="text-white">Finalizado:</strong> El evento ya terminó. Puedes seguir viendo toda la información pero ya no se harán cambios.<br><br><strong class="text-white">Cancelado:</strong> El evento fue cancelado.',
  },
  {
    id: 'events-3',
    category: 'events',
    question: '¿Cómo edito la información de un evento?',
    answer: 'Ve a <strong class="text-white">Eventos</strong>, busca el evento que quieres cambiar y haz clic en él para abrirlo. Ahí verás un botón de <strong class="text-white">editar</strong>. Puedes cambiar el nombre, fecha, lugar, imagen de portada y más.',
  },

  // INVITADOS
  {
    id: 'guests-1',
    category: 'guests',
    question: '¿Cómo agrego invitados a mi evento?',
    answer: 'Ve a <strong class="text-white">Invitados</strong> en el menú, selecciona tu evento de la lista y haz clic en <strong class="text-white">"Nuevo invitado"</strong>. Escribe el nombre de la persona y, si quieres, su teléfono o correo. También puedes indicar cuántos acompañantes trae.',
    tip: 'Si tienes muchos invitados puedes agregarlos uno por uno. No hay límite.',
  },
  {
    id: 'guests-2',
    category: 'guests',
    question: '¿Qué es el RSVP o confirmación de asistencia?',
    answer: 'RSVP es la confirmación de si el invitado va a ir al evento o no. Cada invitado puede tener uno de estos estados:<br><br><strong class="text-white">Pendiente:</strong> Todavía no ha confirmado.<br><strong class="text-white">Confirmado:</strong> Dijo que sí va.<br><strong class="text-white">Declinado:</strong> Dijo que no puede ir.<br><br>Puedes cambiar el estado manualmente desde la lista de invitados.',
  },
  {
    id: 'guests-3',
    category: 'guests',
    question: '¿Qué es el check-in?',
    answer: 'El check-in es el registro de que un invitado llegó al evento. Cuando el invitado llega, alguien con el rol de <strong class="text-white">Escáner</strong> escanea su código QR en la entrada. El sistema lo marca automáticamente como "llegado" y puedes ver en tiempo real cuántas personas han entrado.',
  },

  // MESAS
  {
    id: 'tables-1',
    category: 'tables',
    question: '¿Cómo organizo las mesas del salón?',
    answer: 'Ve a <strong class="text-white">Mesas</strong> en el menú y selecciona tu evento. Verás el plano del salón donde puedes crear mesas nuevas con el botón <strong class="text-white">"Agregar mesa"</strong>. Puedes ponerle nombre a cada mesa (Mesa 1, Mesa de los novios, etc.) y definir cuántas personas caben.',
    tip: 'Crear las mesas antes de asignar invitados te facilita mucho la organización.',
  },
  {
    id: 'tables-2',
    category: 'tables',
    question: '¿Cómo asigno invitados a una mesa?',
    answer: 'Una vez que tienes tus mesas creadas, ve a la sección de <strong class="text-white">Invitados</strong>, selecciona un invitado y busca la opción de asignar mesa. Elige la mesa donde quieres sentarlo y guarda los cambios. También puedes hacerlo desde la vista de Mesas.',
  },
  {
    id: 'tables-3',
    category: 'tables',
    question: '¿Qué pasa si una mesa ya está llena?',
    answer: 'El sistema te avisa cuando una mesa ya alcanzó su capacidad máxima. Así evitas poner más personas de las que caben en una mesa. Si necesitas más espacio, puedes aumentar la capacidad de la mesa o crear una nueva.',
  },

  // ÁLBUM
  {
    id: 'album-1',
    category: 'album',
    question: '¿Cómo suben fotos los invitados?',
    answer: 'Cada evento tiene un <strong class="text-white">código QR especial para el álbum</strong>. Los invitados lo escanean con la cámara de su celular (sin necesidad de descargar ninguna app) y se abre una página donde pueden subir sus fotos directamente desde su galería o tomando fotos en ese momento.',
    tip: 'Pon el código QR del álbum en un lugar visible del salón, como en las mesas o en la entrada.',
  },
  {
    id: 'album-2',
    category: 'album',
    question: '¿Dónde veo las fotos que subieron los invitados?',
    answer: 'Ve a <strong class="text-white">Álbum</strong> en el menú y selecciona tu evento. Ahí verás todas las fotos que han subido los asistentes, con el nombre de quien la subió y la hora. Puedes hacer clic en cualquier foto para verla más grande.',
  },
  {
    id: 'album-3',
    category: 'album',
    question: '¿Puedo descargar todas las fotos del evento?',
    answer: 'Sí. Entra al álbum de tu evento y haz clic en <strong class="text-white">"Descargar todo"</strong>. El sistema preparará un archivo comprimido con todas las fotos y la descarga empezará automáticamente en tu computadora. Puede tardar unos segundos si hay muchas fotos.',
  },

  // QR
  {
    id: 'qr-1',
    category: 'qr',
    question: '¿Qué es el código QR de cada invitado?',
    answer: 'Cada invitado tiene su propio código QR, que funciona como un <strong class="text-white">boleto digital único</strong>. Este código identifica a esa persona en el evento. Al llegar, el escáner lee el código y el sistema confirma que es un invitado válido y registra su llegada.',
  },
  {
    id: 'qr-2',
    category: 'qr',
    question: '¿Cómo escaneo los códigos QR en la entrada?',
    answer: 'Ve a <strong class="text-white">Escáner QR</strong> en el menú (o dale acceso a alguien con el rol de Escáner). Se activa la cámara del celular o computadora. Solo apunta al código QR del invitado y automáticamente el sistema lo registra como llegado. No hay que hacer nada más.',
    tip: 'Funciona mucho mejor desde un celular en la entrada del evento. El escáner es muy rápido.',
  },
  {
    id: 'qr-3',
    category: 'qr',
    question: '¿Para qué sirve la pantalla del evento?',
    answer: 'La pantalla del evento es una vista especial que puedes proyectar en una pantalla grande dentro del salón. Muestra las fotos que van subiendo los invitados en tiempo real, mensajes y detalles del evento. Es una forma divertida de que todos vean las fotos durante la fiesta.',
  },

  // USUARIOS Y ROLES
  {
    id: 'users-1',
    category: 'users',
    question: '¿Qué puede hacer cada tipo de usuario?',
    answer: '<strong class="text-white">Administrador:</strong> Tiene acceso completo al sistema. Puede ver y hacer todo.<br><br><strong class="text-white">Encargado:</strong> Gestiona una empresa dentro del sistema. Puede crear y administrar organizadores y sus eventos.<br><br><strong class="text-white">Organizador:</strong> Se encarga de los eventos. Crea eventos, gestiona invitados, mesas y el álbum.<br><br><strong class="text-white">Escáner:</strong> Solo puede escanear los códigos QR de invitados en la entrada del evento.<br><br><strong class="text-white">Pantalla:</strong> Accede a la pantalla del evento que se proyecta en el salón.',
  },
  {
    id: 'users-2',
    category: 'users',
    question: '¿Cómo agrego a alguien a mi equipo?',
    answer: 'Ve a <strong class="text-white">Usuarios</strong> en el menú y haz clic en <strong class="text-white">"Nuevo usuario"</strong>. Escribe su nombre, correo electrónico y una contraseña. Elige qué tipo de usuario va a ser (organizador, escáner, etc.) y presiona <strong class="text-white">"Crear"</strong>. Esa persona ya podrá entrar al sistema con esos datos.',
    tip: 'Usa una contraseña segura y dísela a la persona de forma privada. Ellos la pueden cambiar después.',
  },
  {
    id: 'users-3',
    category: 'users',
    question: '¿Puedo darle acceso limitado a alguien?',
    answer: 'Sí. Al elegir el tipo de usuario puedes controlar exactamente a qué partes del sistema puede entrar:<br><br>Si solo va a registrar entradas el día del evento → dale el rol de <strong class="text-white">Escáner</strong>.<br>Si solo va a ver la pantalla de fotos → dale el rol de <strong class="text-white">Pantalla</strong>.<br>Si va a organizar eventos completos → dale el rol de <strong class="text-white">Organizador</strong>.',
  },
]

const filteredItems = computed(() => {
  return faqItems.filter((item) => {
    const matchSearch = !search.value
      || item.question.toLowerCase().includes(search.value.toLowerCase())
      || item.answer.toLowerCase().includes(search.value.toLowerCase())
    const matchCat = activeCategory.value === 'all' || item.category === activeCategory.value
    return matchSearch && matchCat
  })
})

const visibleCategories = computed(() => {
  const catIds = new Set(filteredItems.value.map((i) => i.category))
  return categories.filter((c) => c.id !== 'all' && catIds.has(c.id))
})

function itemsByCategory(catId: string) {
  return filteredItems.value.filter((i) => i.category === catId)
}
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: max-height 0.25s ease, opacity 0.2s ease;
  max-height: 600px;
  opacity: 1;
}
.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
