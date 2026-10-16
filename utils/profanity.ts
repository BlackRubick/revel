/**
 * Filtro de groserías para texto escrito por invitados (es-MX + inglés).
 * Se usa en el navegador (aviso inmediato) y en el servidor (validación real).
 *
 * Normaliza acentos, "leetspeak" (p3nd3j0, put@), letras repetidas (puuuto)
 * y letras separadas (p u t o / p.u.t.o) antes de comparar.
 */

// Se comparan contra palabras completas ya normalizadas (ñ → ny).
const WORD_PATTERNS: RegExp[] = [
  // Español
  /^pendej\w*$/, /^pndj\w*$/, /^put[oa]s?$/, /^putit[oa]s?$/, /^putaz\w*$/, /^puter\w*$/, /^putis\w*$/,
  /^ching\w*$/, /^chingad\w*$/, /^chngd\w*$/, /^verg[oa]s?$/, /^vergu\w*$/, /^vrg$/,
  /^culer[oa]s?$/, /^culos?$/, /^cabron\w*$/, /^mamad\w*$/, /^mamon\w*$/, /^mames$/, /^mamar$/,
  /^jot[oa]s?$/, /^maric\w*$/, /^pinche\w*$/, /^ojetes?$/, /^mierd\w*$/, /^cagad\w*$/, /^cagar$/,
  /^conyo$/, /^panocha\w*$/, /^chichis?$/, /^tetas?$/, /^tetona\w*$/, /^nalgon\w*$/,
  /^pene$/, /^penes$/, /^vagina\w*$/, /^coger$/, /^cogid[oa]s?$/, /^cogiendo$/, /^follar$/,
  /^zorr[oa]s?$/, /^perra$/, /^perras$/, /^putona\w*$/, /^prostitut\w*$/, /^malparid\w*$/,
  /^hijueputa\w*$/, /^hdp$/, /^hdtpm$/, /^ptm$/, /^alv$/, /^ctm$/, /^csm$/, /^ngd$/,
  /^estupid[oa]s?$/, /^idiotas?$/, /^imbecil\w*$/, /^tarad[oa]s?$/, /^pendejad\w*$/,
  /^gilipolla\w*$/, /^polla$/, /^verguero$/, /^encuerad[oa]s?$/, /^desnud[oa]s?$/,
  // Inglés
  /^fuck\w*$/, /^fck\w*$/, /^shit\w*$/, /^bitch\w*$/, /^dicks?$/, /^cocks?$/, /^pussy$/, /^pusy$/,
  /^cunts?$/, /^whores?$/, /^sluts?$/, /^asshole\w*$/, /^ashole\w*$/, /^nigg\w*$/, /^niga\w*$/,
  /^fag\w*$/, /^porn\w*$/, /^nudes?$/, /^sexo?$/, /^xxx$/, /^boobs?$/, /^tits?$/, /^wtf$/, /^stfu$/,
  // Odio
  /^nazis?$/, /^hitler$/,
]

// Raíces largas e inequívocas que se buscan también con todo el texto pegado
// ("ch1ng4d4m4dr3", "pen-de-jo"). Solo raíces sin falsos positivos comunes.
const COMPACT_ROOTS = [
  'pendej', 'chingad', 'chingate', 'hijodeputa', 'hijueputa', 'hijadeputa', 'fuck', 'mierda',
  'culero', 'maricon', 'panocha', 'pinche', 'malparid', 'motherfuck', 'putamadre',
]

// Palabras normales que algún patrón podría atrapar por error.
const ALLOWED = new Set<string>(['computadora', 'disputa', 'reputacion'])

const LEET: Record<string, string> = {
  '0': 'o', '1': 'i', '!': 'i', '|': 'i', '3': 'e', '4': 'a', '@': 'a', '5': 's', '$': 's', '7': 't', '8': 'b', '9': 'g',
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/ñ/g, 'ny')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[01!|34@5$789]/g, (c) => LEET[c] ?? c)
}

function collapseRepeats(word: string): string {
  return word.replace(/(.)\1+/g, '$1')
}

function tokenize(normalized: string): string[] {
  const raw = normalized.split(/[^a-z]+/).filter(Boolean)
  // Une letras sueltas consecutivas: "p u t o" → "puto"
  const tokens: string[] = []
  let run = ''
  for (const t of raw) {
    if (t.length === 1) {
      run += t
    } else {
      if (run) tokens.push(run)
      run = ''
      tokens.push(t)
    }
  }
  if (run) tokens.push(run)
  return tokens
}

function isBadWord(word: string): boolean {
  if (ALLOWED.has(word)) return false
  const collapsed = collapseRepeats(word)
  return WORD_PATTERNS.some((re) => re.test(word) || re.test(collapsed))
}

/** Devuelve la primera grosería encontrada, o null si el texto está limpio. */
export function findProfanity(text: string | null | undefined): string | null {
  if (!text) return null
  const normalized = normalize(text)

  for (const token of tokenize(normalized)) {
    if (isBadWord(token)) return token
  }

  const compact = normalized.replace(/[^a-z]/g, '')
  const compactCollapsed = collapseRepeats(compact)
  for (const root of COMPACT_ROOTS) {
    if (compact.includes(root) || compactCollapsed.includes(collapseRepeats(root))) return root
  }

  return null
}

export function hasProfanity(text: string | null | undefined): boolean {
  return findProfanity(text) !== null
}
