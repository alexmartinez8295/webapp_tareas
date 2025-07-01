# Documentación de la Aplicación Web "Clarity Task Manager"

## 1. Introducción

"Clarity Task Manager" es una aplicación web diseñada para la gestión de proyectos y tareas. Permite a los usuarios crear proyectos, añadir tareas a esos proyectos, y gestionar el estado de las tareas a través de un intuitivo tablero Kanban. La aplicación cuenta con autenticación de usuarios, internacionalización (i18n) y un diseño único inspirado en una "consola de hacker", optimizado para dispositivos de escritorio y móviles.

## 2. Estructura del Proyecto

El proyecto está dividido en dos partes principales: el frontend (cliente) y el backend (servidor).

```
clarity-task-manager/
├── public/
├── server/                 # Lógica del backend (Node.js/Express)
│   ├── middleware/         # Middleware de autenticación
│   ├── models/             # Modelos de Mongoose (Task, Project, User)
│   ├── node_modules/
│   ├── routes/             # Definición de rutas de la API
│   ├── index.js            # Punto de entrada del servidor
│   ├── package.json
│   └── package-lock.json
├── src/                    # Código fuente del frontend (React)
│   ├── assets/
│   ├── components/         # Componentes reutilizables (si los hubiera)
│   ├── App.jsx             # Componente principal de la aplicación
│   ├── AuthContext.jsx     # Contexto para la autenticación
│   ├── DashboardPage.jsx   # Página del tablero principal
│   ├── LoginPage.jsx       # Página de inicio de sesión
│   ├── ProjectsPage.jsx    # Página para listar y crear proyectos
│   ├── RegisterPage.jsx    # Página de registro
│   ├── TasksPage.jsx       # Tablero Kanban de tareas por proyecto
│   ├── TaskDetailPage.jsx  # Página de detalles y edición de una tarea
│   ├── AllTasksPage.jsx    # Página para listar todas las tareas
│   ├── i18n.js             # Configuración de internacionalización
│   ├── theme.js            # Tema personalizado de Material-UI
│   └── main.jsx            # Punto de entrada del frontend
├── node_modules/
├── .gitignore
├── eslint.config.js
├── index.html              # Archivo HTML principal
├── package.json            # Dependencias y scripts del frontend
├── package-lock.json
├── README.md
├── vite.config.js          # Configuración de Vite
└── DOCUMENTACION.md        # Este documento
```

### Componentes Clave del Frontend (`src/`)

*   **`App.jsx`**: El componente raíz que configura las rutas de la aplicación, el tema de Material-UI y la navegación principal. Implementa la lógica de `PrivateRoute` para proteger rutas.
*   **`AuthContext.jsx`**: Provee un contexto de autenticación para gestionar el estado del usuario (token, carga, funciones de login/logout/registro) a través de la aplicación.
*   **`DashboardPage.jsx`**: Muestra un resumen de los proyectos y su progreso.
*   **`LoginPage.jsx`**: Interfaz de usuario para el inicio de sesión, con un diseño de dos columnas adaptable a diferentes tamaños de pantalla.
*   **`ProjectsPage.jsx`**: Permite a los usuarios ver una lista de sus proyectos y añadir nuevos.
*   **`TasksPage.jsx`**: Un tablero Kanban interactivo donde los usuarios pueden ver, crear y gestionar tareas asociadas a un proyecto específico. Permite arrastrar y soltar tareas entre diferentes estados.
*   **`TaskDetailPage.jsx`**: Muestra los detalles de una tarea individual y permite editar su título, descripción, fecha de vencimiento y reasignarla a otro proyecto.
*   **`AllTasksPage.jsx`**: Lista todas las tareas del usuario, independientemente del proyecto al que pertenezcan.
*   **`i18n.js`**: Configuración de `react-i18next` para la internacionalización, incluyendo las traducciones en inglés y español.
*   **`theme.js`**: Define el tema personalizado de Material-UI, aplicando un estilo de "consola de hacker" con colores oscuros, neón y tipografía monoespaciada.

### Componentes Clave del Backend (`server/`)

*   **`index.js`**: El archivo principal del servidor Express. Configura la conexión a la base de datos MongoDB, el middleware y las rutas de la API.
*   **`models/`**: Contiene los esquemas de Mongoose para `User`, `Project` y `Task`, definiendo la estructura de los datos en la base de datos.
*   **`routes/`**: Define las rutas de la API RESTful para la autenticación (`auth.js`), proyectos (`projects.js`) y tareas (`tasks.js`).
*   **`middleware/authMiddleware.js`**: Middleware para verificar tokens JWT y proteger rutas.

## 3. Tecnologías Utilizadas

### Frontend
*   **React**: Biblioteca de JavaScript para construir interfaces de usuario.
*   **Material-UI**: Biblioteca de componentes React que implementa el Material Design de Google, altamente personalizable.
*   **React Router DOM**: Para la gestión de rutas y navegación en la aplicación de una sola página (SPA).
*   **Axios**: Cliente HTTP basado en promesas para realizar solicitudes a la API backend.
*   **React-i18next**: Framework de internacionalización para React.
*   **React Beautiful DND**: Biblioteca para implementar la funcionalidad de arrastrar y soltar en los tableros Kanban.
*   **Vite**: Herramienta de construcción rápida para proyectos web modernos.

