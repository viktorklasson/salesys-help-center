# Production image for the help center (Next.js standalone output + Payload).
# Based on https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile
# Requires `output: 'standalone'` in next.config.ts.

FROM node:22.23.4-alpine AS base
ENV NEXT_TELEMETRY_DISABLED=1

# Install dependencies exactly as locked
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
# .npmrc sets legacy-peer-deps, which the lockfile was created with
COPY package.json package-lock.json .npmrc ./
RUN npm ci

# One-off content seeding (seed/content.json + seed/media) against the production database.
# Used by the `seed` service in docker-compose.yml; not part of the running app.
FROM base AS seed
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Same user as the app, so seeded media files stay writable for uploads from the admin panel
RUN mkdir -p media && chown 1001:1001 media
USER 1001
ENV NODE_OPTIONS=--no-deprecation
CMD ["node_modules/.bin/payload", "run", "src/scripts/seed-content.ts"]

# Build the app. All frontend pages are dynamic, so no database or secrets are needed here.
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image: only the standalone server and static assets
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs \
 && mkdir .next media \
 && chown nextjs:nodejs .next media

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
