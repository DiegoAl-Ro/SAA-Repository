# PROMPTS.md — Registro de Ingeniería de Prompts (AeroGraff AI)

Este documento registra los prompts y la secuencia de interacción utilizada con los modelos de Inteligencia Artificial para la generación, estructuración y desarrollo del proyecto web **AeroGraff AI**.

---

## 📋 Metodología y Flujo de Trabajo

El desarrollo se ejecutó de forma modular siguiendo una estructura de diseño y código por capas (Backend $\rightarrow$ Frontend $\rightarrow$ DevOps & Scripting $\rightarrow$ Documentación).

---

## 💬 Secuencia de Prompts Utilizados

### Prompt 1: Generación del Backend (Node.js + Express + SQLite3 + Docker)

> **Rol / Contexto:** Desarrollador Senior Backend.
> 
> **Instrucción:**
> "Genera el código para la carpeta `backend/` de la empresa AeroGraff AI (arte urbano y publicidad con drones autónomos) con una API REST para gestionar un CRUD de 'Proyectos de Murales' (campos: `id`, `titulo`, `cliente`, `ubicacion`, `estado`, `presupuesto`) usando Node.js, Express y SQLite3 con datos persistentes. Pásame el código completo de:
> 1. `backend/package.json`
> 2. `backend/index.js`
> 3. `backend/Dockerfile` (expuesto en el puerto 3000)"

---

### Prompt 2: Generación del Frontend (HTML5 + CSS3 + Vanilla JS + Nginx)

> **Rol / Contexto:** Diseñador UI/UX & Desarrollador Frontend.
> 
> **Instrucción:**
> "Genera el código de la carpeta `frontend/` para AeroGraff AI:
> 1. `frontend/index.html`: Una landing page atractiva sobre la empresa (murales con drones) y una sección con tabla/formulario CRUD.
> 2. `frontend/styles.css`: Estilos visuales modernos y oscuros con temática de tecnología y arte urbano.
> 3. `frontend/app.js`: Lógica JavaScript nativa usando `fetch()` para conectar con el backend (puerto 3000) y hacer las operaciones CRUD (listar, crear, cambiar estado y eliminar).
> 4. `frontend/Dockerfile`: Usando Nginx para servir la web en el puerto 80."

---

### Prompt 3: Orquestación & Automation Scripts (Docker Compose & Bash/Batch)

> **Rol / Contexto:** Ingeniero DevOps.
> 
> **Instrucción:**
> "Genera el código para:
> 1. `docker-compose.yml`: Para orquestar los contenedores `frontend` y `backend` en la misma red de Docker.
> 2. `start.sh`: Script ejecutable Bash que levante el proyecto automáticamente.
> 3. `start.bat`: Script equivalente para Windows."

---

### Prompt 4: Documentación TÉCNICA Y README

> **Rol / Contexto:** Technical Writer / Product Owner.
> 
> **Instrucción:**
> "Genera el contenido completo en Markdown para el archivo `README.md`. Debe incluir: descripción del proyecto AeroGraff AI, tecnologías utilizadas, guía paso a paso para desplegarlo usando el script o Docker Compose, y una sección explicando las IAs usadas en el proceso."

---

## 🛠️ Buenas Prácticas de Prompting Aplicadas

* **Especificación de Contexto de Dominio**: Asignación directa de la identidad corporativa (*AeroGraff AI, drones y arte urbano*) para mantener la coherencia semántica y visual en el frontend.
* **Delimitación de Entradas y Salidas**: Definición explícita de campos de la base de datos, puertos de exposición (`3000` y `80`) y tecnologías requeridas por capa.
* **Separación Modular**: Petición de componentes de software de manera secuencial para evitar truncamiento de código en las respuestas.