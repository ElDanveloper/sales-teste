# frontend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 5173

# Importante: --host para o Vite aceitar conexões externas ao container
CMD ["npm", "run", "dev", "--", "--host"]
