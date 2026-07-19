import { readFileSync, writeFileSync } from 'fs'
import { createRequire } from 'module'
import { execSync } from 'child_process'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const require = createRequire(import.meta.url)

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const screenshotsDir = resolve(__dirname, 'screenshots')

// Convertir imagenes a base64 para incrustarlas en el HTML
function img(name) {
  try {
    const buf = readFileSync(resolve(screenshotsDir, `${name}.png`))
    return `data:image/png;base64,${buf.toString('base64')}`
  } catch {
    return ''
  }
}

function screenshot(name, caption) {
  const src = img(name)
  if (!src) return ''
  return `
    <figure class="screenshot-block">
      <img src="${src}" alt="${caption}" />
      <figcaption>${caption}</figcaption>
    </figure>
  `
}

const htmlDoc = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Manual de Usuario - Revel</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    @page {
      size: Letter;
      margin: 2.54cm 2.8cm 2.54cm 3.2cm;
    }

    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 12pt;
      line-height: 1.75;
      color: #000;
      background: #fff;
      text-align: justify;
    }

    /* ========= PORTADA ========= */
    .portada {
      page-break-after: always;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
      padding: 3cm 2cm;
    }
    .portada-logo {
      width: 4.5cm;
      height: 4.5cm;
      border: 3px solid #000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 60pt;
      font-weight: 900;
      letter-spacing: 0.1em;
      margin: 0 auto 1.2cm auto;
    }
    .portada-linea {
      border-top: 3px solid #000;
      width: 100%;
      margin: 0.6cm 0;
    }
    .portada-titulo {
      font-size: 26pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 0.3cm;
    }
    .portada-producto {
      font-size: 18pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 0.2cm;
    }
    .portada-subtitulo {
      font-size: 13pt;
      font-weight: 400;
      color: #333;
    }
    .portada-meta {
      margin-top: 3cm;
      width: 100%;
      border-top: 1px solid #000;
      padding-top: 0.5cm;
      text-align: left;
      font-size: 11pt;
    }
    .portada-meta p {
      margin-bottom: 0.25cm;
    }
    .portada-meta strong {
      display: inline-block;
      min-width: 5.5cm;
    }

    /* ========= INDICE ========= */
    .pagina-indice {
      page-break-after: always;
      padding-top: 0.5cm;
    }
    .indice-titulo {
      font-size: 18pt;
      font-weight: 700;
      text-transform: uppercase;
      border-bottom: 2px solid #000;
      padding-bottom: 0.3cm;
      margin-bottom: 0.6cm;
      letter-spacing: 0.05em;
    }
    .indice-grupo {
      margin-bottom: 0.5cm;
    }
    .indice-cap {
      font-size: 12pt;
      font-weight: 700;
      margin-bottom: 0.15cm;
    }
    .indice-sub {
      font-size: 11pt;
      font-weight: 400;
      margin-left: 1cm;
      margin-bottom: 0.1cm;
      color: #222;
    }

    /* ========= ENCABEZADOS ========= */
    h1 {
      font-size: 18pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      border-bottom: 2px solid #000;
      padding-bottom: 0.2cm;
      margin-top: 0;
      margin-bottom: 0.5cm;
      page-break-after: avoid;
      text-align: left;
    }
    h2 {
      font-size: 14pt;
      font-weight: 700;
      border-bottom: 1px solid #555;
      padding-bottom: 0.12cm;
      margin-top: 0.8cm;
      margin-bottom: 0.4cm;
      page-break-after: avoid;
      text-align: left;
    }
    h3 {
      font-size: 12pt;
      font-weight: 700;
      margin-top: 0.6cm;
      margin-bottom: 0.3cm;
      page-break-after: avoid;
      text-align: left;
    }
    h4 {
      font-size: 12pt;
      font-weight: 700;
      font-style: italic;
      margin-top: 0.5cm;
      margin-bottom: 0.25cm;
      page-break-after: avoid;
      text-align: left;
    }

    /* ========= CAPITULO WRAPPER ========= */
    .capitulo {
      page-break-before: always;
      padding-top: 0.2cm;
    }

    /* ========= PARRAFOS ========= */
    p {
      margin-bottom: 0.35cm;
      text-align: justify;
      orphans: 3;
      widows: 3;
    }

    /* ========= LISTAS ========= */
    ul, ol {
      margin-left: 1.2cm;
      margin-bottom: 0.4cm;
    }
    li {
      margin-bottom: 0.18cm;
      text-align: justify;
    }

    /* ========= TABLAS ========= */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 0.5cm 0 0.6cm 0;
      font-size: 11pt;
      page-break-inside: avoid;
    }
    thead tr {
      background-color: #000;
      color: #fff;
    }
    th {
      padding: 0.18cm 0.3cm;
      text-align: left;
      font-weight: 700;
      border: 1px solid #000;
    }
    td {
      padding: 0.16cm 0.3cm;
      border: 1px solid #777;
      vertical-align: top;
    }
    tr:nth-child(even) td { background-color: #f5f5f5; }
    .tc { text-align: center; }

    /* ========= CAPTURAS DE PANTALLA ========= */
    .screenshot-block {
      margin: 0.6cm 0 0.8cm 0;
      page-break-inside: avoid;
      text-align: center;
    }
    .screenshot-block img {
      width: 100%;
      max-width: 17cm;
      border: 1px solid #ccc;
      border-radius: 4px;
      display: block;
      margin: 0 auto;
    }
    .screenshot-block figcaption {
      font-size: 10pt;
      font-style: italic;
      color: #333;
      margin-top: 0.2cm;
      text-align: center;
    }

    /* ========= SEPARADOR ========= */
    hr {
      border: none;
      border-top: 1px solid #000;
      margin: 0.5cm 0;
    }

    /* ========= NOTA / RECUADRO ========= */
    .nota {
      border: 1px solid #333;
      padding: 0.3cm 0.4cm;
      margin: 0.4cm 0;
      font-size: 11pt;
      page-break-inside: avoid;
    }
    .nota strong { font-weight: 700; }

    strong { font-weight: 700; }
    em { font-style: italic; }
  </style>
</head>
<body>

<!-- ===== PORTADA ===== -->
<div class="portada">
  <div class="portada-logo">R</div>
  <div class="portada-linea"></div>
  <div class="portada-titulo">Manual de Usuario</div>
  <div class="portada-producto">Plataforma Revel</div>
  <div class="portada-subtitulo">Sistema de Gestion de Eventos</div>
  <div class="portada-meta">
    <p><strong>Version</strong> 1.0</p>
    <p><strong>Fecha de publicacion</strong> Julio 2026</p>
    <p><strong>Clasificacion</strong> Uso interno y entrega a cliente</p>
    <p><strong>Elaborado por</strong> Equipo de Desarrollo Revel</p>
  </div>
</div>

<!-- ===== INDICE ===== -->
<div class="pagina-indice">
  <div class="indice-titulo">Indice de contenido</div>

  <div class="indice-grupo">
    <div class="indice-cap">1. Introduccion</div>
    <div class="indice-sub">1.1 Proposito del documento</div>
    <div class="indice-sub">1.2 Alcance</div>
    <div class="indice-sub">1.3 Glosario de terminos</div>
  </div>

  <div class="indice-grupo">
    <div class="indice-cap">2. Descripcion general del sistema</div>
    <div class="indice-sub">2.1 Roles del sistema</div>
    <div class="indice-sub">2.2 Acceso a la plataforma</div>
    <div class="indice-sub">2.3 Tipos de evento soportados</div>
  </div>

  <div class="indice-grupo">
    <div class="indice-cap">3. Rol Administrador</div>
    <div class="indice-sub">3.1 Panel de control</div>
    <div class="indice-sub">3.2 Gestion de empresas</div>
    <div class="indice-sub">3.3 Gestion de usuarios</div>
    <div class="indice-sub">3.4 Gestion de eventos</div>
    <div class="indice-sub">3.5 Gestion de invitados</div>
    <div class="indice-sub">3.6 Gestion de mesas</div>
    <div class="indice-sub">3.7 Escaner de codigos QR</div>
    <div class="indice-sub">3.8 Album digital</div>
    <div class="indice-sub">3.9 Catalogo de proveedores</div>
  </div>

  <div class="indice-grupo">
    <div class="indice-cap">4. Rol Organizador</div>
    <div class="indice-sub">4.1 Diferencias con el Administrador</div>
    <div class="indice-sub">4.2 Funcionalidades disponibles</div>
  </div>

  <div class="indice-grupo">
    <div class="indice-cap">5. Rol Escaner</div>
    <div class="indice-sub">5.1 Descripcion del rol</div>
    <div class="indice-sub">5.2 Uso del escaner QR</div>
    <div class="indice-sub">5.3 Validacion manual de codigo</div>
  </div>

  <div class="indice-grupo">
    <div class="indice-cap">6. Rol Pantalla</div>
    <div class="indice-sub">6.1 Descripcion del rol</div>
    <div class="indice-sub">6.2 Vista de proyeccion en vivo</div>
  </div>

  <div class="indice-grupo">
    <div class="indice-cap">7. Rol Invitado</div>
    <div class="indice-sub">7.1 Descripcion del rol</div>
    <div class="indice-sub">7.2 Confirmacion de asistencia</div>
    <div class="indice-sub">7.3 Album digital para invitados</div>
  </div>

  <div class="indice-grupo">
    <div class="indice-cap">8. Estados del sistema</div>
  </div>

  <div class="indice-grupo">
    <div class="indice-cap">9. Preguntas frecuentes</div>
  </div>
</div>


<!-- ===== CAPITULO 1 ===== -->
<div class="capitulo">
  <h1>1. Introduccion</h1>

  <h2>1.1 Proposito del documento</h2>
  <p>Este manual describe el uso completo de la plataforma Revel para todos los perfiles de usuario. Cada seccion explica paso a paso las funciones disponibles segun el rol asignado y esta disenada para servir como material de capacitacion inicial asi como guia de consulta durante la operacion diaria.</p>

  <h2>1.2 Alcance</h2>
  <p>El documento cubre todos los modulos de la plataforma en su version 1.0: el panel administrativo accesible para personal interno, la confirmacion de asistencia que reciben los invitados por enlace personalizado, la subida de fotografias al album digital y la proyeccion en vivo durante el evento. No se abordan temas de configuracion de infraestructura ni administracion de base de datos.</p>

  <h2>1.3 Glosario de terminos</h2>
  <table>
    <thead><tr><th>Termino</th><th>Definicion</th></tr></thead>
    <tbody>
      <tr><td><strong>Rol</strong></td><td>Nivel de acceso asignado a un usuario que determina que modulos y acciones puede realizar dentro de la plataforma</td></tr>
      <tr><td><strong>Codigo QR</strong></td><td>Imagen bidimensional que almacena la identificacion del invitado y es escaneada al momento del ingreso al evento</td></tr>
      <tr><td><strong>Confirmacion de asistencia</strong></td><td>Proceso mediante el cual el invitado responde si asistira o no al evento a traves de su enlace personalizado</td></tr>
      <tr><td><strong>Album digital</strong></td><td>Modulo que permite a los invitados subir y ver fotografias del evento en tiempo real</td></tr>
      <tr><td><strong>Pantalla en vivo</strong></td><td>Vista de proyeccion que muestra automaticamente las fotografias subidas durante el evento</td></tr>
      <tr><td><strong>Paquete</strong></td><td>Plan de servicio contratado por la empresa cliente que define las funciones disponibles para sus eventos</td></tr>
      <tr><td><strong>Mesa</strong></td><td>Unidad de organizacion espacial del evento a la que se asignan invitados</td></tr>
      <tr><td><strong>Proveedor</strong></td><td>Empresa o persona que ofrece servicios complementarios registrada en el catalogo de la plataforma</td></tr>
      <tr><td><strong>Registro de entrada</strong></td><td>Proceso que confirma el ingreso fisico de un invitado al evento mediante el escaneo de su codigo QR</td></tr>
    </tbody>
  </table>
</div>


<!-- ===== CAPITULO 2 ===== -->
<div class="capitulo">
  <h1>2. Descripcion general del sistema</h1>

  <h2>2.1 Roles del sistema</h2>
  <p>Revel opera con cinco roles distintos. La siguiente tabla muestra el acceso de cada uno a los modulos disponibles.</p>

  <table>
    <thead>
      <tr>
        <th>Modulo</th>
        <th class="tc">Administrador</th>
        <th class="tc">Organizador</th>
        <th class="tc">Escaner</th>
        <th class="tc">Pantalla</th>
        <th class="tc">Invitado</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Panel de control</td><td class="tc">SI</td><td class="tc">SI</td><td class="tc">NO</td><td class="tc">NO</td><td class="tc">NO</td></tr>
      <tr><td>Empresas</td><td class="tc">SI</td><td class="tc">NO</td><td class="tc">NO</td><td class="tc">NO</td><td class="tc">NO</td></tr>
      <tr><td>Usuarios</td><td class="tc">SI</td><td class="tc">NO</td><td class="tc">NO</td><td class="tc">NO</td><td class="tc">NO</td></tr>
      <tr><td>Crear y editar eventos</td><td class="tc">SI</td><td class="tc">SI</td><td class="tc">NO</td><td class="tc">NO</td><td class="tc">NO</td></tr>
      <tr><td>Invitados</td><td class="tc">SI</td><td class="tc">SI</td><td class="tc">NO</td><td class="tc">NO</td><td class="tc">NO</td></tr>
      <tr><td>Mesas</td><td class="tc">SI</td><td class="tc">SI</td><td class="tc">NO</td><td class="tc">NO</td><td class="tc">NO</td></tr>
      <tr><td>Escaner QR</td><td class="tc">SI</td><td class="tc">SI</td><td class="tc">SI</td><td class="tc">NO</td><td class="tc">NO</td></tr>
      <tr><td>Album (administracion)</td><td class="tc">SI</td><td class="tc">SI</td><td class="tc">NO</td><td class="tc">NO</td><td class="tc">NO</td></tr>
      <tr><td>Album (subida de fotos)</td><td class="tc">NO</td><td class="tc">NO</td><td class="tc">NO</td><td class="tc">NO</td><td class="tc">SI</td></tr>
      <tr><td>Pantalla en vivo</td><td class="tc">NO</td><td class="tc">NO</td><td class="tc">NO</td><td class="tc">SI</td><td class="tc">NO</td></tr>
      <tr><td>Proveedores</td><td class="tc">SI</td><td class="tc">Solo lectura</td><td class="tc">NO</td><td class="tc">NO</td><td class="tc">NO</td></tr>
      <tr><td>Confirmacion de asistencia</td><td class="tc">NO</td><td class="tc">NO</td><td class="tc">NO</td><td class="tc">NO</td><td class="tc">SI</td></tr>
    </tbody>
  </table>

  <p><strong>Administrador</strong> tiene acceso total al sistema incluyendo la administracion de empresas y la creacion de cualquier tipo de usuario.</p>
  <p><strong>Organizador</strong> gestiona eventos y toda su operacion pero no puede administrar empresas ni usuarios de nivel Administrador.</p>
  <p><strong>Escaner</strong> unicamente puede usar el modulo de lectura de codigos QR para registrar el ingreso de invitados durante el evento.</p>
  <p><strong>Pantalla</strong> unicamente tiene acceso a la vista de proyeccion del album digital en tiempo real.</p>
  <p><strong>Invitado</strong> no tiene cuenta en el sistema. Accede mediante un enlace personalizado para confirmar asistencia y subir fotografias.</p>

  <h2>2.2 Acceso a la plataforma</h2>

  <h3>Para usuarios con cuenta</h3>
  <p>Administradores, Organizadores, Escaneres y Pantallas acceden desde la pagina de inicio de sesion disponible en la direccion principal de la plataforma. El usuario ingresa su correo electronico y contrasena y el sistema lo redirige automaticamente al modulo que le corresponde segun su rol.</p>

  ${screenshot('01-login', 'Figura 1 — Pantalla de inicio de sesion de la plataforma Revel')}

  <h3>Para invitados</h3>
  <p>Los invitados acceden exclusivamente mediante el enlace personalizado que reciben en su invitacion digital. Este enlace es unico e intransferible y no requiere contrasena.</p>

  <h2>2.3 Tipos de evento soportados</h2>
  <ul>
    <li><strong>Boda</strong> — incluye opcion de ceremonia religiosa</li>
    <li><strong>Quinceanera (XV anos)</strong> — incluye opcion de ceremonia religiosa</li>
    <li><strong>Bautizo</strong> — incluye opcion de ceremonia religiosa</li>
    <li><strong>Cumpleanos</strong></li>
    <li><strong>Babyshower</strong></li>
    <li><strong>Graduacion</strong></li>
    <li><strong>Corporativo</strong></li>
    <li><strong>Otro</strong> — para cualquier tipo no contemplado en las categorias anteriores</li>
  </ul>
</div>


<!-- ===== CAPITULO 3 ===== -->
<div class="capitulo">
  <h1>3. Rol Administrador</h1>
  <p>El Administrador es el usuario con mayor nivel de acceso. Tiene control total sobre todos los modulos y es el unico que puede registrar empresas y asignar cualquier tipo de rol a otros usuarios.</p>

  <h2>3.1 Panel de control</h2>
  <p>Al iniciar sesion el Administrador llega directamente al panel de control donde puede ver un resumen de la actividad de la plataforma. La vista principal muestra cuatro indicadores: total de eventos registrados, total de invitados, invitados confirmados con el porcentaje de respuesta y total de fotografias subidas al album digital.</p>
  <p>En la parte central aparece la lista de eventos recientes con acceso directo a cada uno y en el panel lateral derecho se encuentran los accesos rapidos para crear un evento, gestionar invitados, organizar mesas o ver el album. Tambien se muestra la distribucion del estado de respuesta de todos los invitados registrados.</p>

  ${screenshot('02-dashboard', 'Figura 2 — Panel de control del Administrador')}

  <h2>3.2 Gestion de empresas</h2>
  <p>Desde el menu lateral el Administrador accede al modulo de Empresas donde puede ver todas las empresas cliente registradas y sus datos principales: nombre, encargado asignado, correo de contacto, cantidad de usuarios y estado.</p>

  ${screenshot('11-empresas', 'Figura 3 — Lista de empresas cliente registradas en la plataforma')}

  <h3>Crear una empresa</h3>
  <p>Al hacer clic en el boton Nueva empresa se abre un formulario dividido en dos secciones. La primera seccion captura los datos de la empresa: nombre, correo de contacto, telefono y direccion. La segunda seccion registra al encargado que sera el responsable principal de esa empresa dentro del sistema con su nombre, correo y contrasena inicial. Al guardar se crean simultaneamente la empresa y el usuario encargado.</p>

  <h3>Editar una empresa</h3>
  <p>El boton Editar de cada fila permite modificar el nombre, correo, telefono, direccion y el estado activo o inactivo de la empresa. Si una empresa se marca como inactiva todos los usuarios asociados a ella pierden el acceso hasta que sea reactivada.</p>

  <h3>Eliminar una empresa</h3>
  <p>La eliminacion de una empresa es permanente e irreversible. El sistema solicita confirmacion antes de proceder e informa que todos los usuarios asociados seran eliminados junto con la empresa.</p>

  <h2>3.3 Gestion de usuarios</h2>
  <p>El modulo de Usuarios permite al Administrador crear y administrar todas las cuentas del sistema. La tabla muestra el nombre, correo, rol, estado y fecha de creacion de cada usuario.</p>

  ${screenshot('10-usuarios', 'Figura 4 — Lista de usuarios de la plataforma')}

  <h3>Crear un usuario</h3>
  <p>El formulario de nuevo usuario solicita nombre completo, correo electronico, contrasena y rol. Los roles disponibles para el Administrador al crear usuarios son Organizador, Escaner, Pantalla y Administrador.</p>

  <h3>Editar y eliminar usuarios</h3>
  <p>Desde las acciones de cada fila se puede editar cualquier dato del usuario incluyendo un cambio de contrasena opcional. Si el campo de contrasena se deja vacio la contrasena actual no cambia. La eliminacion de un usuario es permanente.</p>

  <h2>3.4 Gestion de eventos</h2>
  <p>El modulo de Eventos es el nucleo operativo de la plataforma. Muestra todos los eventos en tarjetas visuales con imagen de portada, nombre, fecha, lugar, numero de invitados y estado. Se puede filtrar por estado (Todos, Activos, Borrador, Finalizados) y buscar por nombre.</p>

  ${screenshot('03-eventos-lista', 'Figura 5 — Lista de eventos registrados en la plataforma')}

  <h3>Crear un evento</h3>
  <p>El formulario de creacion esta organizado en secciones numeradas para facilitar el llenado.</p>

  ${screenshot('04-eventos-crear', 'Figura 6 — Formulario de creacion de un nuevo evento')}

  <p>La primera seccion permite subir la imagen de portada del evento arrastrando un archivo o seleccionandolo desde el dispositivo. La segunda seccion captura el nombre del evento, el tipo y el paquete de servicio. La tercera seccion registra la fecha, hora, nombre del lugar, direccion y enlace al mapa. La cuarta seccion configura el numero de mesas y la capacidad por mesa y el sistema calcula automaticamente la capacidad total del evento. Tambien existe una seccion opcional para agregar el enlace a una lista de regalos externa y para eventos de tipo Boda, Quinceanera o Bautizo aparece una seccion adicional donde se pueden registrar los datos de la ceremonia religiosa.</p>

  <h3>Pagina de detalle del evento</h3>
  <p>Al abrir un evento el usuario ve un resumen con cuatro indicadores: invitados, fotografias, mesas y mensajes. La informacion esta organizada en pestanas que agrupan el resumen general, la lista de invitados, las mesas y el album de fotografias.</p>

  ${screenshot('05-evento-detalle', 'Figura 7 — Vista de detalle de un evento con sus pestanas de informacion')}

  <p>Desde esta vista el Administrador puede activar el evento cambiando su estado de Borrador a Activo, editarlo o descargar todas las fotografias del album en un archivo comprimido segun el paquete contratado.</p>

  <h2>3.5 Gestion de invitados</h2>
  <p>El modulo de Invitados muestra primero la lista de eventos disponibles. Al seleccionar un evento aparece la lista completa de sus invitados con nombre, correo, numero de acompanantes autorizados, mesa asignada, estado de respuesta de asistencia y si ya realizaron su registro de entrada al evento.</p>

  ${screenshot('06-invitados', 'Figura 8 — Seleccion de evento para gestionar sus invitados')}

  <h3>Agregar un invitado</h3>
  <p>El formulario solicita nombre, correo electronico, telefono, numero maximo de acompanantes y mesa asignada. La mesa puede dejarse sin asignar y configurarse mas tarde desde el modulo de Mesas.</p>

  <h3>Generar codigo QR</h3>
  <p>Cada invitado tiene un codigo unico en el sistema. Al generar el codigo QR se crea la imagen imprimible o compartible que el invitado presentara al llegar al evento. El codigo contiene su identificacion y al ser escaneado registra su ingreso.</p>

  <h2>3.6 Gestion de mesas</h2>
  <p>El modulo de Mesas permite organizar el acomodo de los invitados. Al igual que en el modulo de Invitados primero se selecciona el evento y luego aparecen todas sus mesas con el numero de lugares disponibles y los invitados ya asignados a cada una.</p>

  ${screenshot('07-mesas', 'Figura 9 — Vista de mesas disponibles para un evento')}

  <p>Para asignar un invitado a una mesa se selecciona la mesa de destino desde las opciones del invitado. El sistema verifica que la mesa no este llena antes de confirmar la asignacion. Si el invitado ya tenia una mesa asignada su lugar anterior se libera automaticamente.</p>

  <h2>3.7 Escaner de codigos QR</h2>
  <p>El modulo de Escaner QR permite registrar el ingreso de los invitados al evento. Al ingresar se muestra la camara del dispositivo con un encuadre de alineacion. El usuario activa la camara con el boton correspondiente y a partir de ese momento el sistema detecta y lee los codigos QR automaticamente sin necesidad de presionar ningun boton.</p>

  ${screenshot('08-escaner-qr', 'Figura 10 — Modulo de escaner QR para registro de entrada')}

  <p>Cuando se lee un codigo valido el sistema muestra el nombre del invitado, el evento al que corresponde, su mesa asignada y el total de pases autorizados. Si el codigo ya fue utilizado anteriormente el sistema muestra una advertencia para evitar ingresos duplicados. Si el codigo no es valido aparece un mensaje de error. Ademas del escaneo optico existe un campo de texto para ingresar el codigo manualmente cuando la lectura por camara no sea posible.</p>

  <h2>3.8 Album digital</h2>
  <p>El modulo de Album digital muestra todos los eventos con el numero de fotografias subidas en cada uno. Al seleccionar un evento aparece la galeria completa en formato de cuadricula. Al hacer clic en cualquier fotografia se abre en una vista ampliada que muestra el nombre del invitado que la subio y la fecha de carga.</p>

  ${screenshot('09-album', 'Figura 11 — Seleccion de evento para ver su album digital')}

  <p>Desde la vista del album el Administrador puede abrir la pantalla de proyeccion en una nueva pestana para ver exactamente lo que se muestra en el proyector del evento y puede descargar todas las fotografias en un archivo comprimido con el nombre del evento.</p>

  <h2>3.9 Catalogo de proveedores</h2>
  <p>El modulo de Proveedores es un catalogo de empresas y personas que ofrecen servicios complementarios para los eventos como fotografia, video, musica, catering o decoracion. Los proveedores se muestran en tarjetas con su nombre, categoria y datos de contacto. Se pueden filtrar por categoria con los botones de filtro ubicados sobre la lista.</p>

  ${screenshot('12-proveedores', 'Figura 12 — Catalogo de proveedores registrados en la plataforma')}

  <p>El Administrador puede agregar nuevos proveedores, editar su informacion o eliminarlos del catalogo. Los usuarios con rol Organizador solo pueden consultar el catalogo sin hacer cambios.</p>
</div>


<!-- ===== CAPITULO 4 ===== -->
<div class="capitulo">
  <h1>4. Rol Organizador</h1>

  <h2>4.1 Diferencias con el Administrador</h2>
  <p>El Organizador tiene acceso a la mayoria de los modulos de la plataforma con las siguientes excepciones:</p>
  <ul>
    <li>No puede acceder al modulo de Empresas</li>
    <li>No puede acceder al modulo de Usuarios</li>
    <li>No puede agregar, editar ni eliminar proveedores del catalogo, solo puede consultarlos</li>
    <li>No puede crear usuarios con rol de Administrador</li>
  </ul>

  <h2>4.2 Funcionalidades disponibles</h2>
  <p>El Organizador tiene acceso completo y con el mismo comportamiento descrito para el Administrador en los siguientes modulos:</p>
  <ul>
    <li>Panel de control</li>
    <li>Creacion y edicion de eventos</li>
    <li>Gestion de invitados</li>
    <li>Asignacion de mesas</li>
    <li>Escaner de codigos QR</li>
    <li>Album digital</li>
    <li>Consulta del catalogo de proveedores</li>
  </ul>
  <p>Para el uso detallado de cada uno de estos modulos referirse al capitulo 3 de este manual.</p>
</div>


<!-- ===== CAPITULO 5 ===== -->
<div class="capitulo">
  <h1>5. Rol Escaner</h1>

  <h2>5.1 Descripcion del rol</h2>
  <p>El rol de Escaner esta destinado al personal de entrada que controla el acceso de los invitados durante el evento. Al iniciar sesion el sistema redirige directamente al modulo de escaneo QR sin acceso a ningun otro modulo. Es ideal para asignar a personal de apoyo operativo sin exponer informacion de la administracion del evento.</p>

  <h2>5.2 Uso del escaner QR</h2>
  <p>Al ingresar al modulo aparece la vista de la camara con un encuadre de alineacion dorado. El usuario activa la camara con el boton correspondiente y el navegador puede solicitar permiso de acceso a la camara del dispositivo. Se recomienda aceptar este permiso y usar un dispositivo con camara trasera de alta resolucion para garantizar una lectura rapida y precisa.</p>

  ${screenshot('08-escaner-qr', 'Figura 13 — Vista del escaner QR activo listo para registrar invitados')}

  <p>Una vez activa la camara el proceso es automatico. El personal de entrada pide al invitado que presente su codigo QR frente al dispositivo y el sistema lo detecta y lo procesa sin necesidad de presionar ninguna tecla.</p>

  <p>Los resultados posibles son:</p>
  <ul>
    <li><strong>Acceso permitido</strong> — el sistema muestra el nombre del invitado, el evento, la mesa asignada y el numero de pases autorizados. El registro de entrada queda guardado automaticamente</li>
    <li><strong>Codigo duplicado</strong> — el codigo ya fue escaneado anteriormente. Debe consultarse con el supervisor antes de permitir el ingreso</li>
    <li><strong>Codigo invalido</strong> — el codigo no corresponde a ningun invitado registrado y no se debe permitir el ingreso</li>
  </ul>

  <p>Despues de cada lectura se muestra el resultado en pantalla y al hacer clic en el boton de continuar la camara se reactiva para el siguiente invitado.</p>

  <h2>5.3 Validacion manual de codigo</h2>
  <p>Cuando el codigo QR del invitado no puede ser leido por la camara por dano en la impresion o baja calidad de imagen se puede usar el campo de texto ubicado debajo del visor. El personal escribe el codigo alfanumerico que generalmente aparece impreso junto al codigo QR en la invitacion y presiona la tecla Enter o el boton Validar. El resultado es identico al del escaneo optico.</p>

  <div class="nota"><strong>Nota importante</strong> — ante cualquier situacion de duda sobre la validez de un codigo el personal de escaner debe comunicarse con el Organizador o Administrador del evento antes de tomar una decision de acceso.</div>
</div>


<!-- ===== CAPITULO 6 ===== -->
<div class="capitulo">
  <h1>6. Rol Pantalla</h1>

  <h2>6.1 Descripcion del rol</h2>
  <p>El rol de Pantalla es exclusivo del operador del equipo de proyeccion durante el evento. Al iniciar sesion el sistema redirige directamente a la vista de proyeccion del album digital. No tiene acceso a ningun otro modulo del sistema.</p>

  <h2>6.2 Vista de proyeccion en vivo</h2>
  <p>La pantalla de proyeccion esta disenada para mostrarse en pantalla completa en un televisor, pantalla o proyector durante el evento. Muestra de forma automatica y en tiempo real las fotografias que los invitados van subiendo al album.</p>
  <p>La interfaz incluye en la parte superior el nombre del evento, un indicador de estado en vivo, la hora actual y el contador de fotografias. En el area central se muestra la fotografia activa a tamano completo con efecto de fondo desenfocado. En la parte inferior de la imagen aparece la descripcion de la fotografia y el nombre del invitado que la subio si existen. La barra inferior muestra el progreso de la diapositiva actual y puntos de navegacion para saltar manualmente entre fotografias.</p>
  <p>Cuando un invitado sube una nueva fotografia aparece automaticamente una notificacion de Nueva foto y la imagen se agrega al ciclo de la presentacion. Si los invitados dejaron mensajes junto a sus fotografias estos aparecen en una banda de texto deslizante en la parte inferior de la pantalla.</p>
  <p>Para activar el modo pantalla completa el operador debe hacer doble clic en cualquier area de la pantalla. Se recomienda activar este modo antes de que comience el evento para una presentacion profesional. Si el indicador de conexion en la esquina superior derecha aparece en rojo se debe recargar la pagina para restablecer la conexion.</p>
</div>


<!-- ===== CAPITULO 7 ===== -->
<div class="capitulo">
  <h1>7. Rol Invitado</h1>

  <h2>7.1 Descripcion del rol</h2>
  <p>El invitado no tiene cuenta en el sistema y no necesita recordar ninguna contrasena. Accede a sus funciones mediante el enlace personalizado que recibe en su invitacion digital. Este enlace contiene un codigo unico que lo identifica dentro del sistema y le da acceso a dos funciones: confirmar si asistira al evento y subir fotografias al album digital.</p>

  <h2>7.2 Confirmacion de asistencia</h2>
  <p>Al abrir el enlace de su invitacion el invitado ve el nombre del evento, su fecha y su propio nombre como confirmacion de que el enlace es correcto. Si ya tiene una mesa asignada tambien aparece ese dato.</p>
  <p>La pagina presenta dos opciones claramente diferenciadas: Si asistire y No podre asistir. Al seleccionar que si asistira aparece un selector para indicar cuantos acompanantes llevara dentro del limite que le fue asignado. El invitado tambien puede dejar un mensaje opcional para los anfitriones del evento. Al confirmar el sistema registra la respuesta y muestra un mensaje de exito.</p>
  <p>Si el invitado ya respondio anteriormente la pagina muestra su respuesta previa sin posibilidad de modificarla. Desde esta misma pagina el invitado puede acceder al mapa con la ubicacion del evento y al album digital para subir fotografias.</p>

  <h2>7.3 Album digital para invitados</h2>
  <p>El album digital tiene un sistema de apertura basado en la hora del evento. Si el invitado intenta acceder antes de que el evento comience ve un contador regresivo que muestra en dias, horas, minutos y segundos el tiempo restante para que el album se habilite. Una vez que el evento da inicio el area de subida se activa automaticamente.</p>
  <p>El invitado puede subir fotografias seleccionando archivos desde su dispositivo o arrastrando imagenes directamente sobre el area de carga. Los formatos aceptados son JPG, PNG y WebP con un limite de 10 megabytes por fotografia. Las fotografias seleccionadas aparecen en una cola antes de ser enviadas. Al hacer clic en el boton de subida el sistema las envia al servidor y muestra el progreso de cada una. Las fotografias subidas aparecen instantaneamente en la galeria del evento y en la pantalla de proyeccion si esta activa. La parte inferior de la pagina muestra la galeria completa del evento con todas las fotografias de todos los invitados.</p>
</div>


<!-- ===== CAPITULO 8 ===== -->
<div class="capitulo">
  <h1>8. Estados del sistema</h1>

  <h2>Estados de evento</h2>
  <table>
    <thead><tr><th>Estado</th><th>Descripcion</th></tr></thead>
    <tbody>
      <tr><td><strong>Borrador</strong></td><td>El evento fue creado pero no ha sido activado. Los invitados no pueden usar sus codigos QR ni el album digital</td></tr>
      <tr><td><strong>Activo</strong></td><td>El evento esta en plena operacion. Los invitados pueden confirmar asistencia, los escaneres funcionan y el album acepta fotografias</td></tr>
      <tr><td><strong>Finalizado</strong></td><td>El evento concluyo. Se conserva el historial pero no se aceptan nuevas interacciones</td></tr>
      <tr><td><strong>Cancelado</strong></td><td>El evento fue cancelado. El registro se conserva pero queda bloqueado para cualquier operacion</td></tr>
    </tbody>
  </table>
  <p>Todo evento se crea en estado Borrador. El Administrador u Organizador debe activarlo manualmente desde la pagina de detalle del evento para que comience a operar.</p>

  <h2>Estados de respuesta de invitados</h2>
  <table>
    <thead><tr><th>Estado</th><th>Descripcion</th></tr></thead>
    <tbody>
      <tr><td><strong>Pendiente</strong></td><td>El invitado aun no ha respondido. Es el estado inicial de todo invitado al ser registrado</td></tr>
      <tr><td><strong>Confirmado</strong></td><td>El invitado respondio que asistira al evento</td></tr>
      <tr><td><strong>Rechazado</strong></td><td>El invitado respondio que no asistira al evento</td></tr>
    </tbody>
  </table>
  <p>Adicionalmente existe un indicador de registro de entrada que distingue entre invitados que ya ingresaron fisicamente al evento mediante el escaneo de su codigo QR y los que aun no lo han hecho.</p>

  <h2>Estados de usuarios y empresas</h2>
  <table>
    <thead><tr><th>Estado</th><th>Aplica a</th><th>Descripcion</th></tr></thead>
    <tbody>
      <tr><td><strong>Activo</strong></td><td>Usuario / Empresa</td><td>Puede acceder y operar normalmente en la plataforma</td></tr>
      <tr><td><strong>Inactivo</strong></td><td>Usuario / Empresa</td><td>El acceso esta bloqueado. Un usuario inactivo no puede iniciar sesion. Una empresa inactiva bloquea a todos sus usuarios asociados</td></tr>
    </tbody>
  </table>
</div>


<!-- ===== CAPITULO 9 ===== -->
<div class="capitulo">
  <h1>9. Preguntas frecuentes</h1>

  <h3>Un invitado perdio su enlace de invitacion. Como puede recuperarlo</h3>
  <p>El Organizador o Administrador puede ingresar al modulo de Invitados, localizar al invitado en la lista y reenviar la invitacion digital o copiar el enlace directamente desde las opciones del registro del invitado.</p>

  <hr/>

  <h3>Un codigo QR no puede ser leido por la camara. Que hacer</h3>
  <p>Se debe usar la opcion de validacion manual ingresando el codigo alfanumerico del invitado en el campo de texto del modulo de escaneo. El codigo generalmente aparece impreso junto al codigo QR en la invitacion fisica.</p>

  <hr/>

  <h3>El sistema marca codigo duplicado al escanear. El invitado puede ingresar</h3>
  <p>Antes de tomar una decision el personal debe comunicarse con el Organizador o Administrador. El sistema registra el ingreso en el primer escaneo valido y genera la alerta de duplicado en escaneos posteriores del mismo codigo como medida de seguridad para evitar accesos no autorizados.</p>

  <hr/>

  <h3>El album digital no acepta fotografias. Que puede estar pasando</h3>
  <p>Se deben verificar tres cosas en orden. Primero que el evento este en estado Activo porque en estado Borrador el album no funciona. Segundo que el evento ya haya dado inicio porque el album solo acepta fotografias a partir de la hora de inicio configurada. Tercero que el archivo no exceda los 10 megabytes por fotografia o que sea de un formato soportado: JPG, PNG o WebP.</p>

  <hr/>

  <h3>La pantalla de proyeccion no actualiza las nuevas fotografias. Que se debe hacer</h3>
  <p>Se debe revisar el indicador de conexion en la esquina superior derecha de la pantalla. Si aparece en rojo la conexion con el servidor se interrumpio y se debe recargar la pagina del navegador para restablecerla.</p>

  <hr/>

  <h3>Un Organizador puede crear un usuario con rol de Administrador</h3>
  <p>No. Solo el Administrador puede asignar ese nivel de acceso al crear o editar un usuario.</p>

  <hr/>

  <h3>Se pueden agregar invitados a un evento que ya esta en estado Activo</h3>
  <p>Si. Los invitados pueden agregarse al evento en cualquier estado. Sin embargo se recomienda completar la lista antes de activar el evento para una operacion mas ordenada durante el dia del evento.</p>

  <hr/>

  <h3>Que sucede con los datos si se elimina una empresa cliente</h3>
  <p>La eliminacion de una empresa elimina permanentemente todos los usuarios asociados a ella. Se recomienda verificar que no existan eventos activos ni informacion importante antes de proceder porque la accion es irreversible.</p>
</div>

<div style="page-break-before: always; padding-top: 3cm; text-align: center;">
  <hr/>
  <p style="font-size: 10pt; color: #444; margin-top: 0.5cm;">Revel — Sistema de Gestion de Eventos</p>
  <p style="font-size: 10pt; color: #444;">Version 1.0 &nbsp;|&nbsp; Julio 2026 &nbsp;|&nbsp; Todos los derechos reservados</p>
</div>

</body>
</html>`

const htmlPath = resolve(root, 'MANUAL_DE_USUARIO_REVEL.html')
writeFileSync(htmlPath, htmlDoc, 'utf-8')
console.log('HTML generado')

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const pdfPath = resolve(root, 'MANUAL_DE_USUARIO_REVEL.pdf')

execSync(
  `"${chromePath}" \
    --headless=new \
    --disable-gpu \
    --no-sandbox \
    --print-to-pdf="${pdfPath}" \
    --print-to-pdf-no-header \
    --no-pdf-header-footer \
    "file://${htmlPath}"`,
  { stdio: 'pipe', timeout: 120000 }
)
console.log('PDF generado:', pdfPath)
