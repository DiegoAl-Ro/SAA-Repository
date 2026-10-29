# Usar imagen ligera oficial de Nginx basada en Alpine
FROM nginx:alpine

# Copiar los archivos estáticos del frontend al directorio de servicio de Nginx
COPY . /usr/share/nginx/html

# Exponer el puerto web estándar
EXPOSE 80

# Nginx se ejecuta por defecto en primer plano en esta imagen