# Usa una imagen ligera de Node
FROM node:18-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar package.json e instalar dependencias primero (cache layer)
COPY package*.json ./
RUN npm install --production

# Copiar el resto del código
COPY . .

# Exponer el puerto del orquestador
EXPOSE 8080

# Comando para iniciar
CMD ["npm", "start"]