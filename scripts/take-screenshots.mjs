import { createRequire } from 'module'
import { mkdirSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const require = createRequire(import.meta.url)
const puppeteer = require('../node_modules/puppeteer-core')

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const screenshotsDir = resolve(root, 'scripts/screenshots')

if (!existsSync(screenshotsDir)) mkdirSync(screenshotsDir, { recursive: true })

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const BASE = 'http://localhost:3001'
const EMAIL = 'admin@revel.mx'
const PASS = 'Admin1234!'

const wait = (ms) => new Promise(r => setTimeout(r, ms))

async function shot(page, name) {
  await wait(1800)
  await page.screenshot({ path: resolve(screenshotsDir, `${name}.png`), fullPage: false })
  console.log('  OK:', name)
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--window-size=1440,900', '--disable-blink-features=AutomationControlled'],
  defaultViewport: { width: 1440, height: 900 },
})

const page = await browser.newPage()

// ---- LOGIN ----
console.log('Pagina de inicio de sesion...')
await page.goto(`${BASE}/login-magic`, { waitUntil: 'networkidle2' })
// Esperar a que Vue hidrate y renderice los inputs
await page.waitForSelector('input', { timeout: 15000 })
await wait(1000)
await shot(page, '01-login')

const emailInput = await page.$('input[type="email"], input[autocomplete="email"], input[name="email"]')
const passInput  = await page.$('input[type="password"]')

if (!emailInput || !passInput) {
  // intentar con todos los inputs
  const allInputs = await page.$$('input')
  console.log('Total inputs encontrados:', allInputs.length)
  for (const inp of allInputs) {
    const t = await (await inp.getProperty('type')).jsonValue()
    const p = await (await inp.getProperty('placeholder')).jsonValue()
    console.log(' -', t, '|', p)
  }
  await browser.close()
  process.exit(1)
}

await emailInput.click({ clickCount: 3 })
await emailInput.type(EMAIL)
await passInput.click({ clickCount: 3 })
await passInput.type(PASS)

// Buscar el boton de submit
const submitBtn = await page.$('button[type="submit"]') ?? await page.$('button')
await submitBtn.click()
await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 20000 }).catch(() => {})
await wait(2500)

console.log('URL despues de login:', page.url())

// ---- DASHBOARD PRINCIPAL ----
console.log('Panel de control...')
await page.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle2' })
await wait(3000)
await shot(page, '02-dashboard')

// ---- EVENTOS - LISTA ----
console.log('Lista de eventos...')
await page.goto(`${BASE}/dashboard/events`, { waitUntil: 'networkidle2' })
await wait(3000)
await shot(page, '03-eventos-lista')

// ---- EVENTOS - CREAR ----
console.log('Crear evento...')
await page.goto(`${BASE}/dashboard/events/create`, { waitUntil: 'networkidle2' })
await wait(3000)
await shot(page, '04-eventos-crear')

// ---- DETALLE DE EVENTO ----
console.log('Detalle de evento...')
await page.goto(`${BASE}/dashboard/events`, { waitUntil: 'networkidle2' })
await wait(2500)
// Obtener el href del primer enlace de evento
const eventHref = await page.evaluate(() => {
  const links = Array.from(document.querySelectorAll('a[href*="/dashboard/events/"]'))
  return links[0]?.href ?? null
})
if (eventHref) {
  await page.goto(eventHref, { waitUntil: 'networkidle2' })
  await wait(3000)
  await shot(page, '05-evento-detalle')
} else {
  // Si no hay links, navegar desde router click
  const clickable = await page.$$('.card-revel.overflow-hidden')
  if (clickable.length > 0) {
    const p1 = page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {})
    await clickable[0].click()
    await p1
    await wait(3000)
    await shot(page, '05-evento-detalle')
  }
}

// ---- INVITADOS ----
console.log('Invitados...')
await page.goto(`${BASE}/dashboard/guests`, { waitUntil: 'networkidle2' })
await wait(3000)
await shot(page, '06-invitados')

// ---- MESAS ----
console.log('Mesas...')
await page.goto(`${BASE}/dashboard/tables`, { waitUntil: 'networkidle2' })
await wait(3000)
await shot(page, '07-mesas')

// ---- ESCANER QR ----
console.log('Escaner QR...')
await page.goto(`${BASE}/dashboard/qr`, { waitUntil: 'networkidle2' })
await wait(3000)
await shot(page, '08-escaner-qr')

// ---- ALBUM ----
console.log('Album digital...')
await page.goto(`${BASE}/dashboard/album`, { waitUntil: 'networkidle2' })
await wait(3000)
await shot(page, '09-album')

// ---- USUARIOS ----
console.log('Usuarios...')
await page.goto(`${BASE}/dashboard/users`, { waitUntil: 'networkidle2' })
await wait(3000)
await shot(page, '10-usuarios')

// ---- EMPRESAS ----
console.log('Empresas...')
await page.goto(`${BASE}/dashboard/companies`, { waitUntil: 'networkidle2' })
await wait(3000)
await shot(page, '11-empresas')

// ---- PROVEEDORES ----
console.log('Proveedores...')
await page.goto(`${BASE}/dashboard/suppliers`, { waitUntil: 'networkidle2' })
await wait(3000)
await shot(page, '12-proveedores')

await browser.close()
console.log('\nCapturas guardadas en:', screenshotsDir)
