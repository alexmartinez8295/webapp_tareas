# Estructura Detallada del Proyecto "Clarity Task Manager"

## 1. Introducción

Este documento tiene como objetivo proporcionar una explicación exhaustiva de la estructura del proyecto "Clarity Task Manager", detallando la función y propósito de cada directorio, archivo y componente clave. Comprender esta estructura es fundamental para el mantenimiento, la depuración y la futura expansión de la aplicación.

El proyecto sigue una arquitectura de cliente-servidor (frontend-backend), donde el frontend es una aplicación React y el backend es una API RESTful construida con Node.js y Express.

## 2. Estructura General del Proyecto

La raíz del proyecto `clarity-task-manager/` se divide en dos directorios principales que encapsulan la lógica del frontend y el backend, junto con archivos de configuración globales.

```
clarity-task-manager/
├── public/                 # Archivos estáticos públicos del frontend
├── server/                 # Lógica del backend (API RESTful)
├── src/                    # Código fuente del frontend (Aplicación React)
├── node_modules/           # Dependencias de Node.js (frontend)
├── .gitignore              # Archivo de configuración de Git
├── eslint.config.js        # Configuración de ESLint
├── index.html              # Plantilla HTML principal del frontend
├── package.json            # Metadatos y dependencias del frontend
├── package-lock.json       # Bloqueo de versiones de dependencias
├── README.md               # Descripción general del proyecto
├── vite.config.js          # Configuración del bundler Vite
└── DOCUMENTACION.md        # Documento de alto nivel del proyecto
└── ESTRUCTURA_DETALLADA.md # Este documento
```

## 3. Detalle del Frontend (`src/`)

El directorio `src/` contiene todo el código fuente de la aplicación React. Está organizado para facilitar la modularidad y la separación de responsabilidades.

```
src/
├── assets/                 # Recursos como imágenes, íconos, etc.
├── components/             # Componentes React reutilizables (si los hubiera)
├── App.jsx                 # Componente principal de la aplicación
├── AuthContext.jsx         # Contexto de autenticación global
├── DashboardPage.jsx       # Página del tablero principal
├── LoginPage.jsx           # Página de inicio de sesión
├── ProjectsPage.jsx        # Página de gestión de proyectos
├── RegisterPage.jsx        # Página de registro de usuario
├── TasksPage.jsx           # Tablero Kanban de tareas por proyecto
├── TaskDetailPage.jsx      # Página de detalles y edición de una tarea
├── AllTasksPage.jsx        # Página para listar todas las tareas
├── i18n.js                 # Configuración de internacionalización
├── theme.js                # Tema personalizado de Material-UI
└── main.jsx                # Punto de entrada de la aplicación React
```

### 3.1. Archivos y Componentes Clave del Frontend

*   **`src/App.jsx`**
    *   **Propósito:** Es el componente raíz de la aplicación. Se encarga de la configuración global, como el enrutamiento, la aplicación del tema y la gestión de la navegación principal.
    *   **Funcionalidad:**
        *   Define las rutas de la aplicación (`react-router-dom`) para navegar entre diferentes vistas (login, registro, dashboard, proyectos, tareas, detalles de tarea).
        *   Integra `ThemeProvider` de Material-UI para aplicar el tema personalizado (`theme.js`) a toda la aplicación.
        *   Implementa la lógica del `Drawer` (menú lateral) responsivo, que se adapta a dispositivos móviles (temporal) y de escritorio (permanente) usando `useMediaQuery` y `useState` (`mobileOpen`).
        *   Maneja el cambio de idioma a través de `useTranslation` de `react-i18next`.
        *   Utiliza el `AuthContext` para gestionar el estado de autenticación del usuario y proteger rutas (`PrivateRoute`).

*   **`src/AuthContext.jsx`**
    *   **Propósito:** Proporciona un contexto de autenticación global para toda la aplicación. Esto permite que cualquier componente anidado acceda al estado de autenticación del usuario (token, información del usuario, estado de carga) y a las funciones de autenticación (login, register, logout) sin necesidad de pasar props manualmente a través de múltiples niveles.
    *   **Funcionalidad:**
        *   Utiliza `React.createContext` para crear el contexto.
        *   Maneja el estado del token JWT y el estado de carga (`loading`) usando `useState`.
        *   Implementa las funciones `login`, `register` y `logout`, que interactúan con la API del backend (`axios`) y gestionan el token en `localStorage`.
        *   El `useEffect` inicial verifica si hay un token guardado en `localStorage` al cargar la aplicación para mantener la sesión del usuario.

