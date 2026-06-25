FROM oven/bun:1.3.14 AS build
WORKDIR /app

COPY . .
RUN if [ -f bun.lock ]; then bun install --frozen-lockfile; else bun install; fi
RUN bun run build

FROM cgr.dev/chainguard/nginx:latest
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
