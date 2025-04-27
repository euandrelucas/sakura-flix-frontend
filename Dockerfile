FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: imagem final
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/package.json ./

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]