*   **`src/DashboardPage.jsx`**
    *   **Propósito:** Muestra un resumen visual del progreso de los proyectos del usuario.
    *   **Funcionalidad:**
        *   Obtiene la lista de proyectos del backend (`/api/projects`).
        *   Para cada proyecto, realiza una solicitud adicional para obtener sus tareas (`/api/tasks/project/:projectId`).
        *   Calcula el progreso de cada proyecto (tareas completadas vs. tareas totales) y lo muestra con una barra de progreso (`LinearProgress`).

*   **`src/LoginPage.jsx`**
    *   **Propósito:** Proporciona la interfaz de usuario para que los usuarios inicien sesión en la aplicación.
    *   **Funcionalidad:**
        *   Presenta un formulario de inicio de sesión con campos para email y contraseña.
        *   Implementa un diseño de dos columnas para escritorio (formulario a la izquierda, área configurable a la derecha) y se adapta a una sola columna apilada para dispositivos móviles (`useMediaQuery`, `flexDirection`).
        *   Maneja el estado de los campos de entrada (`useState`) y la lógica de envío del formulario (`handleSubmit`).
        *   Permite alternar la visibilidad de la contraseña.
        *   Incluye un selector de idioma.
        *   Interactúa con el `AuthContext` para realizar la autenticación.

*   **`src/ProjectsPage.jsx`**
    *   **Propósito:** Permite a los usuarios ver una lista de sus proyectos y añadir nuevos proyectos.
    *   **Funcionalidad:**
        *   Obtiene la lista de proyectos del backend (`/api/projects`).
        *   Proporciona un diálogo (`Dialog`) para añadir nuevos proyectos con campos para nombre y descripción.
        *   Navega a la `TasksPage` (el tablero Kanban de tareas) cuando se hace clic en un proyecto específico.

*   **`src/RegisterPage.jsx`**
    *   **Propósito:** Proporciona la interfaz de usuario para que los nuevos usuarios se registren en la aplicación.
    *   **Funcionalidad:**
        *   Presenta un formulario de registro con campos para nombre de usuario, email y contraseña.
        *   Maneja el estado de los campos de entrada y la lógica de envío del formulario.
        *   Interactúa con el `AuthContext` para realizar el registro de nuevos usuarios.

*   **`src/TasksPage.jsx`**
    *   **Propósito:** Es el tablero Kanban interactivo para gestionar las tareas de un proyecto específico.
    *   **Funcionalidad:**
        *   Utiliza `react-beautiful-dnd` para permitir la funcionalidad de arrastrar y soltar tareas entre diferentes columnas de estado ("To Do", "In Progress", "Done").
        *   Obtiene las tareas asociadas al `projectId` actual del backend (`/api/tasks/project/:projectId`) y las organiza por estado.
        *   Cuando una tarea se arrastra a una nueva columna, actualiza su estado en el backend mediante una solicitud `PATCH` a `/api/tasks/:id`.
        *   Proporciona un diálogo para añadir nuevas tareas con campos para título, descripción y un selector de proyecto.
        *   Navega a la `TaskDetailPage` cuando se hace clic en una tarjeta de tarea.
        *   **Estilo:** La descripción de la tarea en la vista Kanban se trunca con puntos suspensivos (`textOverflow: 'ellipsis'`) para mantener la limpieza visual.

*   **`src/TaskDetailPage.jsx`**
    *   **Propósito:** Muestra los detalles completos de una tarea individual y permite su edición.
    *   **Funcionalidad:**
        *   Obtiene los detalles de una tarea específica del backend (`/api/tasks/:taskId`).
        *   Implementa un "modo de edición" (`editMode`) que alterna entre la visualización de los detalles y un formulario editable.
        *   Permite actualizar el título, la descripción, la fecha de vencimiento y reasignar la tarea a un proyecto diferente (obteniendo la lista de todos los proyectos disponibles).
        *   Envía las actualizaciones al backend mediante una solicitud `PATCH` a `/api/tasks/:id`.
        *   **Estilo:** La descripción de la tarea en esta vista también se trunca para una mejor presentación inicial, aunque el campo de edición mostrará la descripción completa.

*   **`src/AllTasksPage.jsx`**
    *   **Propósito:** Muestra una lista de todas las tareas del usuario, independientemente del proyecto al que pertenezcan.
    *   **Funcionalidad:**
        *   Obtiene todas las tareas del usuario del backend (`/api/tasks/user`).
        *   Permite añadir nuevas tareas, incluyendo la asignación a un proyecto existente o a ningún proyecto.
        *   Navega a la `TaskDetailPage` cuando se hace clic en una tarea.

