FROM node:22-alpine AS base
WORKDIR /app

RUN corepack enable pnpm && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["pnpm", "exec", "next", "dev", "-H", "0.0.0.0", "-p", "3000"]

