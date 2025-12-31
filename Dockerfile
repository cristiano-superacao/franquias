# syntax=docker/dockerfile:1
# Usar Debian (glibc) para compatibilidade com Prisma
FROM node:20-bookworm-slim

WORKDIR /app

# Dependências de sistema necessárias
RUN apt-get update \
	&& apt-get install -y --no-install-recommends openssl ca-certificates \
	&& rm -rf /var/lib/apt/lists/*

# Instalar dependências
COPY package*.json ./
RUN npm ci

# Copiar código
COPY . .

# Gerar Prisma Client antes do build
RUN npx prisma generate

# Build de produção (Next.js)
RUN npm run build

# Ambiente de runtime
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

# Start do servidor com inicialização do Prisma
# Em runtime (com variáveis de ambiente) tenta aplicar migrations;
# se falhar, tenta db push; se ambos falharem, segue com a aplicação.
CMD ["sh","-c","set -ex; npx prisma generate; npx prisma migrate deploy || true; npx prisma db push; exec npm start"]
