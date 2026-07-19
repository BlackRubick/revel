# MANUAL DE USUARIO
## Plataforma Revel
### Sistema de Gestion de Eventos

---

**Version:** 1.0  
**Fecha de publicacion:** Julio 2026  
**Clasificacion:** Uso interno y entrega a cliente  
**Elaborado por:** Equipo de Desarrollo Revel  

---

## INDICE

1. [Introduccion](#1-introduccion)
   - 1.1 Proposito del documento
   - 1.2 Alcance
   - 1.3 Glosario de terminos

2. [Descripcion general del sistema](#2-descripcion-general-del-sistema)
   - 2.1 Arquitectura de roles
   - 2.2 Acceso al sistema
   - 2.3 Tipos de evento soportados

3. [Rol: Administrador](#3-rol-administrador)
   - 3.1 Panel de control
   - 3.2 Gestion de empresas
   - 3.3 Gestion de usuarios
   - 3.4 Gestion de eventos
   - 3.5 Gestion de invitados
   - 3.6 Gestion de mesas
   - 3.7 Escaner QR
   - 3.8 Album digital
   - 3.9 Proveedores

4. [Rol: Organizador](#4-rol-organizador)
   - 4.1 Panel de control
   - 4.2 Crear y editar eventos
   - 4.3 Gestion de invitados
   - 4.4 Asignacion de mesas
   - 4.5 Escaner QR
   - 4.6 Album digital
   - 4.7 Consulta de proveedores

5. [Rol: Escaner](#5-rol-escaner)
   - 5.1 Descripcion del rol
   - 5.2 Uso del escaner QR
   - 5.3 Validacion manual de codigo

6. [Rol: Pantalla](#6-rol-pantalla)
   - 6.1 Descripcion del rol
   - 6.2 Pantalla de proyeccion en tiempo real
   - 6.3 Controles de la proyeccion

7. [Rol: Invitado](#7-rol-invitado)
   - 7.1 Descripcion del rol
   - 7.2 Confirmacion de asistencia RSVP
   - 7.3 Subida de fotografias al album

8. [Estados del sistema](#8-estados-del-sistema)
   - 8.1 Estados de evento
   - 8.2 Estados de RSVP
   - 8.3 Estados de usuario y empresa

9. [Preguntas frecuentes](#9-preguntas-frecuentes)

10. [Soporte tecnico](#10-soporte-tecnico)

---

## 1. INTRODUCCION

### 1.1 Proposito del documento

El presente manual tiene como objetivo proporcionar una guia completa y detallada del uso de la plataforma Revel a todos los usuarios del sistema, sin importar el rol que desempenen. El documento describe de manera precisa cada funcionalidad disponible, los flujos de trabajo recomendados, las restricciones por nivel de acceso y los pasos necesarios para llevar a cabo cada operacion dentro de la plataforma.

Este manual esta disenado para ser utilizado como material de capacitacion inicial, referencia de consulta rapida durante la operacion diaria y guia de onboarding para nuevos colaboradores que se integren a cualquier empresa cliente de Revel.

### 1.2 Alcance

El alcance del presente documento cubre la totalidad de los modulos y funcionalidades de la plataforma Revel en su version 1.0, incluyendo:

- El panel de control administrativo accesible desde el dominio principal de la plataforma.
- El flujo de confirmacion de asistencia (RSVP) accesible por los invitados a traves de un enlace personalizado.
- El modulo de album digital accesible por los invitados para la carga de fotografias.
- El modulo de proyeccion en tiempo real para visualizacion en pantalla durante el evento.

El documento no cubre aspectos de configuracion de infraestructura, administracion de base de datos, ni integraciones de terceros que sean responsabilidad exclusiva del equipo tecnico de Revel.

### 1.3 Glosario de terminos

A continuacion se definen los terminos clave utilizados a lo largo de este manual:

| Termino | Definicion |
|---|---|
| Rol | Nivel de acceso asignado a un usuario dentro de la plataforma. Determina que modulos y acciones puede realizar. |
| RSVP | Sigla del frances "Repondez s'il vous plait". Corresponde al proceso de confirmacion o rechazo de asistencia a un evento por parte de un invitado. |
| QR | Codigo de respuesta rapida. Imagen bidimensional que almacena la informacion de identificacion del invitado y es escaneada al momento del acceso al evento. |
| Album digital | Modulo que permite a los invitados subir y visualizar fotografias del evento en tiempo real. |
| Pantalla en vivo | Modulo de proyeccion que muestra en tiempo real las fotografias subidas por los invitados durante el evento. |
| Paquete | Plan de servicio contratado por la empresa cliente. Define las funcionalidades disponibles para sus eventos. |
| Mesa | Unidad de organizacion espacial del evento a la que se asignan invitados. |
| Proveedor | Empresa o persona fisica que ofrece servicios complementarios al evento, registrada en el catalogo de la plataforma. |
| Estado | Condicion actual de un evento, invitado, usuario o empresa dentro del sistema. |
| Check-in | Registro de ingreso de un invitado al evento mediante la validacion de su codigo QR. |

---

## 2. DESCRIPCION GENERAL DEL SISTEMA

### 2.1 Arquitectura de roles

La plataforma Revel opera con cinco roles distintos, cada uno con un conjunto especifico de permisos y responsabilidades. La siguiente tabla resume el acceso de cada rol a los modulos del sistema:

| Modulo | Administrador | Organizador | Escaner | Pantalla | Invitado |
|---|:---:|:---:|:---:|:---:|:---:|
| Panel de control | SI | SI | NO | NO | NO |
| Empresas | SI | NO | NO | NO | NO |
| Usuarios | SI | NO | NO | NO | NO |
| Eventos (crear/editar) | SI | SI | NO | NO | NO |
| Invitados | SI | SI | NO | NO | NO |
| Mesas | SI | SI | NO | NO | NO |
| Escaner QR | SI | SI | SI | NO | NO |
| Album (administracion) | SI | SI | NO | NO | NO |
| Album (subida de fotos) | NO | NO | NO | NO | SI |
| Pantalla en vivo | NO | NO | NO | SI | NO |
| Proveedores | SI | SI (lectura) | NO | NO | NO |
| Confirmacion RSVP | NO | NO | NO | NO | SI |

**Administrador (ADMIN):** Es el nivel de acceso mas alto del sistema. Tiene control total sobre todos los modulos, incluyendo la gestion de empresas clientes, la creacion de usuarios con cualquier rol y la supervision de todos los eventos registrados en la plataforma.

**Organizador (ORGANIZER):** Es el usuario responsable de la operacion de uno o mas eventos. Tiene acceso a la gestion de invitados, mesas, album digital y escaner. No puede administrar empresas ni crear usuarios con rol de Administrador.

**Escaner (SCANNER):** Rol de acceso limitado destinado al personal de entrada del evento. Unicamente tiene acceso al modulo de escaneo QR para registrar el ingreso de los invitados.

**Pantalla (SCREEN):** Rol de acceso limitado destinado al operador del equipo de proyeccion durante el evento. Unicamente tiene acceso a la pantalla en vivo del album digital.

**Invitado (GUEST):** No es un usuario del sistema en el sentido tradicional. El invitado accede a funcionalidades especificas a traves de un enlace personalizado que contiene su codigo unico de identificacion. Puede confirmar su asistencia y subir fotografias al album.

### 2.2 Acceso al sistema

#### Para usuarios con cuenta (Administrador, Organizador, Escaner, Pantalla)

El acceso al sistema se realiza desde la pagina de inicio de sesion, disponible en la ruta `/login-magic` del dominio de la plataforma. El proceso es el siguiente:

1. Ingresar la direccion de correo electronico registrado en el campo correspondiente.
2. Ingresar la contrasena asignada o establecida por el administrador.
3. Hacer clic en el boton "Iniciar sesion".
4. El sistema redirige automaticamente al modulo correspondiente segun el rol del usuario:
   - Administrador y Organizador son redirigidos al panel de control `/dashboard`.
   - Escaner es redirigido al modulo de escaneo QR `/dashboard/qr`.
   - Pantalla es redirigido a la pantalla de proyeccion del evento asignado.

La sesion permanece activa durante el tiempo configurado por el administrador. Por seguridad, se recomienda cerrar sesion al terminar de usar la plataforma, especialmente desde dispositivos compartidos.

#### Para invitados

Los invitados no tienen cuenta en el sistema. El acceso se realiza exclusivamente a traves del enlace personalizado incluido en su invitacion digital, con el formato `/confirmar/[codigo]`. Este enlace es unico e intransferible.

### 2.3 Tipos de evento soportados

La plataforma Revel soporta los siguientes tipos de evento:

- **Boda:** Ceremonia y celebracion matrimonial. Incluye opcion de ceremonia religiosa.
- **Quinceanera (XV anos):** Celebracion de quinceanos. Incluye opcion de ceremonia religiosa.
- **Bautizo:** Ceremonia de bautismo. Incluye opcion de ceremonia religiosa.
- **Cumpleanos:** Celebracion de aniversario de nacimiento.
- **Baby Shower:** Celebracion previa al nacimiento de un bebe.
- **Graduacion:** Ceremonia de titulacion o graduacion academica.
- **Corporativo:** Evento de tipo empresarial o institucional.
- **Otro:** Cualquier tipo de evento no contemplado en las categorias anteriores.

---

## 3. ROL: ADMINISTRADOR

El Administrador es el usuario con mayor nivel de privilegios dentro de la plataforma. Tiene acceso irrestricto a todos los modulos y es el unico rol que puede crear empresas, gestionar todos los tipos de usuarios y supervisar la operacion global del sistema.

### 3.1 Panel de control

Al iniciar sesion, el Administrador accede automaticamente al panel de control principal ubicado en `/dashboard`. Este panel muestra un resumen ejecutivo de la actividad de la plataforma.

#### Metricas del panel principal

El panel presenta cuatro indicadores clave de desempeno:

- **Total de eventos:** Numero total de eventos registrados en el sistema, en cualquier estado.
- **Total de invitados:** Suma acumulada de todos los invitados registrados en todos los eventos.
- **Confirmados:** Numero de invitados que han respondido afirmativamente al RSVP, junto con el porcentaje de confirmacion calculado automaticamente.
- **Fotografias:** Numero total de fotografias subidas al album digital en todos los eventos.

#### Eventos recientes

La seccion central del panel muestra los eventos mas recientes registrados en el sistema, ordenados por fecha de creacion. Cada entrada incluye el nombre del evento, la fecha, el numero de invitados registrados y su estado actual. Al hacer clic sobre cualquier evento, el sistema navega a su pagina de detalle.

#### Estado RSVP

El panel incluye un grafico de barras de progreso que muestra la distribucion del estado de respuesta de los invitados en tres categorias:

- **Confirmados:** Invitados que aceptaron la invitacion.
- **Pendientes:** Invitados que aun no han respondido.
- **Rechazados:** Invitados que declinaron la invitacion.

#### Acciones rapidas

El panel ofrece accesos directos a las operaciones mas frecuentes:

- Crear nuevo evento.
- Gestionar invitados.
- Organizar mesas.
- Ver album digital.

### 3.2 Gestion de empresas

El modulo de empresas, accesible desde `/dashboard/companies`, es exclusivo del rol Administrador. Permite registrar, editar, activar o desactivar las empresas clientes que utilizan la plataforma.

#### Crear una empresa

Para registrar una nueva empresa, el Administrador debe hacer clic en el boton "Nueva empresa". Se abre un formulario dividido en dos secciones:

**Seccion Empresa:**
- **Nombre:** Nombre legal o comercial de la empresa (obligatorio).
- **Correo de contacto:** Direccion de correo electronico institucional.
- **Telefono:** Numero de contacto de la empresa.
- **Direccion:** Domicilio fiscal o de operacion.

**Seccion Encargado:**

Al crear una empresa se genera simultaneamente una cuenta de usuario con rol de Encargado, quien sera el responsable principal de la empresa dentro del sistema.

- **Nombre completo:** Nombre del encargado (obligatorio).
- **Correo:** Direccion de correo electronico del encargado, que sera su nombre de usuario (obligatorio).
- **Contrasena:** Contrasena inicial de acceso para el encargado (minimo 6 caracteres) (obligatorio).

Al hacer clic en "Crear empresa", el sistema registra tanto la empresa como el usuario encargado en una sola operacion.

#### Editar una empresa

Para modificar los datos de una empresa existente, el Administrador debe hacer clic en el boton "Editar" de la fila correspondiente. El formulario de edicion permite modificar:

- Nombre de la empresa.
- Correo de contacto.
- Telefono.
- Direccion.
- Estado: "Activa" o "Inactiva".

Los cambios se guardan al hacer clic en "Guardar cambios".

#### Eliminar una empresa

Al hacer clic en el boton "Eliminar" de la fila correspondiente, el sistema solicita confirmacion antes de proceder. Se advierte que la eliminacion de una empresa conlleva la eliminacion de todos los usuarios asociados a ella. Esta accion es irreversible.

#### Tabla de empresas

La tabla principal muestra las siguientes columnas para cada empresa registrada:

- Nombre e informacion adicional (direccion).
- Encargado asignado (nombre y correo).
- Correo de contacto de la empresa.
- Numero de usuarios asociados.
- Estado (Activa / Inactiva).
- Acciones disponibles (Editar / Eliminar).

### 3.3 Gestion de usuarios

El modulo de usuarios, accesible desde `/dashboard/users`, permite al Administrador crear, modificar y eliminar cuentas de usuario para todos los roles del sistema.

#### Crear un usuario

Al hacer clic en "Nuevo usuario" se abre un formulario con los siguientes campos:

- **Nombre completo:** Nombre y apellido del usuario (obligatorio).
- **Correo:** Direccion de correo electronico que servira como nombre de usuario (obligatorio).
- **Contrasena:** Contrasena de acceso inicial (obligatorio).
- **Rol:** Nivel de acceso a asignar. Las opciones disponibles para el Administrador son: Organizador, Escaner, Pantalla y Administrador.

#### Editar un usuario

Al hacer clic en el boton "Editar" se permite modificar el nombre, correo, rol y, opcionalmente, la contrasena del usuario. Si el campo de contrasena se deja en blanco, la contrasena actual no se modifica.

#### Eliminar un usuario

Al hacer clic en "Eliminar", el sistema solicita confirmacion antes de proceder. La eliminacion de un usuario es permanente e irreversible.

#### Tabla de usuarios

La tabla principal muestra:

- Nombre, inicial de nombre y correo electronico del usuario.
- Rol asignado con indicador visual.
- Estado: Activo o Inactivo.
- Fecha de creacion de la cuenta.
- Acciones disponibles (Editar / Eliminar).

### 3.4 Gestion de eventos

El modulo de eventos, accesible desde `/dashboard/events`, es el nucleo operativo de la plataforma. Permite al Administrador crear, visualizar y administrar todos los eventos registrados.

#### Lista de eventos

La pantalla principal muestra todos los eventos en formato de tarjetas visuales. Cada tarjeta incluye:

- Imagen de portada del evento o imagen predeterminada segun el tipo.
- Nombre del evento.
- Fecha y lugar.
- Numero de invitados registrados y fotografias subidas.
- Paquete contratado.
- Estado del evento con indicador visual.

La lista se puede filtrar por estado (Todos, Activos, Borrador, Finalizados) y buscar por nombre mediante el campo de busqueda.

#### Crear un evento

Para crear un nuevo evento, el Administrador hace clic en el boton "Nuevo evento". El formulario de creacion esta organizado en secciones numeradas:

**Seccion 1: Imagen del evento**

Se puede subir una imagen de portada para el evento mediante dos metodos:
- Hacer clic en el area de carga para abrir el selector de archivos.
- Arrastrar y soltar una imagen directamente sobre el area de carga.

Formatos aceptados: JPG, PNG, WebP. La imagen se mostrara en la tarjeta del evento, en la invitacion digital del invitado y como fondo de la pantalla de proyeccion.

**Seccion 2: Informacion basica**

- **Nombre del evento:** Titulo descriptivo del evento (obligatorio).
- **Tipo de evento:** Categoria del evento segun la lista de tipos soportados (obligatorio).
- **Paquete:** Plan de servicio aplicable al evento (obligatorio).
- **Descripcion:** Descripcion opcional del evento visible en la invitacion.

**Seccion 3: Fecha y lugar**

- **Fecha:** Fecha de celebracion del evento (obligatorio).
- **Hora:** Hora de inicio del evento.
- **Nombre del lugar:** Nombre del salon, recinto o espacio (obligatorio).
- **Direccion completa:** Domicilio del lugar de celebracion.
- **URL de Google Maps:** Enlace directo a la ubicacion en el mapa, que se mostrara al invitado como boton de navegacion.

**Seccion 4: Configuracion de mesas**

- **Numero de mesas:** Cantidad total de mesas que se crearan automaticamente al guardar el evento.
- **Capacidad por mesa:** Numero maximo de personas por mesa.

El sistema calcula y muestra la capacidad total del evento en tiempo real (numero de mesas multiplicado por la capacidad por mesa).

**Seccion 5: Opciones adicionales**

- **URL de mesa de regalos:** Enlace a una lista de regalos externa, que se presentara al invitado desde su invitacion.

**Seccion 6: Ceremonia religiosa (solo para Boda, Quinceanera y Bautizo)**

Si el tipo de evento seleccionado corresponde a Boda, Quinceanera o Bautizo, aparece una seccion adicional para registrar datos de la ceremonia religiosa:

- Casilla de verificacion para indicar si el evento incluye ceremonia en iglesia.
- Nombre de la iglesia o templo.
- Direccion de la iglesia.

Al hacer clic en "Crear evento", el sistema registra el evento y genera automaticamente las mesas configuradas. A continuacion redirige a la pagina de detalle del evento recien creado.

#### Pagina de detalle del evento

La pagina de detalle de un evento, accesible haciendo clic sobre cualquier tarjeta de la lista, proporciona una vision completa del evento organizada en pestanas:

**Pestana Resumen:**
Muestra cuatro indicadores: total de invitados, total de fotografias, numero de mesas y numero de mensajes recibidos. Tambien presenta la informacion general del evento (fecha, hora, lugar, tipo, paquete y descripcion).

**Pestana Invitados:**
Lista completa de invitados con opciones de gestion (agregar, editar, eliminar, generar QR y enviar invitacion).

**Pestana Mesas:**
Visualizacion y gestion de mesas con asignacion de invitados.

**Pestana Album:**
Galeria de fotografias subidas al evento con opcion de descarga masiva en formato ZIP (disponible segun paquete).

**Acciones del evento:**

- **Activar evento:** Cambia el estado del evento de "Borrador" a "Activo". Solo disponible cuando el estado es "Borrador". Una vez activado, los invitados pueden usar sus codigos QR y el album digital.
- **Editar:** Abre el formulario de edicion con todos los campos del evento precargados.
- **Descargar fotos:** Descarga todas las fotografias del album en un archivo ZIP comprimido (disponible segun paquete contratado).

### 3.5 Gestion de invitados

El modulo de invitados, accesible desde `/dashboard/guests`, permite administrar la lista de asistentes de cualquier evento.

#### Seleccion de evento

Al ingresar al modulo, el sistema muestra la lista de todos los eventos disponibles en formato de tarjetas. El usuario debe seleccionar el evento al que desea gestionar invitados haciendo clic sobre la tarjeta correspondiente.

#### Lista de invitados

Una vez seleccionado el evento, se muestra la lista completa de invitados con las siguientes columnas:

- Nombre del invitado.
- Correo electronico.
- Numero de acompanantes autorizados.
- Mesa asignada.
- Estado RSVP (Pendiente, Confirmado, Rechazado).
- Estado de check-in (Si ingreso al evento o no).
- Codigo QR generado o pendiente de generacion.
- Acciones disponibles.

#### Agregar un invitado

Al hacer clic en el boton de agregar invitado, se abre un formulario con los siguientes campos:

- **Nombre completo:** Nombre del invitado (obligatorio).
- **Correo electronico:** Direccion de correo para enviar la invitacion digital.
- **Telefono:** Numero de contacto del invitado.
- **Numero de acompanantes:** Cantidad maxima de personas adicionales que puede llevar el invitado consigo.
- **Mesa:** Asignacion de mesa al momento del registro (opcional, puede asignarse despues desde el modulo de mesas).

#### Generar codigo QR

Cada invitado tiene asociado un codigo unico de identificacion. Para generar el codigo QR imprimible o compartible del invitado, se debe hacer clic en la opcion correspondiente en las acciones del invitado. El sistema genera el codigo QR de forma instantanea y lo asocia al perfil del invitado.

El codigo QR contiene la informacion de identificacion del invitado y es escaneado al momento de su ingreso al evento para registrar el check-in.

#### Editar un invitado

Permite modificar cualquier dato del invitado: nombre, correo, telefono, numero de acompanantes y mesa asignada.

#### Eliminar un invitado

Elimina permanentemente al invitado del evento. Se solicita confirmacion antes de ejecutar la accion.

### 3.6 Gestion de mesas

El modulo de mesas, accesible desde `/dashboard/tables`, permite organizar el acomodo de los invitados en las mesas configuradas para cada evento.

#### Seleccion de evento

Al igual que el modulo de invitados, el sistema presenta la lista de eventos para seleccionar el que se desea gestionar.

#### Vista de mesas

Una vez seleccionado el evento, se muestran todas las mesas creadas con la siguiente informacion para cada una:

- Numero y nombre de la mesa.
- Capacidad total de la mesa.
- Numero de invitados asignados actualmente.
- Lista de invitados asignados a esa mesa.
- Indicador de ocupacion (disponible / llena).

#### Asignacion de invitados a mesas

Para asignar un invitado a una mesa, el usuario puede:

- Seleccionar la mesa de destino desde la tarjeta de un invitado.
- Arrastrar el nombre del invitado hacia la mesa correspondiente (si la interfaz lo soporta).

El sistema verifica automaticamente que la mesa no exceda su capacidad antes de confirmar la asignacion. Si la mesa esta llena, el sistema notifica al usuario y no permite la asignacion.

Un invitado solo puede estar asignado a una mesa a la vez. Si se reasigna a una mesa distinta, se libera automaticamente su lugar en la mesa anterior.

### 3.7 Escaner QR

El modulo de escaneo QR, accesible desde `/dashboard/qr`, permite registrar el ingreso de los invitados al evento mediante la lectura de su codigo QR.

#### Activar la camara

Al ingresar al modulo, se muestra la vista de la camara con un encuadre de alineacion. Para activar la camara del dispositivo, se debe hacer clic en el boton "Activar camara". El navegador puede solicitar permiso de acceso a la camara; se debe aceptar para continuar.

Una vez activa la camara, el escaner funciona en modo continuo y detecta automaticamente cualquier codigo QR que aparezca dentro del encuadre.

#### Proceso de escaneo

1. El invitado presenta su codigo QR frente a la camara del dispositivo.
2. El sistema lee el codigo en tiempo real.
3. El sistema valida el codigo contra la base de datos.
4. Se muestra el resultado de la validacion en pantalla.

#### Resultados posibles de la validacion

**Validacion exitosa:**
El sistema muestra en pantalla la siguiente informacion del invitado:
- Nombre completo.
- Nombre del evento al que corresponde.
- Mesa asignada.
- Numero total de pases (el invitado mas sus acompanantes autorizados).

**Codigo duplicado:**
Si el codigo ya fue utilizado anteriormente, el sistema muestra una advertencia indicando que ese QR ya fue escaneado. No registra un segundo check-in para evitar ingresos duplicados.

**Codigo invalido:**
Si el codigo no corresponde a ningun invitado registrado o no pertenece al evento activo, el sistema muestra un error indicando que el codigo no es valido.

#### Validacion manual de codigo

Ademas del escaneo por camara, el modulo ofrece un campo de texto para ingresar el codigo del invitado manualmente. Esto es util cuando la calidad de impresion del QR es insuficiente para su lectura optica o cuando el dispositivo no cuenta con camara disponible.

Para validar manualmente:
1. Escribir el codigo del invitado en el campo de texto.
2. Presionar la tecla Enter o hacer clic en el boton "Validar".
3. El sistema muestra el resultado de la validacion.

#### Detener la camara

Para conservar la bateria del dispositivo o al finalizar la jornada de check-in, se puede detener la camara haciendo clic en el enlace "Detener camara" ubicado debajo del visor.

### 3.8 Album digital

El modulo de album digital para la administracion, accesible desde `/dashboard/album`, permite al Administrador visualizar, gestionar y descargar todas las fotografias subidas por los invitados durante un evento.

#### Seleccion de evento

El sistema presenta la lista de eventos con el numero de fotografias subidas en cada uno. Se selecciona el evento deseado para ingresar a su album.

#### Galeria de fotografias

Una vez dentro del album del evento, se muestra una galeria en formato de cuadricula con todas las fotografias subidas. Al hacer clic sobre cualquier fotografia, se abre en una vista ampliada con el nombre del invitado que la subio y la fecha de carga.

#### Acciones del album

- **Ver pantalla:** Abre en una nueva pestana del navegador la vista de proyeccion en tiempo real del evento. Util para previsualizar lo que se muestra en el proyector durante el evento.
- **Descargar todo:** Descarga todas las fotografias del album en un archivo ZIP comprimido con el nombre del evento. Disponible segun el paquete contratado.

### 3.9 Proveedores

El modulo de proveedores, accesible desde `/dashboard/suppliers`, es un catalogo de empresas y personas que ofrecen servicios complementarios para los eventos, como fotografia, video, musica, catering, decoracion, entre otros.

#### Catalogo de proveedores

Los proveedores se muestran en formato de tarjetas con la siguiente informacion:

- Nombre del proveedor.
- Categoria de servicio.
- Descripcion breve.
- Informacion de contacto (telefono, correo, redes sociales).
- Calificacion (si aplica).

#### Filtrado por categoria

El catalogo puede filtrarse por categoria de servicio mediante los botones de filtro ubicados sobre la lista. El boton "Todos" muestra el catalogo completo.

#### Agregar un proveedor (solo Administrador)

El Administrador puede agregar nuevos proveedores al catalogo haciendo clic en el boton "Nuevo proveedor". Los datos requeridos son:

- Nombre del proveedor (obligatorio).
- Categoria de servicio (obligatorio).
- Descripcion del servicio.
- Informacion de contacto: telefono, correo, sitio web, redes sociales.

#### Editar y eliminar proveedores (solo Administrador)

Desde las acciones de cada tarjeta de proveedor, el Administrador puede editar la informacion del proveedor o eliminarlo del catalogo. La eliminacion es permanente.

---

## 4. ROL: ORGANIZADOR

El Organizador es el usuario responsable de la planeacion y operacion de eventos. Tiene acceso a la mayoria de los modulos del sistema, con excepcion de la administracion de empresas y usuarios. Su experiencia en la plataforma es identica a la del Administrador en los modulos que comparten, con las siguientes diferencias:

- No puede acceder al modulo de empresas.
- No puede acceder al modulo de usuarios.
- No puede agregar proveedores al catalogo (solo puede consultarlos).
- No puede crear usuarios con rol de Administrador.

### 4.1 Panel de control

El panel de control del Organizador es identico en estructura al del Administrador y muestra las mismas metricas y secciones. Las metricas mostradas pueden estar limitadas a los eventos que el Organizador tiene asignados, segun la configuracion de la empresa.

Para un uso detallado del panel de control, referirse a la seccion 3.1 de este manual.

### 4.2 Crear y editar eventos

El Organizador puede crear y editar eventos siguiendo exactamente el mismo proceso descrito para el Administrador en la seccion 3.4. Las funcionalidades de filtrado, busqueda, activacion y descarga de fotos son identicas.

Para el proceso completo de creacion y gestion de eventos, referirse a la seccion 3.4 de este manual.

### 4.3 Gestion de invitados

El Organizador tiene acceso completo al modulo de invitados. Puede agregar, editar, eliminar invitados, generar codigos QR y enviar invitaciones digitales. El proceso es identico al descrito para el Administrador.

Para el proceso completo de gestion de invitados, referirse a la seccion 3.5 de este manual.

### 4.4 Asignacion de mesas

El Organizador puede gestionar la distribucion de invitados en mesas de la misma manera que el Administrador.

Para el proceso completo de gestion de mesas, referirse a la seccion 3.6 de este manual.

### 4.5 Escaner QR

El Organizador tiene acceso al escaner QR durante el evento. El proceso de escaneo y validacion es identico al descrito para el Administrador.

Para el proceso completo de uso del escaner QR, referirse a la seccion 3.7 de este manual.

### 4.6 Album digital

El Organizador puede visualizar y gestionar el album digital de sus eventos, incluyendo la descarga masiva de fotografias.

Para el proceso completo de gestion del album, referirse a la seccion 3.8 de este manual.

### 4.7 Consulta de proveedores

El Organizador puede consultar el catalogo de proveedores y filtrar por categoria, pero no puede agregar, editar ni eliminar proveedores del catalogo. Esta funcion esta reservada exclusivamente para el Administrador.

---

## 5. ROL: ESCANER

### 5.1 Descripcion del rol

El rol de Escaner esta disenado para el personal de entrada encargado de controlar el acceso de los invitados durante el evento. Es un rol de acceso limitado: el usuario con este rol unicamente puede utilizar el modulo de escaneo QR. No tiene acceso al panel de control, ni a la gestion de eventos, invitados, mesas, album ni proveedores.

Este rol es ideal para asignar a personal de apoyo durante la jornada del evento sin otorgarle acceso a informacion sensible de la operacion.

### 5.2 Uso del escaner QR

Al iniciar sesion con una cuenta de rol Escaner, el sistema redirige directamente al modulo de escaneo QR ubicado en `/dashboard/qr`. El proceso de operacion es el siguiente:

**Paso 1: Activar la camara**

Al ingresar al modulo, se muestra el visor de la camara con un encuadre de alineacion. Hacer clic en el boton "Activar camara". El navegador puede solicitar permiso de acceso a la camara del dispositivo; se debe aceptar para que el escaner funcione.

Es recomendable utilizar dispositivos con camara trasera de alta resolucion para garantizar una lectura rapida y precisa de los codigos QR.

**Paso 2: Escanear el codigo QR**

Una vez activa la camara, pedir al invitado que presente su codigo QR frente al dispositivo. El codigo puede estar impreso en la invitacion fisica o en la pantalla de su dispositivo movil. Centrar el codigo dentro del encuadre de alineacion que aparece en pantalla.

El sistema detecta y lee el codigo automaticamente sin necesidad de presionar ningun boton.

**Paso 3: Leer el resultado**

Inmediatamente despues de la lectura, el sistema muestra uno de los siguientes resultados:

- **Acceso permitido (resultado verde):** El invitado es valido y su check-in fue registrado exitosamente. Se muestra su nombre, el evento al que corresponde, la mesa asignada y el numero de pases autorizados (el invitado mas sus acompanantes).
- **Codigo duplicado (resultado amarillo):** El codigo ya fue escaneado anteriormente. Se debe consultar con el supervisor antes de permitir el ingreso.
- **Codigo invalido (resultado rojo):** El codigo no corresponde a ningun invitado registrado. No permitir el ingreso.

**Paso 4: Continuar con el siguiente invitado**

Hacer clic en el boton "Escanear siguiente" para cerrar la pantalla de resultado y escanear al proximo invitado. La camara se reactiva automaticamente.

### 5.3 Validacion manual de codigo

Cuando el codigo QR del invitado no puede ser leido por la camara (por dano en la impresion, baja resolucion o brillo de pantalla insuficiente), se puede ingresar el codigo manualmente:

1. Localizar el campo de texto titulado "O ingresa el codigo manualmente" ubicado debajo del visor de la camara.
2. Escribir el codigo alfanumerico del invitado, que puede encontrarse impreso junto al codigo QR en la invitacion.
3. Presionar la tecla Enter o hacer clic en el boton "Validar".
4. El sistema procesa el codigo y muestra el resultado de la misma forma que con el escaneo optico.

**Nota importante para el personal de escaner:** En caso de duda sobre la validez de un codigo o ante situaciones no contempladas en este manual, comunicarse con el Organizador o Administrador del evento antes de tomar una decision de acceso.

---

## 6. ROL: PANTALLA

### 6.1 Descripcion del rol

El rol de Pantalla esta disenado para el operador del equipo de proyeccion durante el evento. Este usuario unicamente tiene acceso a la vista de proyeccion en tiempo real del album digital. No puede gestionar eventos, invitados, ni ninguna otra funcionalidad del sistema.

Este rol es ideal para asignar al tecnico audiovisual o al operador del sistema de proyeccion del salon, permitiendole controlar la pantalla sin exponerle informacion de operacion del evento.

### 6.2 Pantalla de proyeccion en tiempo real

La vista de proyeccion, accesible en `/pantalla/[id-del-evento]`, esta disenada para mostrarse en pantalla completa en un televisor, pantalla LED o proyector durante el evento. Muestra automaticamente las fotografias que los invitados van subiendo al album digital.

#### Elementos de la interfaz de proyeccion

**Barra superior:**
- Logotipo de Revel y nombre del evento.
- Indicador "En Vivo" con pulso animado.
- Hora actual actualizada periodicamente.
- Contador total de fotografias en el album.

**Area principal:**
Muestra la fotografia actual en formato centrado y a tamano completo, con un efecto de desenfoque suave del mismo imagen como fondo.

**Informacion de la fotografia:**
En la parte inferior de la imagen se muestra:
- El pie de foto o descripcion dejada por el invitado (si existe).
- El nombre del invitado que subio la fotografia.

**Barra de progreso:**
En la parte inferior de la pantalla se muestra una barra de progreso que indica el avance de la reproduccion de la diapositiva actual antes de pasar a la siguiente.

**Ticker de mensajes:**
Si los invitados enviaron mensajes junto con sus fotografias, estos se muestran en una banda de texto deslizante en la parte inferior de la pantalla.

**Indicador de conexion:**
Un pequeno circulo en la esquina superior derecha indica el estado de la conexion en tiempo real: verde cuando esta conectado al servidor y rojo cuando la conexion se ha interrumpido.

#### Comportamiento automatico

- Las fotografias se reproducen en una presentacion automatica con una duracion de aproximadamente 6 segundos por imagen.
- Cuando un invitado sube una nueva fotografia, esta aparece automaticamente en la proyeccion con una notificacion de "Nueva foto".
- El sistema reproduce las fotografias en orden ciclico, volviendo al principio al llegar a la ultima imagen.

### 6.3 Controles de la proyeccion

- **Pantalla completa:** Hacer doble clic en cualquier lugar de la pantalla de proyeccion activa o desactiva el modo de pantalla completa del navegador. Se recomienda activar el modo pantalla completa para una presentacion profesional durante el evento.
- **Navegacion manual:** En la barra inferior se muestran puntos de navegacion que permiten saltar a una fotografia especifica haciendo clic sobre el punto correspondiente.

**Recomendaciones operativas:**

- Conectar el dispositivo a la red electrica antes de iniciar la proyeccion para evitar interrupciones por bateria.
- Mantener una conexion estable a Internet durante todo el evento para garantizar la actualizacion en tiempo real del album.
- Activar el modo pantalla completa y silenciar las notificaciones del dispositivo antes de iniciar el evento.
- Si la conexion se interrumpe (indicador rojo), recargar la pagina del navegador para restablecer la conexion.

---

## 7. ROL: INVITADO

### 7.1 Descripcion del rol

El invitado no es un usuario registrado en el sistema con credenciales propias. El invitado accede a las funcionalidades que le corresponden exclusivamente a traves de un enlace personalizado que el Organizador le envia. Este enlace contiene un codigo unico e intransferible que identifica al invitado dentro del sistema.

Las dos funcionalidades accesibles para el invitado son:

1. Confirmacion de asistencia (RSVP) en la ruta `/confirmar/[codigo]`.
2. Subida y visualizacion de fotografias en el album digital en la ruta `/album/[id-del-evento]`.

### 7.2 Confirmacion de asistencia RSVP

La pagina de confirmacion de asistencia es la primera interaccion del invitado con el sistema. Se accede a traves del enlace incluido en la invitacion digital recibida por correo electronico, mensaje de texto u otro medio de comunicacion.

#### Informacion mostrada al invitado

Al abrir el enlace, el invitado visualiza:

- Logotipo de Revel.
- Nombre del evento al que fue invitado.
- Fecha del evento.
- Su nombre personalizado.
- La mesa que le fue asignada (si ya fue asignado a una mesa).

#### Proceso de confirmacion

Si el invitado aun no ha respondido, la pagina muestra dos opciones:

**Opcion "Si asistire":**

1. Hacer clic en la tarjeta "Si asistire".
2. Si el invitado tiene pases de acompanantes autorizados, aparece un selector para indicar cuantos acompanantes llevara. Puede elegir entre 0 y el maximo de acompanantes que le fueron asignados.
3. Opcionalmente, puede escribir un mensaje para los organizadores o los anfitriones del evento en el campo de texto.
4. Hacer clic en el boton "Confirmar".
5. El sistema registra la confirmacion y muestra un mensaje de exito.

**Opcion "No podre asistir":**

1. Hacer clic en la tarjeta "No podre asistir".
2. Hacer clic en el boton "Confirmar".
3. El sistema registra el rechazo y muestra un mensaje de agradecimiento.

#### Estado previo de RSVP

Si el invitado ya respondio anteriormente al RSVP, la pagina muestra el estado de su respuesta previa (confirmado o rechazado) sin posibilidad de modificarlo. Si el organizador permite cambios, el sistema habilitara la opcion de actualizacion.

#### Acciones adicionales desde la pagina de confirmacion

Desde la pagina de confirmacion, el invitado tiene acceso a dos botones adicionales:

- **Ver ubicacion:** Abre el mapa con la ubicacion del evento en una nueva pestana. Solo visible si el organizador ingreso una URL de mapa al crear el evento.
- **Subir fotos al album:** Redirige al invitado a la pagina del album digital del evento.

### 7.3 Subida de fotografias al album

El album digital, accesible en `/album/[id-del-evento]`, permite a los invitados compartir sus fotografias del evento en tiempo real. Las fotografias subidas aparecen instantaneamente en la pantalla de proyeccion y en la galeria del album.

#### Control de apertura del album

El album digital tiene un sistema de control de apertura basado en la hora del evento. Si el invitado accede al album antes de la hora de inicio del evento, verifica un contador regresivo que muestra el tiempo restante para que el album abra. La subida de fotografias no esta disponible hasta que el evento haya comenzado.

El contador muestra el tiempo restante en dias, horas, minutos y segundos, y se actualiza en tiempo real.

Una vez que el evento ha comenzado, el area de subida de fotografias se habilita automaticamente.

#### Subir una fotografia

El invitado puede subir fotografias de dos maneras:

**Arrastrar y soltar:**
Arrastrar una o mas fotografias desde el explorador de archivos del dispositivo y soltarlas sobre el area de carga. El area cambia de apariencia al detectar los archivos arrastrados para confirmar que seran cargados.

**Seleccionar archivos:**
Hacer clic sobre el area de carga para abrir el selector de archivos del dispositivo. Seleccionar una o varias fotografias.

Formatos aceptados: JPG, PNG, WebP. Tamano maximo por fotografia: 10 MB.

#### Cola de carga

Al agregar fotografias, aparece una lista con las imagenes seleccionadas y su estado de carga:
- Pendiente: La fotografia esta en cola y aun no se ha enviado.
- En proceso: La fotografia se esta enviando al servidor.
- Completado: La fotografia fue subida exitosamente.
- Error: No se pudo subir la fotografia.

Para iniciar la subida de todas las fotografias en cola, hacer clic en el boton "Subir [numero de fotos] foto(s)".

#### Galeria del evento

La parte inferior de la pagina muestra la galeria completa de fotografias subidas por todos los invitados. Las fotografias mas recientes aparecen primero. Al hacer clic en una fotografia, se abre en una vista ampliada.

---

## 8. ESTADOS DEL SISTEMA

### 8.1 Estados de evento

Los eventos pueden encontrarse en uno de los siguientes cuatro estados durante su ciclo de vida:

| Estado | Descripcion |
|---|---|
| Borrador | El evento fue creado pero aun no ha sido activado. Los invitados no pueden usar sus codigos QR ni el album digital. |
| Activo | El evento esta en plena operacion. Los invitados pueden confirmar asistencia, los escaneres QR funcionan y el album digital acepta fotografias. |
| Finalizado | El evento concluyo. Se conserva el historial pero no se aceptan nuevas interacciones. |
| Cancelado | El evento fue cancelado. Se conserva el registro pero queda bloqueado para cualquier operacion. |

**Transiciones de estado:**

- Un evento se crea siempre en estado "Borrador".
- El Administrador u Organizador debe activar manualmente el evento haciendo clic en el boton "Activar evento" desde la pagina de detalle.
- Una vez activado, el estado cambia automaticamente a "Finalizado" segun la configuracion o puede ser marcado manualmente.
- El estado "Cancelado" puede aplicarse en cualquier momento antes de que el evento finalice.

### 8.2 Estados de RSVP

El estado de respuesta de cada invitado puede ser uno de los siguientes:

| Estado | Descripcion |
|---|---|
| Pendiente | El invitado aun no ha respondido al RSVP. Este es el estado inicial de todo invitado al ser registrado. |
| Confirmado | El invitado respondio que asistira al evento. |
| Rechazado | El invitado respondio que no asistira al evento. |

Adicionalmente, existe un indicador de **Check-in** que registra si el invitado ya ingreso fisicamente al evento mediante el escaneo de su codigo QR:

| Estado de check-in | Descripcion |
|---|---|
| No registrado | El invitado aun no ha hecho check-in. |
| Registrado | El codigo QR del invitado fue escaneado exitosamente. |

### 8.3 Estados de usuario y empresa

**Usuarios:**

| Estado | Descripcion |
|---|---|
| Activo | El usuario puede iniciar sesion y usar la plataforma normalmente. |
| Inactivo | El acceso del usuario esta bloqueado. No puede iniciar sesion hasta ser reactivado por un Administrador. |

**Empresas:**

| Estado | Descripcion |
|---|---|
| Activa | La empresa opera normalmente dentro de la plataforma. |
| Inactiva | El acceso de todos los usuarios asociados a la empresa esta bloqueado. |

---

## 9. PREGUNTAS FRECUENTES

**P: Un invitado perdio su enlace de invitacion. Como puede recuperarlo?**

R: El Organizador o Administrador puede ingresar al modulo de invitados del evento correspondiente, localizar al invitado en la lista y reenviar su invitacion digital o copiar el enlace directamente desde las opciones del invitado.

---

**P: Un codigo QR no es leido por la camara. Que debo hacer?**

R: Utilizar la opcion de validacion manual. El personal de escaner puede ingresar el codigo alfanumerico del invitado directamente en el campo de texto del modulo de escaneo. El codigo generalmente se encuentra impreso junto al QR en la invitacion fisica.

---

**P: Un invitado escaneo su QR pero el sistema marca codigo duplicado. Puede ingresar?**

R: Antes de tomar una decision, el personal de escaner debe comunicarse con el Organizador o Administrador del evento. El sistema registra el check-in en el primer escaneo valido; un segundo escaneo del mismo codigo activa la alerta de duplicado como medida de seguridad para prevenir accesos no autorizados.

---

**P: El album digital no acepta fotografias. Que puede estar ocurriendo?**

R: Verificar los siguientes puntos en orden:
1. El evento debe estar en estado "Activo". Si esta en "Borrador", el album no funciona.
2. El album solo acepta fotografias a partir de la hora de inicio del evento. Si el evento aun no ha comenzado, el invitado vera un contador regresivo en lugar del area de carga.
3. El archivo puede exceder el limite de 10 MB por fotografia o no ser de un formato soportado (JPG, PNG, WebP).

---

**P: La pantalla de proyeccion no actualiza las nuevas fotografias automaticamente. Que debo hacer?**

R: Verificar el indicador de conexion en la esquina superior derecha de la pantalla de proyeccion. Si el circulo es rojo, la conexion con el servidor se interrumpio. Recargar la pagina del navegador para restablecer la conexion en tiempo real.

---

**P: Un Organizador quiere crear un usuario Administrador. Es posible?**

R: No. El rol de Organizador no tiene permisos para crear usuarios con rol de Administrador. Solo el Administrador puede asignar ese nivel de acceso.

---

**P: Como se calcula el porcentaje de confirmacion que muestra el panel de control?**

R: El porcentaje de confirmacion se calcula dividiendo el numero de invitados con estado "Confirmado" entre el total de invitados registrados, multiplicado por cien. Los invitados en estado "Pendiente" o "Rechazado" no se incluyen en el numerador.

---

**P: Puedo agregar invitados a un evento que ya esta en estado "Activo"?**

R: Si. Los invitados pueden agregarse al evento en cualquier estado, incluyendo "Activo". Sin embargo, se recomienda completar la lista de invitados antes de activar el evento para una operacion mas ordenada.

---

**P: Que sucede con los datos del evento si se elimina la empresa cliente?**

R: La eliminacion de una empresa elimina permanentemente todos los usuarios asociados a ella. Se recomienda precaucion y verificar que no existan eventos activos o datos relevantes antes de proceder con la eliminacion.

---

## 10. SOPORTE TECNICO

Para reportar incidentes, solicitar asistencia tecnica o enviar sugerencias de mejora, el usuario debe contactar al equipo de soporte de Revel a traves de los canales oficiales proporcionados por el equipo comercial.

Al reportar un incidente, se recomienda incluir la siguiente informacion para agilizar la atencion:

- Nombre del usuario y empresa.
- Rol del usuario en el sistema.
- Modulo o funcionalidad donde se presento el incidente.
- Descripcion detallada del problema.
- Pasos para reproducir el problema, si aplica.
- Capturas de pantalla del error, si estan disponibles.

---

*Fin del documento.*

*Revel - Sistema de Gestion de Eventos*  
*Version 1.0 - Julio 2026*  
*Todos los derechos reservados.*
