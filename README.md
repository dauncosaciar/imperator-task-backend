<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<div style="text-align: center;">
  <h1>ImperatorTask: Backend</h1>
  <p>
    &acd;
    <a href="https://imperator-task.vercel.app/" target="_blank">PRUEBA LA DEMO</a>
    &acd;
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Tabla de Contenidos</summary>
  <ol>
    <li>
      <a href="#acerca-del-proyecto">Acerca del Proyecto</a>
      <ul>
        <li><a href="#tecnologías-utilizadas">Tecnologías utilizadas</a></li>
      </ul>
    </li>
    <li>
      <a href="#guía-de-inicio">Guía de Inicio</a>
      <ul>
        <li><a href="#prerrequisitos">Prerrequisitos</a></li>
        <li><a href="#instalación-del-proyecto-local">Instalación del Proyecto local</a></li>
        <li><a href="#endpoints-de-la-api">Endpoints de la API</a></li>
        <li><a href="#archivos-json-de-endpoints-y-ambiente">Archivos JSON de endpoints y ambiente</a></li>
      </ul>
    </li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## Acerca del Proyecto

![Project Screenshot][project-screenshot]

Se trata de una API Rest para un dashboard que gestiona `Usuarios`, `Proyectos`, `Tareas`, `Notas` y `Colaboradores` de la siguiente forma:

1. `Usuarios`:
   - Registro de usuarios usando un email.
   - Habilitar cuentas de usuarios usando un token que llega al email utilizado para registrar una cuenta.
   - Reestablecer contraseña de usuarios usando un token que llega al email utilizado para registrar una cuenta.
   - Inicio y cierre de sesión de usuarios.
   - Modificación de datos del usuarios.

2. `Proyectos`:
   - Alta de un nuevo Proyecto.
   - Edición de los datos generales de un Proyecto existente.
   - Eliminación de un Proyecto existente junto con todos los Colaboradores, Tareas y Notas asociados.
   - Asignación de nuevos Colaboradores.

3. `Tareas`:
   - Alta de nuevas Tareas por Proyecto.
   - Edición de los datos generales de una Tarea existente.
   - Eliminación de una Tarea existente junto con todas las Notas asociadas.
   - Cambio de estado de las Tareas.

4. `Notas`:
   - Alta de nuevas Notas por Tarea.
   - Eliminación de Notas existentes.

5. `Colaboradores` o `Miembros`:
   - Son Usuarios registrados que se asignan a un Proyecto que no les pertenece para ayudar con la conclusión de sus Tareas. Un Usuario que crea un Proyecto es su **Mánager**.
   - Los Colaboradores no pueden modificar los datos generales de un Proyecto ni eliminarlos.
   - Los Colaboradores sí pueden ver el contenido de un Proyecto: Tareas y Notas asociadas.
   - Los Colaboradores no pueden agregar ni eliminar Tareas y Colaboradores nuevos a un Proyecto que no sea de ellos.
   - Los Colaboradores sí pueden cambiar el estado de una Tarea.
   - Los Colaboradores sí pueden crear una Nota en una Tarea mas no pueden eliminar Notas creadas por otros Usuarios.

<p style="text-align: right;">[<a href="#readme-top">volver hacia arriba</a>]</p>

### Tecnologías utilizadas

![Node.js][Node.js] ![Typescript][Typescript] ![Express.js][Express.js] ![MongoDB][MongoDB]

<p style="text-align: right;">[<a href="#readme-top">volver hacia arriba</a>]</p>

<!-- GETTING STARTED -->

## Guía de Inicio

A continuación, se detallan las consideraciones a tener en cuenta para ejecutar este Proyecto de forma local con la finalidad de probar su funcionamiento.

### Prerrequisitos

El listado siguiente **es lo que debes tener instalado y configurado en tu máquina local** antes de poder instalar y ejecutar el Proyecto ImperatorTask Backend.

1. **Instalar Node.js**: Debes instalar la versión `22.21.1` de Node.js para poder ejecutar sin problemas el proyecto. Además, con node se instala automáticamente NPM.
2. **Tener una cuenta en MongoDB Atlas**: Para poder usar un usuario, contraseña y base de datos de MongoDB para el backend.
3. **Tener una cuenta de Mailtrap**: Para poder recibir emails de prueba tipo sandbox para probar las funcionalidades relacionadas al registro y validación de cuentas de ImperatorTask, así como restablecimiento de la contraseña.

### Instalación del Proyecto local

