# Usar imagen ligera oficial de Node.js
FROM node:20-alpine

# Instalar dependencias del sistema necesarias para compilar sqlite3 en Alpine
RUN apk add --no-cache python3 make g++

# Crear y definir el directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código del backend
COPY . .

# Exponer el puerto del servidor de API REST
EXPOSE 3000

# Comando para iniciar el servicio backend
CMD ["npm", "start"]