### Backend
*   **Node.js**: Entorno de ejecución de JavaScript del lado del servidor.
*   **Express.js**: Framework web para Node.js, utilizado para construir la API RESTful.
*   **MongoDB**: Base de datos NoSQL utilizada para almacenar los datos de la aplicación.
*   **Mongoose**: Librería de modelado de objetos para Node.js y MongoDB.
*   **JSON Web Tokens (JWT)**: Para la autenticación de usuarios y la protección de rutas.
*   **Bcrypt.js**: Para el hashing seguro de contraseñas.

## 4. Proceso de Creación y Modificaciones Clave

La aplicación fue construida de forma iterativa, añadiendo funcionalidades y mejorando la experiencia de usuario en cada paso.

*   **Configuración Inicial**: Se inició el proyecto con Vite y React, estableciendo una estructura básica de carpetas para el frontend y el backend.
*   **Autenticación**: Se implementó un sistema completo de autenticación con registro, inicio de sesión y cierre de sesión. Las contraseñas se hashean con Bcrypt.js y las sesiones se gestionan con JWT. Se creó un `AuthContext` para facilitar el acceso al estado de autenticación en toda la aplicación.
*   **Gestión de Proyectos**: Se desarrollaron las funcionalidades para crear, listar y navegar a los detalles de los proyectos.
*   **Tablero Kanban de Tareas**: La `TasksPage` fue transformada en un tablero Kanban interactivo. Se integró `react-beautiful-dnd` para permitir a los usuarios arrastrar y soltar tareas entre columnas de estado ("Por Hacer", "En Progreso", "Hecho"). Cada movimiento actualiza el estado de la tarea en el backend.
*   **Detalles y Edición de Tareas**: Se creó `TaskDetailPage` para proporcionar una vista detallada de cada tarea. Esta página permite a los usuarios editar el título, la descripción, la fecha de vencimiento y reasignar la tarea a un proyecto diferente.
*   **Listado de Todas las Tareas**: Se añadió `AllTasksPage` y una opción en el menú principal para ver todas las tareas del usuario en un solo lugar.
*   **Internacionalización (i18n)**: Se configuró `react-i18next` para soportar múltiples idiomas (inglés y español). Todas las cadenas de texto visibles para el usuario se han traducido.
*   **Diseño "Hacker Console" y Responsividad**: Se creó un tema personalizado de Material-UI (`theme.js`) para dar a la aplicación una estética de "consola de hacker" con una paleta de colores oscuros y neón. Se realizaron ajustes en `App.jsx` y otros componentes para asegurar que el diseño sea completamente responsivo y funcione bien en dispositivos móviles (teléfonos, tablets) y de escritorio.
*   **Optimización de Rutas de API**: Se ajustaron las rutas del backend (`server/routes/tasks.js`) para soportar las operaciones de `PATCH` y `GET` para tareas individuales, asegurando la comunicación correcta entre el frontend y el backend.
*   **Eliminación de Funcionalidad de Pagos**: La funcionalidad de pagos previamente existente fue eliminada del frontend y sus archivos asociados.

## 5. Cómo Ejecutar la Aplicación

Para ejecutar la aplicación localmente, sigue los siguientes pasos:

### Requisitos
*   Node.js (versión 14 o superior)
*   MongoDB (servidor en ejecución)

### Pasos

1.  **Clonar el Repositorio** (si aplica):
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd clarity-task-manager
    ```

2.  **Instalar Dependencias del Backend**:
    ```bash
    cd server
    npm install
    ```

3.  **Configurar Variables de Entorno del Backend**:
    Crea un archivo `.env` en el directorio `server/` con las siguientes variables (ejemplo):
    ```
    MONGO_URI=mongodb://localhost:27017/claritytaskmanager
    JWT_SECRET=tu_secreto_jwt_seguro
    PORT=5000
    ```
    Asegúrate de reemplazar `tu_secreto_jwt_seguro` con una cadena aleatoria y segura.

4.  **Iniciar el Servidor Backend**:
    ```bash
    node index.js
    # O si usas nodemon para desarrollo:
    # nodemon index.js
    ```
    El servidor se ejecutará en `http://localhost:5000`.

5.  **Instalar Dependencias del Frontend**:
    Abre una nueva terminal y ve al directorio raíz del proyecto:
    ```bash
    cd .. # Si estás en el directorio 'server'
    npm install
    ```

6.  **Iniciar el Frontend**:
    ```bash
    npm run dev
    ```
    El frontend se ejecutará en `http://localhost:5173` (o un puerto similar).

Ahora puedes acceder a la aplicación en tu navegador y comenzar a usar "Clarity Task Manager".

## 6. Consideraciones Adicionales

*   **Seguridad**: Asegúrate de usar secretos JWT fuertes y de proteger adecuadamente tu base de datos en entornos de producción.
*   **Escalabilidad**: La arquitectura modular permite añadir nuevas funcionalidades y componentes de manera organizada.
*   **Personalización**: El tema de Material-UI es fácilmente personalizable a través de `src/theme.js` para adaptar la apariencia a tus necesidades.