Abre una terminal con permisos de administrador (recomendado) y realiza lo siguiente:

1. Clona el repositorio:

   ```sh
   git clone https://github.com/dauncosaciar/imperator-task-backend.git
   ```

2. Dirígite al directorio e ingresa a la carpeta del repositorio clonada.

3. Instala las dependencias con:

   ```sh
   npm install
   ```

4. Haz una copia del archivo `.env.example` y cambiale el nombre a `.env`.

5. Debes editar el archivo `.env` cambiando los valores de las variables de entorno presentes con tus valores reales para la info del Proyecto, emails de testing (estos los sacas de tu cuenta de Mailtrap) y el secret para JWT. Para el caso de la variable `FRONTEND_URL` su valor debe ser `http://localhost:7777`, ya que el puerto en el que se ejecuta el frontend está configurado para que sea el 7777, pero puede ser cambiado.

6. Levanta el proyecto con:

   ```sh
   npm run dev:api
   ```

   Si el ejecutar este comando, en la consola ves algo parecido a esto:

   ```sh
    > imperator-task-backend@1.0.0 dev
    > nodemon --exec ts-node src/index.ts

    [nodemon] 3.1.9
    [nodemon] to restart at any time, enter `rs`
    [nodemon] watching path(s): *.*
    [nodemon] watching extensions: ts,json
    [nodemon] starting `ts-node src/index.ts`
    REST API running on port 3333
    MongoDB connected on: ac-tgvqjpo-shard-00-00.czeyjhb.mongodb.net:27017
   ```

   Quiere decir que has instalado correctamente el proyecto en tu máquina y ya puedes utilizarlo.

### Endpoints de la API

La API cuenta con los siguientes endpoints separados en los siguientes grupos, a saber:

<div style="text-align: center;">
  <h3>AUTH</h3>
  <p>
    Relacionados con la autenticación, es decir, creación y confirmación de cuentas, login y contraseñas.
  </p>
</div>

### `POST /auth/create-account`

- **Título:** Create Account.

- **Descripción:** Crea una nueva cuenta de usuario y envía un código de confirmación por email.

- **Autenticado:** No aplica.

- **Modelo de Request Body (JSON):**

```json
{
  "name": "John",
  "lastName": "Smith",
  "email": "john.smith@imperatortask.com",
  "password": "12345678",
  "passwordConfirmation": "12345678"
}
```

- **Modelo de Response:**

```txt
Cuenta creada. Revisa tu email para confirmarla
```

---

### `POST /auth/confirm-account`

- **Título:** Confirm Account.

- **Descripción:** Confirma una nueva cuenta de usuario con un **token** de confirmación de 6 dígitos enviado a la casilla de email registrada. El token expira a los 5 minutos desde que fue creado.

- **Autenticado:** No aplica.

- **Modelo de Request Body (JSON):**

```json
{
  "token": "759308"
}
```

- **Modelo de Response:**

```txt
Cuenta confirmada correctamente. Ya puedes iniciar sesión
```

---

### `POST /auth/login`

- **Título:** Login.

- **Descripción:** Permite el login de un usuario.

- **Autenticado:** No aplica.

- **Modelo de Request Body (JSON):**

```json
{
  "email": "john.smith@imperatortask.com",
  "password": "12345678"
}
```

- **Modelo de Response:**

_Devuelve un **JSON Web Token** que posteriormente será utilizado para interactuar con los endpoints en los que se necesita estar autenticado. Este JWT tiene una validez de 7 días corridos desde el momento de su creación. Pasado ese tiempo expira y debe crearse uno nuevo._

---

### `POST /auth/request-code`

- **Título:** Request Confirmation Code.

- **Descripción:** Solicita un nuevo código o token de confirmación para una nueva cuenta creada enviándolo a la casilla de email registrada. El token expira a los 5 minutos desde que fue creado.

- **Autenticado:** No aplica.

- **Modelo de Request Body (JSON):**

```json
{
  "email": "john.smith@imperatortask.com"
}
```

- **Modelo de Response:**

```txt
Se envió un nuevo token a tu email
```

---

### `POST /auth/forgot-password`

- **Título:** Forgot Password.

- **Descripción:** Se envía un email a la casilla de email registrada con instrucciones para que el usuario pueda cambiar el password actual olvidado por uno nuevo.

- **Autenticado:** No aplica.

- **Modelo de Request Body (JSON):**

```json
{
  "email": "john.smith@imperatortask.com"
}
```