*   **`src/i18n.js`**
    *   **Propósito:** Configura la biblioteca `i18next` y `react-i18next` para la internacionalización de la aplicación.
    *   **Funcionalidad:**
        *   Define los recursos de traducción (`resources`) para diferentes idiomas (actualmente inglés `en` y español `es`). Cada idioma tiene un objeto `translation` con pares clave-valor para las cadenas de texto.
        *   Inicializa `i18next` con el idioma por defecto (`lng: 'es'`) y otras opciones de configuración.

*   **`src/theme.js`**
    *   **Propósito:** Define el tema personalizado de Material-UI para la aplicación, dándole una estética de "consola de hacker".
    *   **Funcionalidad:**
        *   Utiliza `createTheme` de Material-UI para definir una paleta de colores oscura (`mode: 'dark'`) con acentos de neón (verde primario, cian secundario).
        *   Configura la tipografía para usar una fuente monoespaciada (`"Roboto Mono", monospace`).
        *   Sobrescribe los estilos por defecto de varios componentes de Material-UI (como `AppBar`, `Drawer`, `Button`, `TextField`, `Paper`, `Dialog`, `List`, `ListItem`, `ListItemText`) para aplicar los colores, bordes y sombras que refuerzan el estilo de consola.
        *   Aplica `responsiveFontSizes` para asegurar que el tamaño de la fuente se adapte bien a diferentes tamaños de pantalla.

*   **`src/main.jsx`**
    *   **Propósito:** Es el punto de entrada principal de la aplicación React.
    *   **Funcionalidad:**
        *   Importa el componente `ThemedApp` (que es el `App` envuelto en el `ThemeProvider`).
        *   Utiliza `ReactDOM.createRoot` para renderizar la aplicación en el elemento `div` con `id="root"` en `index.html`.

*   **`public/`**
    *   **Propósito:** Contiene archivos estáticos que se sirven directamente sin ser procesados por el bundler (Vite).
    *   **Contenido:** Típicamente incluye `index.html`, `favicon.ico`, y otros assets que no necesitan ser importados directamente en el código JavaScript.

*   **`index.html`**
    *   **Propósito:** Es la plantilla HTML principal de la aplicación.
    *   **Contenido:**
        *   Define la estructura básica de la página web.
        *   Incluye la etiqueta `<meta name="viewport" content="width=device-width, initial-scale=1.0" />` crucial para la responsividad en dispositivos móviles.
        *   Contiene un `div` con `id="root"` donde la aplicación React será montada.
        *   Carga el script `src/main.jsx` como un módulo.

*   **`package.json` (Frontend)**
    *   **Propósito:** Archivo de configuración para el frontend.
    *   **Contenido:**
        *   Metadatos del proyecto (nombre, versión).
        *   `dependencies`: Lista las bibliotecas y paquetes de los que depende el frontend (React, Material-UI, react-router-dom, axios, react-i18next, react-beautiful-dnd, framer-motion, etc.).
        *   `devDependencies`: Lista las dependencias utilizadas solo durante el desarrollo (Vite, ESLint).
        *   `scripts`: Define comandos de línea de comandos para tareas comunes (ej. `npm run dev` para iniciar el servidor de desarrollo, `npm run build` para compilar la aplicación para producción).

*   **`vite.config.js`**
    *   **Propósito:** Archivo de configuración para Vite, el bundler utilizado para el frontend.
    *   **Contenido:**
        *   Configura cómo Vite debe construir y servir la aplicación React.
        *   Especifica los plugins a usar (ej. `@vitejs/plugin-react`).

## 4. Detalle del Backend (`server/`)

El directorio `server/` contiene la lógica del servidor Node.js/Express que actúa como la API RESTful para la aplicación.

```
server/
├── middleware/             # Middleware de Express
├── models/                 # Modelos de datos de Mongoose
├── node_modules/           # Dependencias de Node.js (backend)
├── routes/                 # Definición de rutas de la API
├── index.js                # Punto de entrada del servidor
├── package.json            # Metadatos y dependencias del backend
├── package-lock.json       # Bloqueo de versiones de dependencias
└── .env                    # Variables de entorno (no versionado)
```

### 4.1. Archivos y Componentes Clave del Backend

*   **`server/index.js`**
    *   **Propósito:** Es el punto de entrada principal del servidor Express.
    *   **Funcionalidad:**
        *   Inicializa la aplicación Express.
        *   Establece la conexión con la base de datos MongoDB utilizando Mongoose.
        *   Configura el middleware global (ej. `express.json()` para parsear JSON en las solicitudes, `cors` para permitir solicitudes desde el frontend).
        *   Monta las rutas de la API (`app.use('/api/auth', authRoutes)`).
        *   Inicia el servidor Express en un puerto específico.

