#!/bin/bash

echo "=================================================="
echo "   Iniciando Plataforma Web de AeroGraff AI      "
echo "=================================================="

# Comprobar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker no está instalado. Por favor instálalo primero."
    exit 1
fi

# Crear archivo de BD SQLite si no existe para prevenir que Docker cree un directorio
if [ ! -f ./backend/aerograff.db ]; then
    echo "📄 Creando archivo SQLite persistente inicial (backend/aerograff.db)..."
    touch ./backend/aerograff.db
fi

echo "🚀 Construyendo y levantando contenedores con Docker Compose..."
docker compose up --build -d

if [ $? -eq 0 ]; then
    echo "=================================================="
    echo "✅ AeroGraff AI iniciado con éxito!"
    echo "🌐 Frontend (Web Application): http://localhost"
    echo "⚙️ Backend (API REST):        http://localhost:3000/api/proyectos"
    echo "=================================================="
else
    echo "❌ Ocurrió un error al iniciar los servicios."
fi