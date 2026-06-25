FROM oven/bun:1.3.14 AS build
WORKDIR /app

COPY . .
RUN if [ -f bun.lock ]; then bun install --frozen-lockfile; else bun install; fi
RUN bun run build

FROM nginxinc/nginx-unprivileged:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