- **Modelo de Response:**

```txt
Revisa tu email para instrucciones
```

---

### `POST /auth/validate-token`

- **Título:** Validate Token.

- **Descripción:** Se utiliza para validar si un token de 6 dígitos es o no válido, es decir si es correcto su formato o si ya está expirado o no.

- **Autenticado:** No aplica.

- **Modelo de Request Body (JSON):**

```json
{
  "token": "964030"
}
```

- **Modelo de Response:**

```txt
Token válido. Define tu nueva contraseña
```

---

### `POST /auth/update-password/{token}`

- **Título:** Update Password With Token.

- **Descripción:** Se utiliza para validar si un token de 6 dígitos es o no válido, es decir si es correcto su formato o si ya está expirado o no.

- **Autenticado:** No aplica.

- **Modelo de Request Body (JSON):**

```json
{
  "password": "12345678",
  "passwordConfirmation": "12345678"
}
```

- **Parámetros:**
  - `token`: representa el código de 6 dígitos válido que se va a utilizar para actualizar la contraseña.

- **Modelo de Response:**

```txt
Tu contraseña se modificó correctamente. Ya puedes iniciar sesión
```

---

### `GET /auth/user`

- **Título:** Get Authenticated User.

- **Descripción:** Obtiene los datos importantes del usuario logueado.

- **Autenticado:** Sí, con Bearer Token.

- **Modelo de Request Body (JSON):**

```json
{
  "password": "12345678",
  "passwordConfirmation": "12345678"
}
```

- **Modelo de Response:**

```json
{
  "_id": "69932dca404603747f66d03e",
  "email": "john.smith@imperatortask.com",
  "name": "John",
  "lastName": "Smith"
}
```

---

### `POST /auth/check-password`

- **Título:** Check Password.

- **Descripción:** Chequea si la contraseña del usuario logueado es correcta.

- **Autenticado:** Sí, con Bearer Token.

- **Modelo de Request Body (JSON):**

```json
{
  "password": "12345678"
}
```

- **Modelo de Response:**

```txt
Contraseña correcta
```

<div style="text-align: center;">
  <h3>PROJECTS</h3>
  <p>
    Relacionados con la gestión de Proyectos.
  </p>
</div>

### `POST /projects`

- **Título:** Create Project.

- **Descripción:** Crear un proyecto nuevo para el usuario logueado.

- **Autenticado:** Sí, con Bearer Token.

- **Modelo de Request Body (JSON):**

```json
{
  "projectName": "Sistema de Ventas",
  "clientName": "John Smith Dash",
  "description": "Punto de Venta hecho en Java con React."
}
```

- **Modelo de Response:**

```txt
Proyecto creado correctamente
```

---

### `GET /projects`

- **Título:** Get All Projects.

- **Descripción:** Obtener todos los proyectos creados por el usuario logueado y en los que es colaborador.

- **Autenticado:** Sí, con Bearer Token.

- **Modelo de Request Body (JSON):** No aplica.

- **Modelo de Response:**

```json
[
  {
    "_id": "69936fc415817d95ecf77623",
    "projectName": "Sistema de Ventas",
    "clientName": "John Smith Dash",
    "description": "Punto de Venta hecho en Java con React.",
    "tasks": [],
    "team": [],
    "manager": "69932dca404603747f66d03e",
    "createdAt": "2026-02-16T19:28:04.885Z",
    "updatedAt": "2026-02-16T19:28:04.885Z",
    "__v": 0
  }
]
```

---

### `GET /projects/{projectId}`

- **Título:** Get Project By Id.

- **Descripción:** Obtener la información de un proyecto existente por su `id`.

- **Autenticado:** Sí, con Bearer Token.

- **Modelo de Request Body (JSON):**

```json
{
  "projectName": "Sistema de Ventas",
  "clientName": "John Smith Dash",
  "description": "Punto de Venta hecho en Java con React."
}
```

- **Parámetros:**
  - `projectId`: representa el `ObjectId` de MongoDB del proyecto almacenado en la base de datos.

- **Modelo de Response:**

```json
{
  "_id": "69936fc415817d95ecf77623",
  "projectName": "Sistema de Ventas",
  "clientName": "John Smith Dash",
  "description": "Punto de Venta hecho en Java con React.",
  "tasks": [],
  "team": [],
  "manager": "69932dca404603747f66d03e",
  "createdAt": "2026-02-16T19:28:04.885Z",
  "updatedAt": "2026-02-16T19:28:04.885Z",
  "__v": 0
}
```

