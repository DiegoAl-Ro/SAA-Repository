# AeroGraff AI — Arte Urbano & Publicidad con Drones Autónomos

![AeroGraff AI](https://img.shields.io/badge/AeroGraff-AI-00f0ff?style=for-the-badge) 
![Node.js](https://img.shields.io/badge/Backend-Node.js_v20-green?style=for-the-badge&logo=nodedotjs)
![Docker](https://img.shields.io/badge/Deployment-Docker_Compose-2496ed?style=for-the-badge&logo=docker)

AeroGraff AI es una plataforma tecnológica integral diseñada para transformar fachadas urbanas y espacios de gran escala en lienzos dinámicos mediante enjambres de drones autónomos equipados con sistemas de micro-aspersión de alta precisión.

Este repositorio contiene la aplicación web corporativa y el panel de control de proyectos para la gestión centralizada de obras, presupuestos y estados de los murales.

---

## 🎨 Características Principales

* **Landing Page Corporativa**: Diseño futurista estilo *cyberpunk* enfocado en los servicios de muralismo, visión por computador y publicidad sostenible.
* **Gestor CRUD de Murales**: Panel interactivo para listar, crear, actualizar el estado (Planificación, En Progreso, Completado, Cancelado) y eliminar proyectos en tiempo real.
* **Persistencia de Datos**: Integración con SQLite3 con mapeo de volúmenes persistentes en Docker.
* **Despliegue Multiplataforma**: Scripts de inicio automatizados para entornos Linux/macOS y Windows.

---

## 🛠️ Tecnologías Utilizadas

### Frontend
* **HTML5 & CSS3**: Estilo visual oscuro con variables CSS, animaciones y diseño responsivo sin librerías externas.
* **JavaScript (Vanilla)**: Lógica nativa de cliente e integración mediante `fetch()` asíncrono.
* **Nginx (Alpine)**: Servidor web ligero de alto rendimiento para archivos estáticos.

### Backend
* **Node.js & Express**: API RESTful ligera y escalable.
* **SQLite3**: Base de datos embebida ligera con archivo persistente (`aerograff.db`).
* **CORS & Body-Parser**: Configuración segura de solicitudes cruzadas y procesamiento de payloads JSON.

### Infraestructura & DevOps
* **Docker & Docker Compose**: Contenerización aislada para backend y frontend bajo una red de tipo `bridge`.

---

## 🚀 Guía de Despliegue Rápido

### Requisitos Previos
* Tener instalado [Docker Desktop](https://www.docker.com/products/docker-desktop/) y asegurarse de que el demonio de Docker esté en ejecución.

---

### Opción A: Uso de Scripts Automatizados (Recomendado)

#### En Linux / macOS:
1. Abre tu terminal en la raíz del proyecto.
2. Otorga permisos de ejecución al script:
   ```bash
   chmod +x start.sh