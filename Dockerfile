# =========================
# 1. Build stage
# =========================
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Reemplaza el valor de VERSION con la versión que deseas mostrar en la aplicación
ARG VERSION
ENV VITE_APP_VERSION=$VERSION

RUN npm run build

# =========================
# 2. Nginx stage
# =========================
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]