---

### `PUT /projects/{projectId}`

- **Título:** Update Project.

- **Descripción:** Actualizar la información de un proyecto existente.

- **Autenticado:** Sí, con Bearer Token.

- **Modelo de Request Body (JSON):**

```json
{
  "projectName": "Sistema de Ventas",
  "clientName": "John Smith Dash",
  "description": "Punto de Venta hecho en Java con React."
}
```

- **Parámetros:**
  - `projectId`: representa el `ObjectId` de MongoDB del proyecto almacenado en la base de datos.

- **Modelo de Response:**

```txt
Proyecto actualizado correctamente
```

---

### `DELETE /projects/{projectId}`

- **Título:** Delete Project.

- **Descripción:** Eliminar un proyecto existente.

- **Autenticado:** Sí, con Bearer Token.

- **Modelo de Request Body (JSON):** No aplica.

- **Parámetros:**
  - `projectId`: representa el `ObjectId` de MongoDB del proyecto almacenado en la base de datos.

- **Modelo de Response:**

```txt
Proyecto eliminado correctamente
```

<div style="text-align: center;">
  <h3>TEAMS</h3>
  <p>
    Relacionados con la gestión de Colaboradores o Miembros de un Proyecto.
  </p>
</div>

### `POST /projects/{projectId}/team/find`

- **Título:** Find Member By Email.

- **Descripción:** Buscar un usuario para agregarlo como miembro colaborador de un Proyecto.

- **Autenticado:** Sí, con Bearer Token.

- **Modelo de Request Body (JSON):**

```json
{
  "email": "dina.isa@roma.com"
}
```

- **Parámetros:**
  - `projectId`: representa el `ObjectId` de MongoDB del proyecto almacenado en la base de datos.

- **Modelo de Response:**

```json
{
  "_id": "68869fa7a1192a9e62f1360c",
  "email": "dina.isa@roma.com",
  "name": "Dina",
  "lastName": "Isa"
}
```

---

### `GET /projects/{projectId}/team`

- **Título:** Get Project Team.

- **Descripción:** Obtener el equipo de colaboradores de un Proyecto.

- **Autenticado:** Sí, con Bearer Token.

- **Modelo de Request Body (JSON):** No aplica.

- **Parámetros:**
  - `projectId`: representa el `ObjectId` de MongoDB del proyecto almacenado en la base de datos.

- **Modelo de Response:**

```json
{
  "projectName": "Sistema de Ventas",
  "team": [
    {
      "_id": "68869fa7a1192a9e62f1360c",
      "email": "dina.isa@roma.com",
      "name": "Dina",
      "lastName": "Isa"
    }
  ]
}
```

---

### `POST /projects/{projectId}/team`

- **Título:** Add Member By Id.

- **Descripción:** Agregar un colaborador a un Proyecto utilizando su `id`.

- **Autenticado:** Sí, con Bearer Token.

- **Modelo de Request Body (JSON):**

```json
{
  "userId": "68869fa7a1192a9e62f1360c"
}
```

- **Parámetros:**
  - `projectId`: representa el `ObjectId` de MongoDB del proyecto almacenado en la base de datos.

- **Modelo de Response:**

```txt
Usuario agregado correctamente
```

---

### `DELETE /projects/{projectId}/team/{userId}`

- **Título:** Remove Member By Id.

- **Descripción:** Eliminar un colaborador de un Proyecto.

- **Autenticado:** Sí, con Bearer Token.

- **Modelo de Request Body (JSON):** No aplica.

- **Parámetros:**
  - `projectId`: representa el `ObjectId` de MongoDB del proyecto almacenado en la base de datos.
  - `userId`: representa el `ObjectId` de MongoDB del usuario almacenado en la base de datos.

- **Modelo de Response:**

```txt
Usuario removido correctamente
```

<div style="text-align: center;">
  <h3>TASKS</h3>
  <p>
    Relacionados con la gestión de Tareas de un Proyecto.
  </p>
</div>

### `POST /projects/{projectId}/tasks`

- **Título:** Create Task.

- **Descripción:** Crear una Tarea dentro de un Proyecto.

- **Autenticado:** Sí, con Bearer Token.

- **Modelo de Request Body (JSON):**

```json
{
  "name": "Nuevo nombre",
  "description": "Nueva descripción"
}
```

- **Parámetros:**
  - `projectId`: representa el `ObjectId` de MongoDB del proyecto almacenado en la base de datos.

