export type EventFeatureKey =
  | 'rsvp'        // Confirmación de asistencia
  | 'whatsapp'    // Envío de invitación por WhatsApp
  | 'qr'          // Códigos QR
  | 'album'       // Álbum digital (subir fotos)
  | 'tables'      // Asignación de mesas
  | 'download'    // Descarga de fotos en ZIP
  | 'screen'      // Pantalla de proyección en tiempo real

const PACKAGE_FEATURES: Record<string, EventFeatureKey[]> = {
  BASIC:         ['rsvp', 'whatsapp', 'qr', 'album'],
  INTERMEDIATE:  ['rsvp', 'whatsapp', 'qr', 'album', 'tables', 'download'],
  ALL_INCLUSIVE: ['rsvp', 'whatsapp', 'qr', 'album', 'tables', 'download', 'screen'],
  ENTERPRISE:    ['rsvp', 'whatsapp', 'qr', 'album', 'tables', 'download', 'screen'],
}

export const FEATURE_LABELS: Record<EventFeatureKey, string> = {
  rsvp:      'Confirmación de asistencia',
  whatsapp:  'Invitación por WhatsApp',
  qr:        'Códigos QR',
  album:     'Álbum digital',
  tables:    'Asignación de mesas',
  download:  'Descarga de fotos',
  screen:    'Pantalla en tiempo real',
}

export const FEATURE_MIN_PLAN: Record<EventFeatureKey, string> = {
  rsvp:      'Básico',
  whatsapp:  'Básico',
  qr:        'Básico',
  album:     'Básico',
  tables:    'Intermedio',
  download:  'Intermedio',
  screen:    'All Inclusive',
}

export function useEventFeatures(packageType: string | undefined | null) {
  const allowed = PACKAGE_FEATURES[packageType ?? ''] ?? PACKAGE_FEATURES.BASIC

  function can(feature: EventFeatureKey): boolean {
    return allowed.includes(feature)
  }

  function cannot(feature: EventFeatureKey): boolean {
    return !can(feature)
  }

  return { can, cannot }
}
