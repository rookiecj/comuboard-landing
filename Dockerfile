FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Landing build args (URL references for CTA links)
ARG VITE_BASE_PATH
ARG VITE_APP_URL
ARG VITE_API_URL
# Runtime environment indicator (development | staging | production) for the
# top-right EnvBadge. Empty default → src/config.ts falls back to DEV.
ARG VITE_APP_ENV=
# BUG-189-01: Sentry build ARGs — Vite inlines import.meta.env.VITE_* at
# build time. Empty defaults are intentional — empty DSN triggers no-op
# init in src/sentry.ts (silent without Sentry).
ARG VITE_SENTRY_DSN=
ARG VITE_SENTRY_ENV=production
ARG VITE_SENTRY_RELEASE=
ARG VITE_SENTRY_SAMPLE_RATE=1.0
ARG VITE_SENTRY_TRACES_SAMPLE_RATE=0.1
RUN VITE_BASE_PATH=${VITE_BASE_PATH} VITE_APP_URL=${VITE_APP_URL} VITE_API_URL=${VITE_API_URL} \
    VITE_APP_ENV=${VITE_APP_ENV} \
    VITE_SENTRY_DSN=${VITE_SENTRY_DSN} \
    VITE_SENTRY_ENV=${VITE_SENTRY_ENV} \
    VITE_SENTRY_RELEASE=${VITE_SENTRY_RELEASE} \
    VITE_SENTRY_SAMPLE_RATE=${VITE_SENTRY_SAMPLE_RATE} \
    VITE_SENTRY_TRACES_SAMPLE_RATE=${VITE_SENTRY_TRACES_SAMPLE_RATE} \
    npm run build

# SPRINT-193 BUG-192-01 fix: nginxinc/nginx-unprivileged image swap
# - uid=101 default + cap_net_bind_service file capability 사전 적용
# - port 80 → 8080 (Service contract port 80 유지, targetPort 8080)
FROM nginxinc/nginx-unprivileged:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
