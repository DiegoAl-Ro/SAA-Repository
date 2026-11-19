---
name: api-validator
description: Asegura la validación de datos, seguridad SQLite y manejo de errores HTTP en el backend de Node/Express.
---
# Validador de API y Base de Datos
Usa esta skill cada vez que modifiques rutas de Express o tablas en `backend/aerograff.db`.
## Reglas Obligatorias
- **Consultas Parametrizadas:** Usa siempre placeholders (`?`) en SQLite para evitar inyección SQL.
- **Validación de Entradas:** Verifica tipos y rangos positivos (ej. metros cuadrados, altura, baterías) antes de insertar en la base de datos.
- **Respuestas JSON Estándar:** Devuelve siempre códigos de estado HTTP adecuados (`200`, `201`, `400`, `500`) con mensajes claros en español.
