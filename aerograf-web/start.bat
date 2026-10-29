@echo off
TITLE AeroGraff AI - Startup Script
cls

echo ==================================================
echo    Iniciando Plataforma Web de AeroGraff AI      
echo ==================================================

:: Verificar si Docker está instalado
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Docker no esta instalado o no se encuentra en el PATH.
    pause
    exit /b %errorlevel%
)

:: Crear archivo de BD SQLite vacio si no existe (evita que Docker cree una carpeta)
if not exist "backend\aerograff.db" (
    echo [INFO] Creando archivo SQLite persistente inicial (backend\aerograff.db)...
    type nul > "backend\aerograff.db"
)

echo [INFO] Construyendo y levantando contenedores con Docker Compose...
docker compose up --build -d

if %errorlevel% equ 0 (
    echo ==================================================
    echo [OK] AeroGraff AI iniciado con exito!
    echo.
    echo Frontend (Web Application): http://localhost
    echo Backend (API REST):        http://localhost:3000/api/proyectos
    echo ==================================================
) else (
    echo [ERROR] Ocurrio un problema al iniciar los servicios con Docker.
)

pause