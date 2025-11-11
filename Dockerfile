# Dockerfile
FROM node:22.12-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# --- Production stage ---
FROM node:22.12-alpine AS runner
WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev

EXPOSE 3000
CMD ["node", "build"]