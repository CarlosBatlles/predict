# Usar imagen oficial de Node (ligera)
FROM node:22-slim

# Directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto del servicio Acquire (3001 según contrato)
EXPOSE 3001

# Comando de inicio
CMD ["node", "server.js"]