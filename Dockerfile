# Usa la imagen base de Node.js
FROM node:20

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el package.json y package-lock.json al contenedor
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install

# Copia el resto del código de la aplicación al contenedor
COPY . .

# Exponemos el puerto en el que corre la API (3000 es un ejemplo)
EXPOSE 3000

# Comando para correr la aplicación
CMD ["npm", "start"]