- **Modelo de Response:**

```txt
Tarea creada correctamente
```

---

### `GET /projects/{projectId}/tasks`

- **Título:** Get Project Tasks.

- **Descripción:** Obtener todas las tareas dentro de un Proyecto.

- **Autenticado:** Sí, con Bearer Token.

- **Modelo de Request Body (JSON):** No aplica.

- **Parámetros:**
  - `projectId`: representa el `ObjectId` de MongoDB del proyecto almacenado en la base de datos.

- **Modelo de Response:**

```json
[
  {
    "_id": "69948d22eb7ed776b73f35af",
    "name": "Nuevo nombre",
    "description": "Nueva descripción",
    "status": "pending",
    "notes": [],
    "updatedBy": [],
    "project": {
      "_id": "699375aa15817d95ecf77633",
      "projectName": "Sistema de Ventas",
      "clientName": "John Smith Dash",
      "description": "Punto de Venta hecho en Java con React.",
      "tasks": ["69948d22eb7ed776b73f35af"],
      "team": ["68869fa7a1192a9e62f1360c"],
      "manager": "69932dca404603747f66d03e",
      "createdAt": "2026-02-16T19:53:14.809Z",
      "updatedAt": "2026-02-17T15:45:38.667Z",
      "__v": 4
    },
    "createdAt": "2026-02-17T15:45:38.667Z",
    "updatedAt": "2026-02-17T15:45:38.667Z",
    "__v": 0
  }
]
```

---

### `GET /projects/{projectId}/tasks/{taskId}`

- **Título:** Get Task By Id.

- **Descripción:** Obtener una tarea dentro de un Proyecto.

- **Autenticado:** Sí, con Bearer Token.

- **Modelo de Request Body (JSON):** No aplica.

- **Parámetros:**
  - `projectId`: representa el `ObjectId` de MongoDB del proyecto almacenado en la base de datos.
  - `taskId`: representa el `ObjectId` de MongoDB de la tarea almacenada en la base de datos.

- **Modelo de Response:**

```json
{
  "_id": "69948d22eb7ed776b73f35af",
  "name": "Nuevo nombre",
  "description": "Nueva descripción",
  "status": "pending",
  "notes": [],
  "updatedBy": [],
  "project": "699375aa15817d95ecf77633",
  "createdAt": "2026-02-17T15:45:38.667Z",
  "updatedAt": "2026-02-17T15:45:38.667Z",
  "__v": 0
}
```

---

### `PUT /projects/{projectId}/tasks/{taskId}`

- **Título:** Update Task.

- **Descripción:** Actualizar una tarea dentro de un Proyecto.

- **Autenticado:** Sí, con Bearer Token.

- **Modelo de Request Body (JSON):**

```json
{
  "name": "Nombre actualizado",
  "description": "Descripción actualizada"
}
```

- **Parámetros:**
  - `projectId`: representa el `ObjectId` de MongoDB del proyecto almacenado en la base de datos.
  - `taskId`: representa el `ObjectId` de MongoDB de la tarea almacenada en la base de datos.

- **Modelo de Response:**

```txt
Tarea actualizada correctamente
```

---

### `DELETE /projects/{projectId}/tasks/{taskId}`

- **Título:** Delete Task.

- **Descripción:** Eliminar una tarea dentro de un Proyecto.

- **Autenticado:** Sí, con Bearer Token.

- **Modelo de Request Body (JSON):** No aplica.

- **Parámetros:**
  - `projectId`: representa el `ObjectId` de MongoDB del proyecto almacenado en la base de datos.
  - `taskId`: representa el `ObjectId` de MongoDB de la tarea almacenada en la base de datos.

- **Modelo de Response:**

```txt
Tarea eliminada correctamente
```

---

### `POST /projects/{projectId}/tasks/{taskId}/status`

- **Título:** Update Status.

- **Descripción:** Actualizar el estado de una tarea dentro de un Proyecto.

- **Autenticado:** Sí, con Bearer Token.

- **Modelo de Request Body (JSON):**

```json
{
  "status": "inProgress"
}
```

- **Parámetros:**
  - `projectId`: representa el `ObjectId` de MongoDB del proyecto almacenado en la base de datos.
  - `taskId`: representa el `ObjectId` de MongoDB de la tarea almacenada en la base de datos.

- **Modelo de Response:**

```txt
Tarea actualizada correctamente
```