*   **`server/models/`**
    *   **Propósito:** Contiene las definiciones de los esquemas de Mongoose para los modelos de datos de la aplicación. Estos esquemas definen la estructura y las reglas de validación para los documentos almacenados en MongoDB.
    *   **Contenido:**
        *   **`User.js`**: Define el esquema para los usuarios (ej. `username`, `email`, `password`).
        *   **`Project.js`**: Define el esquema para los proyectos (ej. `name`, `description`, `user` - referencia al usuario que lo creó).
        *   **`Task.js`**: Define el esquema para las tareas (ej. `title`, `description`, `status`, `project` - referencia al proyecto al que pertenece, `user` - referencia al usuario que la creó, `dueDate`).

*   **`server/routes/`**
    *   **Propósito:** Contiene los archivos que definen las rutas específicas de la API RESTful para diferentes recursos. Cada archivo exporta un `express.Router`.
    *   **Contenido:**
        *   **`auth.js`**: Define las rutas relacionadas con la autenticación de usuarios (ej. `POST /api/auth/register` para registrar, `POST /api/auth/login` para iniciar sesión).
        *   **`projects.js`**: Define las rutas para las operaciones CRUD (Crear, Leer, Actualizar, Eliminar) de proyectos (ej. `GET /api/projects`, `POST /api/projects`).
        *   **`tasks.js`**: Define las rutas para las operaciones CRUD de tareas. Incluye rutas específicas para:
            *   `GET /api/tasks/project/:projectId`: Obtener tareas de un proyecto específico.
            *   `GET /api/tasks/user`: Obtener todas las tareas del usuario autenticado.
            *   `POST /api/tasks`: Crear una nueva tarea.
            *   `GET /api/tasks/:id`: Obtener una tarea por su ID.
            *   `PATCH /api/tasks/:id`: Actualizar parcialmente una tarea (ej. cambiar estado, título, descripción, fecha de vencimiento, o reasignar proyecto).

*   **`server/middleware/authMiddleware.js`**
    *   **Propósito:** Es un middleware de Express utilizado para proteger las rutas de la API que requieren autenticación.
    *   **Funcionalidad:**
        *   Extrae el token JWT del encabezado `x-auth-token` de la solicitud.
        *   Verifica la validez del token utilizando el secreto JWT configurado.
        *   Si el token es válido, decodifica la información del usuario (ej. `id`) y la adjunta al objeto `req.user`, permitiendo que las rutas posteriores accedan a la información del usuario autenticado.
        *   Si el token no es válido o no está presente, devuelve un error de autenticación.

*   **`server/package.json` (Backend)**
    *   **Propósito:** Archivo de configuración para el backend.
    *   **Contenido:**
        *   Metadatos del proyecto (nombre, versión).
        *   `dependencies`: Lista las bibliotecas y paquetes de los que depende el backend (express, mongoose, jsonwebtoken, bcryptjs, cors, dotenv, etc.).
        *   `devDependencies`: Lista las dependencias utilizadas solo durante el desarrollo (ej. `nodemon` para reiniciar el servidor automáticamente).
        *   `scripts`: Define comandos para iniciar el servidor.

*   **`server/.env`**
    *   **Propósito:** Almacena variables de entorno sensibles o específicas del entorno (como credenciales de base de datos, secretos JWT, puertos). **Este archivo no debe ser versionado en Git** (`.gitignore` lo excluye).
    *   **Contenido:**
        *   `MONGO_URI`: La cadena de conexión a tu base de datos MongoDB.
        *   `JWT_SECRET`: Una cadena secreta utilizada para firmar y verificar los tokens JWT.
        *   `PORT`: El puerto en el que el servidor backend escuchará las solicitudes.

## 5. Archivos de Configuración Globales

*   **`.gitignore`**
    *   **Propósito:** Le dice a Git qué archivos y directorios debe ignorar y no incluir en el control de versiones.
    *   **Contenido:** Incluye directorios como `node_modules/` (dependencias instaladas), archivos de configuración de entorno (`.env`), logs, etc.

*   **`package.json` (Raíz del Proyecto)**
    *   **Propósito:** En un monorepo o un proyecto con frontend y backend en la misma raíz, este `package.json` puede contener scripts para ejecutar ambos, o simplemente metadatos generales del proyecto. En este caso, es el `package.json` principal del frontend.

*   **`package-lock.json`**
    *   **Propósito:** Registra el árbol exacto de dependencias que se instalaron. Esto asegura que las instalaciones futuras de las dependencias resulten en el mismo árbol exacto, independientemente de las actualizaciones de las dependencias intermedias.

*   **`README.md`**
    *   **Propósito:** Proporciona una descripción general del proyecto, instrucciones de instalación y uso, y cualquier otra información relevante para los usuarios o colaboradores.

---