<div style="text-align: center;">
  <h3>NOTES</h3>
  <p>
    Relacionados con la gestión de Notas de una Tarea.
  </p>
</div>

### `POST /projects/{projectId}/tasks/{taskId}/notes`

- **Título:** Create Note.

- **Descripción:** Crear una nota dentro de una tarea de un Proyecto.

- **Autenticado:** Sí, con Bearer Token.

- **Modelo de Request Body (JSON):**

```json
{
  "content": "Este es un contenido de prueba."
}
```

- **Parámetros:**
  - `projectId`: representa el `ObjectId` de MongoDB del proyecto almacenado en la base de datos.
  - `taskId`: representa el `ObjectId` de MongoDB de la tarea almacenada en la base de datos.

- **Modelo de Response:**

```txt
Nota creada correctamente
```

---

### `GET /projects/{projectId}/tasks/{taskId}/notes`

- **Título:** Get Task Notes.

- **Descripción:** Obtener todas las notas dentro de una tarea de un Proyecto.

- **Autenticado:** Sí, con Bearer Token.

- **Modelo de Request Body (JSON):** No aplica.

- **Parámetros:**
  - `projectId`: representa el `ObjectId` de MongoDB del proyecto almacenado en la base de datos.
  - `taskId`: representa el `ObjectId` de MongoDB de la tarea almacenada en la base de datos.

- **Modelo de Response:**

```json
[
  {
    "_id": "6994a488eb7ed776b73f35e4",
    "content": "Este es un contenido de prueba.",
    "createdBy": "69932dca404603747f66d03e",
    "task": "6994941aeb7ed776b73f35c8",
    "createdAt": "2026-02-17T17:25:28.120Z",
    "updatedAt": "2026-02-17T17:25:28.120Z",
    "__v": 0
  }
]
```

---

### `DELETE /projects/{projectId}/tasks/{taskId}/notes/{noteId}`

- **Título:** Delete Note.

- **Descripción:** Eliminar una nota dentro de una tarea de un Proyecto.

- **Autenticado:** Sí, con Bearer Token.

- **Modelo de Request Body (JSON):** No aplica.

- **Parámetros:**
  - `projectId`: representa el `ObjectId` de MongoDB del proyecto almacenado en la base de datos.
  - `taskId`: representa el `ObjectId` de MongoDB de la tarea almacenada en la base de datos.
  - `noteId`: representa el `ObjectId` de MongoDB de la nota almacenada en la base de datos.

- **Modelo de Response:**

```txt
Nota eliminada correctamente
```

<div style="text-align: center;">
  <h3>PROFILE</h3>
  <p>
    Relacionados con la gestión del perfil de un Usuario logueado.
  </p>
</div>

### `PUT /auth/profile`

- **Título:** Update Profile.

- **Descripción:** Actualizar los datos del perfil del usuario logueado.

- **Autenticado:** Sí, con Bearer Token.

- **Modelo de Request Body (JSON):**

```json
{
  "name": "John M.",
  "lastName": "Smith",
  "email": "john.smith@imperatortask.com"
}
```

- **Parámetros:** No aplica.

- **Modelo de Response:**

```txt
Perfil actualizado correctamente
```

---

### `POST /auth/update-password`

- **Título:** Update Current User Password.

- **Descripción:** Actualizar la contraseña del usuario logueado.

- **Autenticado:** Sí, con Bearer Token.

- **Modelo de Request Body (JSON):**

```json
{
  "currentPassword": "12345678",
  "password": "87654321",
  "passwordConfirmation": "87654321"
}
```

- **Parámetros:** No aplica.

- **Modelo de Response:**

```txt
Tu contraseña se modificó correctamente
```

### Archivos JSON de endpoints y ambiente

En la raíz de este repositorio se adjuntan los archivos `.json` de Postman referentes a las **colecciones** de endpoints de la api (`ImperatorTask.postman_collection.json`) y del **environment** donde están las variables se utilizan en todas las colecciones (`ImperatorTask.postman_environment.json`).

Puedes abrir Postman e importar estos archivos para tener todas las colecciones y las variables del environment para así poder interactuar y probar la api.

<p style="text-align: right;">[<a href="#readme-top">volver hacia arriba</a>]</p>

<!-- MARKDOWN LINKS & IMAGES -->

[project-screenshot]: public/assets/img/imperatortask-screenshot.jpg
[Node.js]: https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white
[Typescript]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[Express.js]: https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white
[MongoDB]: https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white
